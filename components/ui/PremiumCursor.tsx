"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface CursorState {
  isVisible: boolean;
  isHovering: boolean;
  isClicking: boolean;
  cursorType: "default" | "pointer" | "text" | "grab" | "expand";
  cursorText: string;
}

/**
 * PremiumCursor - An enhanced custom cursor with context-aware states.
 *
 * Features:
 * - Smooth spring-based following
 * - Context-aware cursor states (pointer, text, grab, expand)
 * - Click feedback animation
 * - Trailing particles effect
 * - Magnetic attraction to interactive elements
 * - Respects prefers-reduced-motion
 */
export default function PremiumCursor() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [state, setState] = useState<CursorState>({
    isVisible: false,
    isHovering: false,
    isClicking: false,
    cursorType: "default",
    cursorText: "",
  });

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Dual spring configs for outer ring and inner dot
  const springConfigOuter = { damping: 28, stiffness: 180, mass: 0.5 };
  const springConfigInner = { damping: 35, stiffness: 350, mass: 0.2 };

  const cursorXSpringOuter = useSpring(cursorX, springConfigOuter);
  const cursorYSpringOuter = useSpring(cursorY, springConfigOuter);
  const cursorXSpringInner = useSpring(cursorX, springConfigInner);
  const cursorYSpringInner = useSpring(cursorY, springConfigInner);

  // Trail particles state
  const [trails, setTrails] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const trailIdRef = useRef(0);
  const lastTrailTimeRef = useRef(0);

  // Magnetic effect references
  const magneticElementRef = useRef<HTMLElement | null>(null);
  const magneticOffsetX = useMotionValue(0);
  const magneticOffsetY = useMotionValue(0);
  const magneticSpring = { damping: 20, stiffness: 150 };
  const magneticXSpring = useSpring(magneticOffsetX, magneticSpring);
  const magneticYSpring = useSpring(magneticOffsetY, magneticSpring);

  // Handle cursor movement
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const { clientX, clientY } = e;
      cursorX.set(clientX);
      cursorY.set(clientY);

      if (!state.isVisible) {
        setState((prev) => ({ ...prev, isVisible: true }));
      }

      // Add trail particles (throttled)
      if (!prefersReducedMotion) {
        const now = Date.now();
        if (now - lastTrailTimeRef.current > 50) {
          lastTrailTimeRef.current = now;
          const newTrail = {
            id: trailIdRef.current++,
            x: clientX,
            y: clientY,
          };
          setTrails((prev) => [...prev.slice(-5), newTrail]);

          // Auto-remove trail after animation
          setTimeout(() => {
            setTrails((prev) => prev.filter((t) => t.id !== newTrail.id));
          }, 500);
        }
      }

      // Magnetic effect on interactive elements
      const target = e.target as HTMLElement;
      const magneticElement = target.closest("[data-magnetic]") as HTMLElement;

      if (magneticElement && !prefersReducedMotion) {
        magneticElementRef.current = magneticElement;
        const rect = magneticElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;

        // Apply magnetic pull (cursor moves toward element center)
        magneticOffsetX.set(distanceX * 0.2);
        magneticOffsetY.set(distanceY * 0.2);
      } else {
        magneticElementRef.current = null;
        magneticOffsetX.set(0);
        magneticOffsetY.set(0);
      }
    },
    [cursorX, cursorY, state.isVisible, prefersReducedMotion, magneticOffsetX, magneticOffsetY]
  );

  // Detect hover state and cursor type
  const checkHoverState = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // Check for specific cursor types
    const isButton = target.tagName === "BUTTON" || target.closest("button");
    const isLink = target.tagName === "A" || target.closest("a");
    const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.closest("input, textarea");
    const isGrabable = target.classList.contains("cursor-grab") || target.closest(".cursor-grab");
    const isExpandable = target.hasAttribute("data-cursor-expand") || target.closest("[data-cursor-expand]");
    const cursorTextElement = target.closest("[data-cursor-text]");
    const cursorText = cursorTextElement?.getAttribute("data-cursor-text") || "";

    const isInteractive = isButton || isLink || target.classList.contains("cursor-pointer") || target.closest(".cursor-pointer");

    let cursorType: CursorState["cursorType"] = "default";
    if (isExpandable) cursorType = "expand";
    else if (isGrabable) cursorType = "grab";
    else if (isInput) cursorType = "text";
    else if (isInteractive) cursorType = "pointer";

    setState((prev) => ({
      ...prev,
      isHovering: !!isInteractive || !!isExpandable,
      cursorType,
      cursorText,
    }));
  }, []);

  // Handle click state
  const handleMouseDown = useCallback(() => {
    setState((prev) => ({ ...prev, isClicking: true }));
  }, []);

  const handleMouseUp = useCallback(() => {
    setState((prev) => ({ ...prev, isClicking: false }));
  }, []);

  // Handle visibility
  const handleMouseEnter = useCallback(() => {
    setState((prev) => ({ ...prev, isVisible: true }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", checkHoverState);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", checkHoverState);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, checkHoverState, handleMouseDown, handleMouseUp, handleMouseEnter, handleMouseLeave]);

  // Hide on touch devices or reduced motion preference
  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null;
  }

  // Cursor size based on state
  const getCursorSize = () => {
    if (state.cursorType === "expand") return { outer: 80, inner: 4 };
    if (state.cursorType === "text") return { outer: 4, inner: 2 };
    if (state.isHovering) return { outer: 48, inner: 0 };
    if (state.isClicking) return { outer: 20, inner: 4 };
    return { outer: 32, inner: 6 };
  };

  const sizes = getCursorSize();

  return (
    <>
      {/* Trail particles */}
      <AnimatePresence>
        {!prefersReducedMotion &&
          trails.map((trail) => (
            <motion.div
              key={trail.id}
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="fixed pointer-events-none z-[9997]"
              style={{
                left: trail.x,
                top: trail.y,
                translateX: "-50%",
                translateY: "-50%",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Outer ring cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          x: cursorXSpringOuter,
          y: cursorYSpringOuter,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: state.isVisible ? 1 : 0,
          width: sizes.outer,
          height: sizes.outer,
        }}
        transition={{
          opacity: { duration: 0.15 },
          width: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
          height: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
        }}
      >
        <motion.div
          className="w-full h-full rounded-full border-2 mix-blend-difference"
          animate={{
            borderColor: state.isHovering ? "#D4AF37" : "rgba(212, 175, 55, 0.8)",
            borderWidth: state.cursorType === "expand" ? 1 : 2,
            backgroundColor: state.cursorType === "expand" ? "rgba(212, 175, 55, 0.1)" : "transparent",
          }}
          transition={{ duration: 0.15 }}
        />

        {/* Cursor text label */}
        <AnimatePresence>
          {state.cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute text-[10px] font-mono font-medium text-gold uppercase tracking-wider"
            >
              {state.cursorText}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Inner dot cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpringInner,
          y: cursorYSpringInner,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: state.isVisible && sizes.inner > 0 ? 1 : 0,
          width: sizes.inner,
          height: sizes.inner,
          scale: state.isClicking ? 0.5 : 1,
        }}
        transition={{
          opacity: { duration: 0.1 },
          scale: { duration: 0.1 },
        }}
      >
        <div className="w-full h-full bg-gold rounded-full" />
      </motion.div>

      {/* Click ripple effect */}
      <AnimatePresence>
        {state.isClicking && !prefersReducedMotion && (
          <motion.div
            initial={{ opacity: 0.5, scale: 0.5 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed pointer-events-none z-[9998]"
            style={{
              left: cursorX.get(),
              top: cursorY.get(),
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <div className="w-8 h-8 rounded-full border border-gold/50" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
