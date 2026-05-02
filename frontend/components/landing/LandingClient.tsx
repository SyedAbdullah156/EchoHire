"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";
import HeroSection from "@/components/HeroSection";
import FeaturesBento from "@/components/landing/FeaturesBento";
import HowItWorksStepper from "@/components/landing/HowItWorksStepper";
import TestimonialsMarquee from "@/components/landing/TestimonialsMarquee";

export default function LandingClient() {
  return (
    <>
      <HeroSection />
      <TestimonialsMarquee />
      <FeaturesBento />
      <HowItWorksStepper />

      <section className="relative border-t border-border-subtle bg-white/[0.01] py-10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <section className="py-24 md:py-40 px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto border border-border-medium bg-surface-1 rounded-[3rem] p-12 md:p-24 text-center space-y-10"
            >
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
                Ready to upgrade <br /> your <span className="text-primary">hiring</span>?
              </h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-medium">
                Join hundreds of engineering teams using EchoHire to identify top talent with confidence and speed.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                <Link
                  href="/auth"
                  className="w-full sm:w-auto min-h-[56px] px-10 py-4 bg-primary text-white font-bold rounded-2xl transition-all hover:bg-primary-hover active:scale-95 flex items-center justify-center gap-3 text-lg"
                >
                  Get Started for Free
                  <FiArrowRight size={20} />
                </Link>
                <Link
                  href="/pricing"
                  className="w-full sm:w-auto min-h-[56px] px-10 py-4 bg-white/5 border border-border-medium text-white font-bold rounded-2xl transition-all hover:bg-white/10 active:scale-95 flex items-center justify-center text-lg"
                >
                  View Pricing
                </Link>
              </div>

              <div className="pt-12 flex flex-wrap justify-center gap-8 text-sm font-bold text-text-muted uppercase tracking-widest">
                {["No credit card required", "14-day free trial", "Cancel anytime"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <FiCheckCircle className="text-primary w-5 h-5" /> {t}
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        </div>
      </section>
    </>
  );
}
