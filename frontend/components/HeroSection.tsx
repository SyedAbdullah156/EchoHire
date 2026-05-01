"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring, Variants } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiPlay } from "react-icons/fi";

// ─── Variants ─────────────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
};
const wordReveal: Variants = {
  hidden: { opacity: 0, y: 32, rotateX: -14 },
  visible: {
    opacity: 1, y: 0, rotateX: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ─── Full-bleed Constellation Canvas ──────────────────────────────────────────

interface PNode { x: number; y: number; vx: number; vy: number; r: number; phase: number; }

function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const nodes = useRef<PNode[]>([]);
  const frame = useRef(0);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const DPR = window.devicePixelRatio || 1;
    const N = 68, MAX_D = 145, REPEL = 115;

    const resize = () => {
      canvas.width = canvas.offsetWidth * DPR;
      canvas.height = canvas.offsetHeight * DPR;
      ctx.scale(DPR, DPR);
    };
    resize();
    window.addEventListener("resize", resize);

    nodes.current = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.5 + 0.8,
      phase: Math.random() * Math.PI * 2,
    }));

    const tick = (t: number) => {
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      const ns = nodes.current;
      const { x: mx, y: my } = mouse.current;

      for (const n of ns) {
        const dx = n.x - mx, dy = n.y - my;
        const d = Math.hypot(dx, dy);
        if (d < REPEL && d > 0) {
          const f = ((REPEL - d) / REPEL) * 0.13;
          n.vx += (dx / d) * f; n.vy += (dy / d) * f;
        }
        n.vx *= 0.973; n.vy *= 0.973;
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        n.x = Math.max(0, Math.min(W, n.x));
        n.y = Math.max(0, Math.min(H, n.y));
      }

      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const d = Math.hypot(ns[i].x - ns[j].x, ns[i].y - ns[j].y);
          if (d < MAX_D) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(34,125,255,${(1 - d / MAX_D) * 0.17})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(ns[i].x, ns[i].y);
            ctx.lineTo(ns[j].x, ns[j].y);
            ctx.stroke();
          }
        }
      }

      for (const n of ns) {
        const p = 0.5 + 0.5 * Math.sin(t * 0.0008 + n.phase);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,125,255,${0.055 * p})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,125,255,${0.62 * p})`;
        ctx.fill();
      }

      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };
    window.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ─── Typewriter Terminal ───────────────────────────────────────────────────────

const SEQ = [
  { delay: 700,  prefix: "▸", text: "Connecting to inference engine…",          color: "#5c6f94" },
  { delay: 1600, prefix: "✓", text: "Session ready · Candidate: Alex Chen",      color: "#4ade80" },
  { delay: 2600, prefix: "▸", text: "Evaluating system design response…",        color: "#5c6f94" },
  { delay: 3700, prefix: "▸", text: "Scoring depth, trade-offs, clarity…",       color: "#5c6f94" },
  { delay: 4700, prefix: "✓", text: "Architecture clarity  96 / 100",            color: "#4ade80" },
  { delay: 5500, prefix: "✓", text: "Edge-case coverage   91 / 100",             color: "#4ade80" },
  { delay: 6400, prefix: "✦", text: "Decision: Top 3% · Strong Hire ✓",          color: "#227dff" },
];

function TypewriterTerminal() {
  const [lines, setLines] = useState<typeof SEQ>([]);

  useEffect(() => {
    const timers = SEQ.map((l) => setTimeout(() => setLines((p) => [...p, l]), l.delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="rounded-xl border border-white/[0.05] bg-[#030712]/95 overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.04] bg-[#070d1a]">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-4 font-mono text-[10px] text-[#3d5070] tracking-wide">
          echohire · ai-evaluator · session_0x4f2a
        </span>
      </div>
      <div className="px-4 py-4 font-mono text-xs space-y-2.5 min-h-[190px]">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex items-start gap-2.5"
          >
            <span style={{ color: l.color }} className="shrink-0 w-3">{l.prefix}</span>
            <span style={{ color: l.color === "#5c6f94" ? "#7f92be" : l.color }}>{l.text}</span>
          </motion.div>
        ))}
        <div className="flex items-center gap-2.5">
          <span className="text-[#3d5070] w-3">▸</span>
          <span className="inline-block h-[11px] w-[5px] bg-[#227dff] rounded-[2px] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────────

export default function HeroSection() {
  return (
    <section
      data-parallax-root
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* L0: full-bleed constellation */}
      <HeroCanvas />

      {/* L1: radial vignette — flat colour overlay, zero shadow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 0%, #030712 100%)",
        }}
      />
      {/* L1b: left-side darkening for left-column readability */}
      <div
        className="absolute inset-y-0 left-0 w-[58%] pointer-events-none"
        style={{ background: "linear-gradient(to right, #030712 45%, transparent 100%)" }}
      />

      {/* L2: hairline anchor */}
      <div className="absolute inset-x-0 top-[72px] h-px bg-white/[0.04]" />

      {/* L3: content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pt-28 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-16 xl:gap-24 items-center">

          {/* ── LEFT: Staggered copy ── */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col gap-8"
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-[#227dff]/25 bg-[#227dff]/[0.07] px-4 py-1.5 text-xs font-semibold tracking-[0.12em] text-[#93bcff] uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#227dff] animate-pulse" />
                Generative AI · Technical Assessment Platform
              </span>
            </motion.div>

            {/* H1 — word-level stagger, 3 typographic tiers */}
            <motion.h1
              variants={stagger}
              className="font-black tracking-tight"
              style={{ perspective: "800px" }}
            >
              {/* Tier 1 – utility promise – white, largest */}
              {["Hire Smarter.", "Not Harder."].map((line) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    variants={wordReveal}
                    className="block text-white text-[52px] md:text-[66px] lg:text-[76px] leading-[0.96]"
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
              {/* Tier 2 – category signal – brand blue, same scale */}
              <span className="block overflow-hidden mt-1">
                <motion.span
                  variants={wordReveal}
                  className="block text-[#227dff] text-[52px] md:text-[66px] lg:text-[76px] leading-[0.96]"
                >
                  AI Interviews
                </motion.span>
              </span>
              {/* Tier 3 – brand attribution – muted, stepped down */}
              <span className="block overflow-hidden mt-2">
                <motion.span
                  variants={wordReveal}
                  className="block text-[#2e4268] font-light text-[32px] md:text-[40px] lg:text-[46px] leading-[1] tracking-wide"
                >
                  by EchoHire.
                </motion.span>
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={fadeUp}
              className="text-[15px] md:text-base text-[#7f92be] leading-relaxed max-w-[500px]"
            >
              The objective, efficient, and deeply technical assessment platform powered by generative AI.{" "}
              <span className="text-[#a8bcdd]">Evaluate candidates fairly, at scale.</span>
            </motion.p>

            {/* CTAs — flat solid fill, pure hue-shift on hover, zero shadow */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-3">
              <Link
                href="/auth"
                className="group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl bg-[#227dff] px-8 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#1a68d4] active:bg-[#1558b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#227dff]/60"
              >
                Start Free Trial
                <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#demo"
                className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl bg-white/[0.05] px-8 py-3 text-[15px] font-medium text-[#dbe7ff] transition-colors hover:bg-white/[0.09] active:bg-white/[0.13] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              >
                <FiPlay className="h-4 w-4" />
                See how it works
              </Link>
            </motion.div>

            {/* Trust micro-row */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-5">
              {["No credit card required", "14-day free trial", "Cancel anytime"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-sm text-[#4a5e80]">
                  <FiCheckCircle className="w-3.5 h-3.5 text-[#227dff]" />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Terminal + metric cards ── */}
          <motion.div
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex flex-col gap-4"
          >
            {/* Depth plane 1: `bg-[#070d1a]` wraps the terminal */}
            <div className="rounded-[1.5rem] bg-[#070d1a] border border-white/[0.05] p-4">
              <TypewriterTerminal />
            </div>

            {/* Depth plane 2: metric cards at `bg-[#0d162a]` */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Interviews", value: "24k+", sub: "this month",       accent: "#227dff" },
                { label: "Avg. Score", value: "87",   sub: "/ 100 baseline",   accent: "#4ade80" },
                { label: "Hire Speed", value: "3.2×", sub: "faster decisions", accent: "#a78bfa" },
              ].map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + i * 0.1, duration: 0.45 }}
                  className="rounded-xl bg-[#0d162a] border border-white/[0.04] px-3 py-4 flex flex-col gap-1"
                >
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#4a5e80]">
                    {c.label}
                  </p>
                  <p className="text-[22px] font-black leading-none" style={{ color: c.accent }}>
                    {c.value}
                  </p>
                  <p className="text-[9px] text-[#3d5070]">{c.sub}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* L4: bottom fade — connects seamlessly to next section via colour only */}
      <div
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #030712)" }}
      />
    </section>
  );
}
