"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useSpring, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { CharacterHover } from "@/components/typography";
import { EASING, TIMING } from "@/lib/kinetic-constants";

/**
 * MagneticNavItem - Navigation item with magnetic hover effect.
 * Enhanced with glow effects and improved animations.
 */
function MagneticNavItem({
  children,
  onClick,
  className = "",
  isActive = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  isActive?: boolean;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { stiffness: 200, damping: 20 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion) return;

    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  if (prefersReducedMotion) {
    return (
      <Button
        variant="ghost"
        className={`${className} ${isActive ? "text-gold" : ""}`}
        onClick={onClick}
      >
        {children}
      </Button>
    );
  }

  return (
    <motion.button
      ref={ref}
      data-magnetic
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 h-9 px-4 py-2 relative overflow-hidden ${className}`}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        scale: { duration: TIMING.fast, ease: EASING.snappy },
      }}
    >
      {/* Hover glow background */}
      <motion.span
        className="absolute inset-0 rounded-md bg-gold/10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isHovered || isActive ? 1 : 0,
          scale: isHovered || isActive ? 1 : 0.8,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Content */}
      <span className="relative z-10">{children}</span>

      {/* Active/hover indicator line */}
      <motion.span
        className="absolute bottom-0 left-1/2 h-[2px] bg-gold rounded-full"
        initial={{ width: 0, x: "-50%" }}
        animate={{
          width: isActive ? "60%" : isHovered ? "40%" : "0%",
          x: "-50%",
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
    </motion.button>
  );
}

/**
 * NavIndicator - Floating indicator that follows the active nav item.
 */
function NavIndicator({ activeIndex, itemRefs }: { activeIndex: number; itemRefs: React.RefObject<(HTMLDivElement | null)[]> }) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const items = itemRefs.current;
    if (items && items[activeIndex]) {
      const item = items[activeIndex];
      if (item) {
        setIndicatorStyle({
          left: item.offsetLeft,
          width: item.offsetWidth,
        });
      }
    }
  }, [activeIndex, itemRefs]);

  return (
    <motion.div
      className="absolute bottom-0 h-[2px] bg-gold rounded-full"
      animate={{
        left: indicatorStyle.left,
        width: indicatorStyle.width,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    />
  );
}

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const prefersReducedMotion = usePrefersReducedMotion();
  const navItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { scrollY } = useScroll();

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Journey", href: "#journey" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Skills", href: "#skills" },
    { name: "Education", href: "#education" },
    { name: "Contact", href: "#contact" },
  ];

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section based on scroll position
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navLinks.forEach((link) => {
      const element = document.querySelector(link.href);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  }, []);

  // Navbar background opacity based on scroll
  const navBgOpacity = useTransform(scrollY, [0, 100], [0, 0.95]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 border-b border-white/5 backdrop-blur-xl"
        style={{
          backgroundColor: `rgba(5, 5, 5, ${isScrolled ? 0.9 : 0})`,
        }}
        animate={{
          boxShadow: isScrolled
            ? "0 4px 30px rgba(0, 0, 0, 0.3)"
            : "0 0 0 rgba(0, 0, 0, 0)",
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with character hover effect */}
          <motion.a
            href="#"
            className="text-2xl font-bold font-display bg-gradient-to-r from-gold via-white to-gold bg-clip-text text-transparent relative group"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            data-magnetic
          >
            {/* Glow effect on hover */}
            <motion.span
              className="absolute -inset-2 bg-gold/20 rounded-lg blur-lg"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative">
              <CharacterHover
                text="AC"
                hoverColor="#D4AF37"
                hoverScale={1.3}
                className="text-2xl font-bold font-display"
              />
            </span>
          </motion.a>

          {/* Desktop Navigation with magnetic effects */}
          <div className="hidden md:flex items-center gap-1 relative">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                ref={(el) => {
                  if (navItemRefs.current) {
                    navItemRefs.current[index] = el;
                  }
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
              >
                <MagneticNavItem
                  className={`${
                    activeSection === link.href
                      ? "text-gold"
                      : "text-white/70 hover:text-gold"
                  } hover:bg-gold/5 relative group`}
                  onClick={() => scrollToSection(link.href)}
                  isActive={activeSection === link.href}
                >
                  {prefersReducedMotion ? (
                    link.name
                  ) : (
                    <CharacterHover
                      text={link.name}
                      hoverColor="#D4AF37"
                      hoverScale={1.15}
                    />
                  )}
                </MagneticNavItem>
              </motion.div>
            ))}

            {/* Theme Toggle */}
            <motion.div
              className="ml-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <ThemeToggle />
            </motion.div>

            {/* Resume button with enhanced hover */}
            <motion.a
              href="/resume.pdf"
              download
              className="ml-2 inline-flex items-center justify-center rounded-md font-bold transition-all duration-300 h-9 px-4 bg-gold text-[#050505] hover:bg-[#E5C04B] shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] relative overflow-hidden group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-magnetic
              data-cursor-text="Download"
            >
              {/* Shimmer effect */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              {/* Ripple effect container */}
              <span className="relative z-10 flex items-center gap-2">
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{ y: 2 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.4 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </motion.svg>
                Resume
              </span>
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <motion.button
              className={`p-2 rounded-lg transition-colors ${
                isScrolled ? "text-white" : "text-white"
              } hover:bg-white/10`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.path
                      key="close"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      exit={{ pathLength: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <motion.g
                      key="menu"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16"
                        initial={{ x: -10 }}
                        animate={{ x: 0 }}
                        transition={{ delay: 0 }}
                      />
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 12h16"
                        initial={{ x: -10 }}
                        animate={{ x: 0 }}
                        transition={{ delay: 0.05 }}
                      />
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 18h16"
                        initial={{ x: -10 }}
                        animate={{ x: 0 }}
                        transition={{ delay: 0.1 }}
                      />
                    </motion.g>
                  )}
                </AnimatePresence>
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu with enhanced animations */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden overflow-hidden"
            >
              <motion.div
                className="py-4 space-y-1"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.1,
                    },
                  },
                }}
              >
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    variants={{
                      hidden: { opacity: 0, x: -20, y: 10 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        transition: {
                          duration: 0.3,
                          ease: EASING.smooth,
                        },
                      },
                    }}
                  >
                    <motion.button
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        activeSection === link.href
                          ? "bg-gold/10 text-gold border-l-2 border-gold"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="flex items-center gap-3">
                        <motion.span
                          className="w-1.5 h-1.5 rounded-full bg-gold"
                          initial={{ scale: 0 }}
                          animate={{ scale: activeSection === link.href ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                        />
                        {link.name}
                      </span>
                    </motion.button>
                  </motion.div>
                ))}

                {/* Mobile Resume Button */}
                <motion.a
                  href="/resume.pdf"
                  download
                  className="w-full mt-4 inline-flex items-center justify-center rounded-lg font-bold transition-colors h-12 px-4 py-2 bg-gold text-[#050505] hover:bg-[#E5C04B]"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.3,
                        ease: EASING.smooth,
                        delay: 0.3,
                      },
                    },
                  }}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Resume
                </motion.a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
