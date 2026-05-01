"use client";

import React from "react";
import { FiCheck, FiX, FiZap, FiTarget, FiBriefcase, FiArrowRight } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#02050d] overflow-x-hidden">
      {/* 1. Navbar: Positioned at the top */}
      <Navbar />

      {/* 2. Main Content: flex-grow ensures this takes up available space, pushing footer down */}
      <main className="flex-grow text-slate-200 selection:bg-blue-500/30">
        <section className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:pt-40">
          
          {/* Header Section: Clear Visual Hierarchy */}
          <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-blue-500 mb-4">
              Investment
            </h2>
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-6xl">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Level Up?</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-400 leading-relaxed">
              Choose a plan that fits your current career stage. All plans include access to our core AI interview simulation engine.
            </p>
          </div>

          {/* Pricing Grid: Using Grid for responsive layout */}
          <div className="grid gap-8 md:grid-cols-3 items-stretch">
            {plans.map((plan, index) => (
              <article
                key={plan.title}
                className={`relative flex flex-col rounded-3xl border transition-all duration-500 hover:translate-y-[-8px] ${
                  plan.featured 
                    ? "bg-gradient-to-b from-[#111827] to-[#050d17] border-blue-500/50 p-8 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] z-10 scale-105" 
                    : "bg-[#050d17]/50 border-slate-800 p-7"
                }`}
              >
                {/* Visual Anchor: Recommendation Badge */}
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg z-20">
                    RECOMMENDED
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 shadow-inner">
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{plan.title}</h3>
                </div>

                <p className="text-sm text-slate-400 mb-8 leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-400">$</span>
                    <span className="text-6xl font-black text-white tracking-tighter">
                      {plan.price}
                    </span>
                    <span className="text-slate-500 font-medium ml-1">/month</span>
                  </div>
                </div>

                {/* Primary Action Button: High contrast for conversion */}
                <button
                  type="button"
                  className={`group mb-10 w-full rounded-2xl py-4 text-sm font-bold transition-all duration-300 active:scale-95 ${
                    plan.featured
                      ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    Get Started with {plan.title}
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                {/* Perks List: Clear scannability */}
                <div className="mt-auto space-y-5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                    Key Features
                  </p>
                  <ul className="space-y-4">
                    {plan.perks.map((perk) => (
                      <li
                        key={perk.label}
                        className="flex items-start gap-3"
                      >
                        <div className={`mt-0.5 flex-shrink-0 ${perk.available ? "text-blue-500" : "text-slate-700"}`}>
                          {perk.available ? <FiCheck size={18} /> : <FiX size={18} />}
                        </div>
                        <span className={`text-sm ${perk.available ? "text-slate-300" : "text-slate-600 line-through"}`}>
                          {perk.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          {/* Social Proof/Safety Net */}
          <div className="mt-20 text-center opacity-80">
            <p className="text-slate-500 text-sm font-medium italic">
              All plans include a 7-day money-back guarantee. Secure payments processed via Stripe.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}