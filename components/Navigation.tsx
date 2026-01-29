"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { CharacterHover } from "@/components/typography";
import { EASING, TIMING } from "@/lib/kinetic-constants";

/**
 * MagneticNavItem - Navigation item with magnetic hover effect.
 */
function MagneticNavItem({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);

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
  };

  if (prefersReducedMotion) {
    return (
      <Button
        variant="ghost"
        className={className}
        onClick={onClick}
      >
        {children}
      </Button>
    );
  }

  return (
    <motion.button
      ref={ref}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 ${className}`}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        scale: { duration: TIMING.fast, ease: EASING.snappy },
      }}
    >
      {children}
    </motion.button>
  );
}

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Journey", href: "#journey" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Skills", href: "#skills" },
    { name: "Education", href: "#education" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl"
          : "bg-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with character hover effect */}
          <motion.a
            href="#"
            className={`text-2xl font-bold font-display bg-gradient-to-r from-gold via-white to-gold bg-clip-text text-transparent hover:from-white hover:via-gold hover:to-white transition-all duration-500`}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <CharacterHover
              text="AC"
              hoverColor="#D4AF37"
              hoverScale={1.3}
              className="text-2xl font-bold font-display"
            />
          </motion.a>

          {/* Desktop Navigation with magnetic effects */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
              >
                <MagneticNavItem
                  className="text-white/70 hover:text-gold hover:bg-gold/5 relative group"
                  onClick={() => scrollToSection(link.href)}
                >
                  <span className="relative z-10">
                    {prefersReducedMotion ? (
                      link.name
                    ) : (
                      <CharacterHover
                        text={link.name}
                        hoverColor="#D4AF37"
                        hoverScale={1.15}
                      />
                    )}
                  </span>
                  <motion.span
                    className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-gold -translate-x-1/2 group-hover:w-3/4 transition-all duration-300"
                  />
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
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10">Resume</span>
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              className={`p-2 ${
                isScrolled ? "text-primary-900 dark:text-white" : "text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu with staggered animations */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <motion.div
                className="py-4 space-y-2"
                initial="hidden"
                animate="visible"
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
                {navLinks.map((link) => (
                  <motion.div
                    key={link.name}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: {
                          duration: 0.3,
                          ease: EASING.smooth,
                        },
                      },
                    }}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        isScrolled ? "text-primary-700 dark:text-primary-200" : "text-white"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                    >
                      {link.name}
                    </Button>
                  </motion.div>
                ))}
                <motion.a
                  href="/resume.pdf"
                  download
                  className="w-full inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 h-10 px-4 py-2 bg-gold text-[#050505] hover:bg-[#E5C04B]"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: {
                        duration: 0.3,
                        ease: EASING.smooth,
                      },
                    },
                  }}
                >
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
