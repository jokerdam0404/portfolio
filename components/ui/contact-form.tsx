"use client";

import { useState, FormEvent, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormStatus {
  type: "idle" | "loading" | "success" | "error";
  message?: string;
}

interface FloatingInputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  delay?: number;
}

/**
 * FloatingInput - Input with floating label and focus animations.
 */
function FloatingInput({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  multiline = false,
  rows = 5,
  delay = 0,
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const hasValue = value.length > 0;
  const isActive = isFocused || hasValue;

  const baseInputClasses = `
    w-full px-4 pt-6 pb-2 rounded-lg
    bg-white/5 border border-white/20
    text-white placeholder-transparent
    focus:outline-none focus:bg-white/[0.08]
    transition-all duration-300
    peer
  `;

  const focusClasses = isFocused
    ? "border-gold/50 ring-2 ring-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]"
    : "hover:border-white/30";

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {/* Focus glow effect */}
      <AnimatePresence>
        {isFocused && !prefersReducedMotion && (
          <motion.div
            className="absolute -inset-1 rounded-xl bg-gold/10 blur-md pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Input field */}
      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          rows={rows}
          className={`${baseInputClasses} ${focusClasses} resize-none`}
          placeholder={label}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          className={`${baseInputClasses} ${focusClasses}`}
          placeholder={label}
        />
      )}

      {/* Floating label */}
      <motion.label
        htmlFor={id}
        className={`
          absolute left-4 pointer-events-none
          transition-all duration-300 ease-out
          ${isActive
            ? "top-2 text-xs text-gold"
            : "top-1/2 -translate-y-1/2 text-sm text-white/50"
          }
          ${multiline && !isActive ? "top-4 -translate-y-0" : ""}
        `}
        animate={{
          top: isActive ? 8 : multiline ? 16 : "50%",
          fontSize: isActive ? "10px" : "14px",
          color: isFocused ? "#D4AF37" : isActive ? "#D4AF37" : "rgba(255,255,255,0.5)",
          y: isActive ? 0 : multiline ? 0 : "-50%",
        }}
        transition={{ duration: 0.2 }}
      >
        {label} {required && "*"}
      </motion.label>

      {/* Bottom border animation */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-[2px] bg-gold rounded-full"
        initial={{ width: 0, x: "-50%" }}
        animate={{
          width: isFocused ? "100%" : "0%",
          x: "-50%",
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Focus corner indicators */}
      <AnimatePresence>
        {isFocused && !prefersReducedMotion && (
          <>
            <motion.span
              className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-gold rounded-tl-lg"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
            />
            <motion.span
              className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-gold rounded-tr-lg"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15, delay: 0.05 }}
            />
            <motion.span
              className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-gold rounded-bl-lg"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15, delay: 0.1 }}
            />
            <motion.span
              className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-gold rounded-br-lg"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15, delay: 0.15 }}
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * FloatingSelect - Select with floating label and focus animations.
 */
function FloatingSelect({
  id,
  name,
  label,
  value,
  onChange,
  options,
  delay = 0,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  delay?: number;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasValue = value.length > 0;
  const isActive = isFocused || hasValue;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {/* Focus glow */}
      <AnimatePresence>
        {isFocused && !prefersReducedMotion && (
          <motion.div
            className="absolute -inset-1 rounded-xl bg-gold/10 blur-md pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full px-4 pt-6 pb-2 rounded-lg
          bg-white/5 border border-white/20
          text-white appearance-none cursor-pointer
          focus:outline-none focus:bg-white/[0.08]
          transition-all duration-300
          ${isFocused ? "border-gold/50 ring-2 ring-gold/20" : "hover:border-white/30"}
        `}
      >
        <option value="" className="bg-[#0a0a0a]">
          Select...
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#0a0a0a]">
            {option.label}
          </option>
        ))}
      </select>

      {/* Floating label */}
      <motion.label
        htmlFor={id}
        className="absolute left-4 pointer-events-none"
        animate={{
          top: isActive ? 8 : "50%",
          fontSize: isActive ? "10px" : "14px",
          color: isFocused ? "#D4AF37" : isActive ? "#D4AF37" : "rgba(255,255,255,0.5)",
          y: isActive ? 0 : "-50%",
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>

      {/* Dropdown arrow */}
      <motion.div
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
        animate={{ rotate: isFocused ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>

      {/* Bottom border animation */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-[2px] bg-gold rounded-full"
        initial={{ width: 0, x: "-50%" }}
        animate={{ width: isFocused ? "100%" : "0%", x: "-50%" }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

/**
 * ContactForm - A working contact form component with enhanced interactions.
 *
 * Features:
 * - Floating labels with smooth animations
 * - Focus glow effects
 * - Corner indicators on focus
 * - Loading states
 * - Success/error feedback with animations
 * - Accessible form structure
 */
export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });
  const prefersReducedMotion = usePrefersReducedMotion();

  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!accessKey) {
      const mailtoLink = `mailto:chaganti.ac@northeastern.edu?subject=${encodeURIComponent(
        formData.subject || "Contact from Portfolio"
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
      )}`;
      window.location.href = mailtoLink;
      return;
    }

    setStatus({ type: "loading" });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject || "New contact from portfolio",
          message: formData.message,
          from_name: "Portfolio Contact Form",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          type: "success",
          message: "Thank you! Your message has been sent successfully.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(result.message || "Failed to send message");
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Failed to send message. Please try again or email directly.",
      });
    }
  };

  const subjectOptions = [
    { value: "Job Opportunity", label: "Job Opportunity" },
    { value: "Internship", label: "Internship" },
    { value: "Collaboration", label: "Collaboration" },
    { value: "Research", label: "Research Inquiry" },
    { value: "Other", label: "Other" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto">
      {/* Name Field */}
      <FloatingInput
        id="name"
        name="name"
        label="Name"
        value={formData.name}
        onChange={handleChange}
        required
        delay={0.1}
      />

      {/* Email Field */}
      <FloatingInput
        id="email"
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        delay={0.2}
      />

      {/* Subject Field */}
      <FloatingSelect
        id="subject"
        name="subject"
        label="Subject"
        value={formData.subject}
        onChange={handleChange}
        options={subjectOptions}
        delay={0.3}
      />

      {/* Message Field */}
      <FloatingInput
        id="message"
        name="message"
        label="Message"
        value={formData.message}
        onChange={handleChange}
        required
        multiline
        rows={5}
        delay={0.4}
      />

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          type="submit"
          variant="gold"
          size="lg"
          isLoading={status.type === "loading"}
          disabled={status.type === "loading"}
          className="w-full py-4 text-base font-bold"
          rightIcon={
            status.type !== "loading" && (
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </motion.svg>
            )
          }
        >
          {status.type === "loading" ? "Sending..." : "Send Message"}
        </Button>
      </motion.div>

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {status.type === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-center"
          >
            <motion.div
              className="flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </motion.svg>
              {status.message}
            </motion.div>
          </motion.div>
        )}
        {status.type === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-center"
          >
            <p>{status.message}</p>
            <motion.a
              href="mailto:chaganti.ac@northeastern.edu"
              className="inline-block mt-2 text-sm underline hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              Email directly instead
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mailto fallback note */}
      {!accessKey && (
        <motion.p
          className="text-xs text-white/40 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Form will open your email client
        </motion.p>
      )}
    </form>
  );
}

export default ContactForm;
