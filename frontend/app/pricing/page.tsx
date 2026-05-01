"use client";

import { motion, Variants } from "framer-motion";
import { FiCheck, FiX, FiTarget, FiZap, FiBriefcase } from "react-icons/fi";
import Navbar from "@/components/Navbar";

const plans = [
  {
    price: 49,
    title: "Standard",
    icon: <FiTarget className="text-blue-400" />,
    description: "Perfect for students starting their interview journey.",
    featured: false,
    perks: [
      { label: "Unlimited Access", available: true },
      { label: "Up to 100 Projects", available: true },
      { label: "No Monthly Fees", available: true },
      { label: "Priority Support", available: false },
      { label: "Unlimited Storage", available: false },
      { label: "Live Meeting", available: false },
    ],
  },
  {
    price: 99,
    title: "Enterprise",
    icon: <FiZap className="text-yellow-400" />,
    description: "The ultimate power suite for serious professionals.",
    featured: true,
    perks: [
      { label: "Everything in Business", available: true },
      { label: "Unlimited Projects", available: true },
      { label: "Unlimited Storage", available: true },
      { label: "Live Meeting", available: true },
      { label: "Priority Support", available: true },
      { label: "Custom Analytics", available: true },
    ],
  },
  {
    price: 79,
    title: "Business",
    icon: <FiBriefcase className="text-purple-400" />,
    description: "Advanced features for experienced job seekers.",
    featured: false,
    perks: [
      { label: "Everything in Standard", available: true },
      { label: "Up to 150 Projects", available: true },
      { label: "Priority Support", available: true },
      { label: "Value for Money", available: true },
      { label: "Unlimited Storage", available: false },
      { label: "Live Meeting", available: false },
    ],
  },
];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-white selection:bg-[#227dff]/30 flex flex-col">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-32 w-full flex-1">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center mb-16 md:mb-24 space-y-4"
        >
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            Simple, transparent pricing
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-[#98a7cb] leading-relaxed">
            Pick the plan that matches your prep goals. No hidden fees.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto items-center"
        >
          {plans.map((plan) => (
            <motion.article
              variants={fadeInUp}
              key={plan.title}
              className={`relative flex flex-col rounded-[2rem] border transition-colors hover:bg-[linear-gradient(145deg,rgba(7,20,43,0.95)_0%,rgba(15,30,60,0.65)_100%)] p-8 md:p-10 ${plan.featured
                  ? "border-[#227dff]/50 bg-[linear-gradient(145deg,rgba(7,20,43,0.95)_0%,rgba(11,23,48,0.65)_100%)] md:scale-[1.03] z-10 py-12"
                  : "border-white/10 bg-white/[0.02] h-full"
                }`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#227dff] to-[#332989] text-white px-5 py-1.5 rounded-full text-sm font-medium border border-[#3f83ff]/30 shadow-sm">
                  Most Popular
                </div>
              )}

              <div className="mb-8 text-center">
                <h3 className="text-xl font-medium text-[#dbe7ff] mb-4">{plan.title}</h3>
                <p className="text-5xl font-bold text-white flex items-center justify-center">
                  <span className="text-2xl text-[#227dff] mr-1">$</span>
                  {plan.price}
                  <span className="text-lg font-normal text-[#7f92be] ml-2">/ mo</span>
                </p>
              </div>

              <ul className="space-y-4 text-base mb-8 flex-1">
                {plan.perks.map((perk) => (
                  <li
                    key={perk.label}
                    className={`flex items-center gap-3 ${perk.available ? "text-[#dbe7ff]" : "text-[#5c667f]"
                      }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${perk.available ? "bg-[#227dff]/10 border-[#227dff]/30" : "border-[#2b344a] bg-transparent"
                      }`}>
                      {perk.available ? (
                        <FiCheck className="text-[#227dff] w-3.5 h-3.5" />
                      ) : (
                        <FiX className="text-[#5c667f] w-3 h-3" />
                      )}
                    </div>
                    <span>{perk.label}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`min-h-[48px] w-full rounded-xl py-3 px-6 text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${plan.featured
                    ? "bg-gradient-to-r from-[#227dff] to-[#332989] text-white hover:brightness-110"
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  }`}
              >
                Choose {plan.title}
              </button>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </main>
  );
}