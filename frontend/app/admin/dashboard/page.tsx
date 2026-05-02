"use client";

import Link from "react-icons/fi";
import { FiMessageSquare, FiActivity, FiUsers, FiServer, FiAlertTriangle, FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";
import NextLink from "next/link";

export default function AdminDashboardOverview() {
  const stats = [
    { label: "Active Users", value: "1,284", icon: FiUsers, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "System Health", value: "99.9%", icon: FiActivity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Open Tickets", value: "12", icon: FiMessageSquare, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "API Latency", value: "42ms", icon: FiServer, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight">System Overview</h1>
        <p className="text-text-muted mt-1 font-medium">Real-time metrics and system alerts for EchoHire.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-[2rem] bg-surface-2 border border-white/5 hover:border-white/10 transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                <Icon size={24} />
              </div>
              <p className="text-sm font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-white mt-1 tracking-tighter">{stat.value}</h3>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Alerts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-[2rem] bg-surface-2 border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <FiAlertTriangle className="text-amber-500" />
                Critical Alerts
              </h2>
              <span className="text-xs font-bold text-text-muted tracking-widest uppercase">Live Updates</span>
            </div>
            
            <div className="space-y-4">
              {[
                { title: "Database Load Spike", time: "2m ago", severity: "high", desc: "Primary cluster memory usage exceeded 85%." },
                { title: "Failed Login Attempts", time: "15m ago", severity: "medium", desc: "Detected unusual activity from 192.168.1.45." },
                { title: "API Deprecation Warning", time: "1h ago", severity: "low", desc: "v1.2 endpoints will be retired on June 1st." },
              ].map((alert, i) => (
                <div key={i} className="p-4 rounded-2xl bg-surface-1 border border-white/5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                    alert.severity === 'high' ? 'bg-rose-500' : alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                      <span className="text-[10px] font-bold text-slate-500">{alert.time}</span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <div className="p-8 rounded-[2rem] bg-surface-2 border border-white/5 space-y-6">
            <h2 className="text-xl font-bold text-white">Direct Actions</h2>
            <div className="grid gap-4">
              <NextLink 
                href="/admin/dashboard/ticketing"
                className="group flex items-center justify-between p-4 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <FiMessageSquare className="text-primary" />
                  <span className="text-sm font-bold text-white">Support Tickets</span>
                </div>
                <FiTrendingUp className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
              </NextLink>
              
              <button className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <FiServer className="text-slate-400" />
                  <span className="text-sm font-bold text-white">Server Logs</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
