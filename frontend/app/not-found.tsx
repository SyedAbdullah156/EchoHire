"use client";

import { motion } from "framer-motion";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";

type Particle = {
  id: number;
  x: number[];
  duration: number;
  top: string;
  left: string;
};

export default function NotFound() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setParticles([...Array(6)].map((_, i) => ({
        id: i,
        x: [0, Math.random() * 50 - 25, 0],
        duration: 5 + Math.random() * 5,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      })));
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30 overflow-hidden relative">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-12 max-w-2xl"
        >
          {/* Big Glitchy 404 */}
          <div className="relative group cursor-default">
            <motion.h1 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 select-none"
            >
              404
            </motion.h1>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <span className="text-primary text-xl font-bold uppercase tracking-[1em] translate-y-12">Lost in Space</span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Page <span className="text-primary text-glow">Not Found</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed max-w-md mx-auto">
              The page you&apos;re looking for was moved, deleted, or never existed in this dimension. Let&apos;s get you back on track.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/"
              className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:bg-primary-hover hover:scale-105 active:scale-[0.98]"
            >
              <FiHome /> Back to Home
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-surface-1 border border-border-medium text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:bg-surface-2 hover:border-text-muted"
            >
              <FiArrowLeft /> Go Back
            </button>
          </div>

          {/* Quick Links */}
          <div className="pt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
             <Link href="/candidate/resume-analyzer" className="text-[10px] font-black uppercase tracking-widest text-white hover:text-primary transition-colors">Resume Analyzer</Link>
             <Link href="/candidate/linkedin-optimizer" className="text-[10px] font-black uppercase tracking-widest text-white hover:text-primary transition-colors">LinkedIn Optimizer</Link>
             <Link href="/pricing" className="text-[10px] font-black uppercase tracking-widest text-white hover:text-primary transition-colors">Pricing</Link>
          </div>
        </motion.div>
      </main>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#227dff_1px,transparent_1px)] [background-size:64px_64px] opacity-[0.03] pointer-events-none" />
      
      {/* Animated Floating Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            y: [0, -100, 0],
            x: p.x,
            opacity: [0, 0.4, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.id * 2
          }}
          className="absolute h-1 w-1 bg-primary rounded-full blur-sm"
          style={{
            top: p.top,
            left: p.left,
          }}
        />
      ))}
    </div>
  );
}
