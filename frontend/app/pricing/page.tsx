"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FiCheck, FiTarget, FiZap, FiBriefcase } from "react-icons/fi";
import Navbar from "@/components/Navbar";

const plans = [
  {
    title: "Starter",
    icon: <FiTarget />,
    description: "Perfect for students starting their interview journey.",
    monthlyPrice: 29,
    annualPrice: 24,
    featured: false,
    perks: ["Unlimited Access", "Up to 50 Projects", "No Monthly Fees", "Standard Support"],
    buttonText: "Start for Free",
  },
  {
    title: "Professional",
    icon: <FiZap />,
    description: "The ultimate power suite for serious professionals.",
    monthlyPrice: 79,
    annualPrice: 64,
    featured: true,
    perks: ["Everything in Starter", "Unlimited Projects", "Priority Support", "Custom Analytics", "Live Mock Interviews"],
    buttonText: "Get Started Now",
  },
  {
    title: "Enterprise",
    icon: <FiBriefcase />,
    description: "Custom solutions for large engineering teams.",
    monthlyPrice: 199,
    annualPrice: 159,
    featured: false,
    perks: ["Everything in Pro", "SSO & SAML", "Dedicated Account Manager", "Custom Integrations", "Training Sessions"],
    buttonText: "Contact Sales",
  },
];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center mb-12 space-y-8"
        >
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest"
          >
            Flexible Plans
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-black tracking-tight">
            Ready to <span className="text-primary">Scale</span>?
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Choose the perfect plan to accelerate your technical career. Save 20% with annual billing.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div 
            variants={fadeInUp}
            className="flex items-center justify-center gap-6 pt-6"
          >
            <span className={`text-sm font-bold tracking-wide transition-colors ${billingCycle === "monthly" ? "text-white" : "text-text-muted"}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
              className="group relative h-9 w-16 rounded-full bg-surface-1 border border-border-medium p-1.5 transition-all hover:border-primary/50"
            >
              <motion.div
                animate={{ x: billingCycle === "monthly" ? 0 : 28 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="h-full aspect-square rounded-full bg-primary"
              />
            </button>
            <span className={`text-sm font-bold tracking-wide transition-colors ${billingCycle === "annually" ? "text-white" : "text-text-muted"}`}>
              Annually <span className="ml-1 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-md">-20%</span>
            </span>
          </motion.div>
        </motion.div>

        {/* Pricing Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-3 items-stretch"
        >
          {plans.map((plan) => (
            <motion.article
              variants={fadeInUp}
              key={plan.title}
              whileHover={{ scale: 1.02, backgroundColor: "var(--surface-2)" }}
              transition={{ duration: 0.3 }}
              className={`relative flex flex-col rounded-[2rem] border p-8 transition-colors ${
                plan.featured
                  ? "bg-surface-1 border-primary/50"
                  : "bg-surface-1/40 border-border-medium"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-6 py-1.5 text-xs font-black uppercase tracking-widest text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-5 mb-5">
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border text-2xl ${
                    plan.featured ? "bg-primary/10 border-primary/20 text-primary" : "bg-white/5 border-border-medium text-text-secondary"
                  }`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-4xl font-black tracking-tight">{plan.title}</h3>
                </div>
                <p className="text-base text-text-muted leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-text-muted">$</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={billingCycle}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-6xl font-black tracking-tighter"
                    >
                      {billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-text-muted font-medium">/mo</span>
                </div>
                {billingCycle === "annually" && (
                  <motion.p 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="mt-3 text-xs font-bold text-primary uppercase tracking-widest"
                  >
                    Billed annually (${plan.annualPrice * 12}/yr)
                  </motion.p>
                )}
              </div>

              <div className="flex-1 space-y-3.5 mb-6">
                {plan.perks.map((perk) => (
                  <div key={perk} className="flex items-start gap-4">
                    <div className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${plan.featured ? "bg-primary text-white" : "bg-white/10 text-text-muted"}`}>
                      <FiCheck size={12} strokeWidth={4} />
                    </div>
                    <span className="text-sm font-medium text-foreground/80 leading-snug">{perk}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full rounded-2xl py-4 font-black uppercase tracking-widest transition-all active:scale-[0.98] ${
                plan.featured
                  ? "bg-primary text-white hover:bg-primary-hover"
                  : "bg-white/5 border border-border-medium text-white hover:bg-white/10"
              }`}>
                {plan.buttonText}
              </button>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </main>
  );
}