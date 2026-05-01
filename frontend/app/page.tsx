"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesBento from "@/components/landing/FeaturesBento";
import HowItWorksStepper from "@/components/landing/HowItWorksStepper";
import TestimonialsMarquee from "@/components/landing/TestimonialsMarquee";
import MinimalistFooter from "@/components/landing/MinimalistFooter";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";

// ─── Shared Animation Variants ────────────────────────────────────────────────

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030712] text-white selection:bg-[#227dff]/30 overflow-hidden">
      <Navbar />

      {/* 1. Hero */}
      <HeroSection />
      <TestimonialsMarquee />
      <FeaturesBento />
      <HowItWorksStepper />
      <section className="relative border-t border-white/5 bg-white/[0.01] py-10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">

          {/* 5. Final CTA */}
          <section className="py-24 md:py-32 px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto border border-white/10 bg-[linear-gradient(145deg,rgba(7,20,43,0.95)_0%,rgba(11,23,48,0.65)_100%)] rounded-[2rem] p-10 md:p-16 text-center space-y-8"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                Ready to upgrade your hiring?
              </h2>
              <p className="text-lg text-[#98a7cb] max-w-xl mx-auto leading-relaxed">
                Join hundreds of engineering teams using EchoHire to identify top talent with confidence and speed.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/auth"
                  className="w-full sm:w-auto min-h-[48px] px-8 py-3 bg-[#227dff] text-white font-medium rounded-xl transition-colors hover:bg-[#1a68d4] active:bg-[#1558b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#227dff] flex items-center justify-center gap-2"
                >
                  Get Started for Free
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="w-full sm:w-auto min-h-[48px] px-8 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 flex items-center justify-center"
                >
                  View Pricing
                </Link>
              </div>

              <div className="pt-8 flex flex-wrap justify-center gap-6 text-sm text-[#7f92be]">
                {["No credit card required", "14-day free trial", "Cancel anytime"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <FiCheckCircle className="text-[#227dff] w-4 h-4" /> {t}
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        </div>
      </section>
    </main>
  );
}     