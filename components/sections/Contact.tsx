"use client";

import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { ContactForm } from "@/components/ui/contact-form";
import { AnimatedSectionHeader, ScrollRevealText, CharacterHover } from "@/components/typography";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASING, TIMING } from "@/lib/kinetic-constants";

export default function Contact() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/achintyachaganti01",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      url: "https://github.com/achintyachaganti",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "Email",
      url: "mailto:chaganti.ac@northeastern.edu",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="contact" className="relative py-24 bg-[#050505] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gold/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Animated Section Header */}
        <AnimatedSectionHeader
          label="Connection"
          title="Get In Touch"
          description="Seeking opportunities in equity research, quantitative finance, and investment banking. Let's build something exceptional."
          animation="split"
          className="mb-16"
        />

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Contact Form */}
          <ScrollRevealText delay={0.2} direction="left">
            <div className="relative group">
              {/* Premium form glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-transparent to-gold/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />

              <div className="relative bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-3xl shadow-2xl">
                <h3 className="text-xl font-display font-bold text-white mb-8">
                  Direct Message
                </h3>
                <ContactForm />
              </div>
            </div>
          </ScrollRevealText>

          {/* Right: Contact Info */}
          <ScrollRevealText delay={0.3} direction="right">
            <div className="space-y-10">
              {/* Direct Contact Cards */}
              <motion.div
                className="grid sm:grid-cols-2 gap-6"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  {
                    label: "Email",
                    value: "chaganti.ac@northeastern.edu",
                    href: "mailto:chaganti.ac@northeastern.edu",
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )
                  },
                  {
                    label: "Phone",
                    value: "(517) 528-3322",
                    href: "tel:+15175283322",
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    )
                  }
                ].map((item) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                    className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-gold/5 hover:border-gold/30 transition-all group/card"
                  >
                    <motion.div
                      className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center text-gold mb-4 group-hover/card:scale-110 transition-transform"
                      whileHover={prefersReducedMotion ? undefined : { rotate: 10 }}
                    >
                      {item.icon}
                    </motion.div>
                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">{item.label}</div>
                    <div className="text-sm text-white/80 font-medium truncate">{item.value}</div>
                  </motion.a>
                ))}
              </motion.div>

              {/* Socials & Resume */}
              <div className="p-8 bg-white/[0.02] border border-white/10 rounded-3xl">
                <h3 className="text-sm font-mono text-gold uppercase tracking-[0.2em] mb-8">Professional Profiles</h3>

                <motion.div
                  className="flex flex-wrap gap-4 mb-10"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 },
                    },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {socialLinks.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={{
                        hidden: { opacity: 0, scale: 0.8 },
                        visible: { opacity: 1, scale: 1 },
                      }}
                      whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                      className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-gold/40 transition-all group/social"
                    >
                      <span className="text-white/60 group-hover/social:text-gold transition-colors">{link.icon}</span>
                      <span className="text-sm font-medium text-white/80">
                        {prefersReducedMotion ? (
                          link.name
                        ) : (
                          <CharacterHover
                            text={link.name}
                            hoverColor="#D4AF37"
                            hoverScale={1.1}
                          />
                        )}
                      </span>
                    </motion.a>
                  ))}
                </motion.div>

                <motion.a
                  href="/resume.pdf"
                  download
                  className="w-full inline-flex items-center justify-center gap-3 py-4 bg-gold text-[#050505] font-bold rounded-xl hover:bg-[#E5C04B] transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]"
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.01 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Full Resume
                </motion.a>
              </div>

              {/* Additional Eligibility Note */}
              <motion.div
                className="flex items-center gap-4 p-5 bg-gold/5 border border-gold/10 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold"
                  animate={prefersReducedMotion ? undefined : { scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </motion.div>
                <p className="text-sm text-gold/80">
                  <span className="font-bold">H-1B1 Visa Holder:</span> Singapore citizen with expedited authorization for US employment.
                </p>
              </motion.div>
            </div>
          </ScrollRevealText>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-24 pt-12 border-t border-white/5 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white/30 text-[11px] font-mono uppercase tracking-[0.4em]">
            {new Date().getFullYear()} Achintya Chaganti - Built for the Infinite
          </p>
        </motion.div>
      </div>
    </section>

  );
}
