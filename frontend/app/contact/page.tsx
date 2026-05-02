"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiMessageCircle, FiMapPin, FiSend, FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-40 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Side: Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
                Get in <span className="text-primary text-glow">Touch</span>.
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed max-w-lg">
                Have questions about our AI features or need help with your account? We're here to help you accelerate your career.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="h-12 w-12 rounded-2xl bg-surface-1 border border-border-medium flex items-center justify-center text-xl text-primary transition-colors group-hover:bg-primary/10 group-hover:border-primary/30">
                  <FiMail />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">Email Us</p>
                  <p className="text-lg font-bold text-white">hello@echohire.ai</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="h-12 w-12 rounded-2xl bg-surface-1 border border-border-medium flex items-center justify-center text-xl text-primary transition-colors group-hover:bg-primary/10 group-hover:border-primary/30">
                  <FiMessageCircle />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">Live Support</p>
                  <p className="text-lg font-bold text-white">Available 9am - 6pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="h-12 w-12 rounded-2xl bg-surface-1 border border-border-medium flex items-center justify-center text-xl text-primary transition-colors group-hover:bg-primary/10 group-hover:border-primary/30">
                  <FiMapPin />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">Headquarters</p>
                  <p className="text-lg font-bold text-white">San Francisco, CA</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4">
              {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-12 w-12 rounded-full bg-surface-1 border border-border-medium flex items-center justify-center text-xl text-text-muted hover:text-white hover:border-text-muted transition-all"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-surface-1 border border-border-medium rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 space-y-6"
                >
                  <div className="h-20 w-20 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <FiSend className="text-3xl text-primary" />
                  </div>
                  <h2 className="text-3xl font-black text-white">Message Sent!</h2>
                  <p className="text-text-secondary leading-relaxed max-w-xs mx-auto">
                    Thanks for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-primary font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">First Name</label>
                      <input
                        required
                        className="w-full h-14 bg-surface-2 border border-border-medium rounded-2xl px-6 text-white outline-none focus:border-primary/50 transition-colors"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Last Name</label>
                      <input
                        required
                        className="w-full h-14 bg-surface-2 border border-border-medium rounded-2xl px-6 text-white outline-none focus:border-primary/50 transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Email Address</label>
                    <input
                      required
                      type="email"
                      className="w-full h-14 bg-surface-2 border border-border-medium rounded-2xl px-6 text-white outline-none focus:border-primary/50 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Message</label>
                    <textarea
                      required
                      rows={5}
                      className="w-full bg-surface-2 border border-border-medium rounded-2xl p-6 text-white outline-none focus:border-primary/50 transition-colors resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    disabled={isSubmitting}
                    className="w-full h-16 bg-primary text-white font-black uppercase tracking-widest rounded-2xl transition-all hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    {!isSubmitting && <FiSend />}
                  </button>
                </form>
              )}
              
              {/* Background Glow */}
              <div className="absolute -bottom-24 -right-24 h-48 w-48 bg-primary/10 blur-[100px] pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
