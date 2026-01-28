"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

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

/**
 * ContactForm - A working contact form component.
 *
 * Uses Web3Forms API for form submission (free tier, no account required).
 * To enable the form:
 * 1. Go to https://web3forms.com/ and get a free access key
 * 2. Set the WEB3FORMS_ACCESS_KEY environment variable
 * 3. Or update the accessKey below directly
 *
 * Features:
 * - Client-side validation
 * - Loading states
 * - Success/error feedback
 * - Accessible form structure
 * - Fallback mailto link if API key not configured
 */
export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });

  // Web3Forms access key - get one free at https://web3forms.com/
  // Replace this with your actual key or use environment variable
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // If no access key, fall back to mailto
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

  const inputClasses =
    "w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/30 focus:bg-white/[0.15] hover:border-white/30 transition-all duration-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      {/* Name Field */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={inputClasses}
          placeholder="Your name"
        />
      </motion.div>

      {/* Email Field */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={inputClasses}
          placeholder="your.email@example.com"
        />
      </motion.div>

      {/* Subject Field */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label htmlFor="subject" className="block text-sm font-medium text-white/80 mb-1">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={inputClasses}
        >
          <option value="">Select a topic</option>
          <option value="Job Opportunity">Job Opportunity</option>
          <option value="Internship">Internship</option>
          <option value="Collaboration">Collaboration</option>
          <option value="Research">Research Inquiry</option>
          <option value="Other">Other</option>
        </select>
      </motion.div>

      {/* Message Field */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-1">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className={inputClasses}
          placeholder="Your message..."
        />
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          type="submit"
          disabled={status.type === "loading"}
          className="w-full bg-gold hover:bg-[#E5C04B] text-[#050505] py-3 text-base font-bold shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
        >
        {status.type === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending...
          </span>
        ) : (
          "Send Message"
        )}
        </Button>
      </motion.div>

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {status.type === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-green-200 text-center"
          >
            {status.message}
          </motion.div>
        )}
        {status.type === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-center"
          >
            {status.message}
            <a
              href="mailto:chaganti.ac@northeastern.edu"
              className="block mt-2 underline hover:text-white"
            >
              Email directly instead
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note about mailto fallback */}
      {!accessKey && (
        <p className="text-xs text-white/50 text-center">
          Form will open your email client
        </p>
      )}
    </form>
  );
}

export default ContactForm;
