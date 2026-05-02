"use client";

import { motion } from "framer-motion";
import { 
  FiServer, 
  FiDatabase, 
  FiCpu, 
  FiGlobe, 
  FiZap, 
  FiActivity,
  FiHardDrive,
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const performanceData = [
  { time: "00:00", cpu: 12, memory: 45, latency: 28 },
  { time: "04:00", cpu: 15, memory: 48, latency: 32 },
  { time: "08:00", cpu: 32, memory: 62, latency: 45 },
  { time: "12:00", cpu: 45, memory: 75, latency: 58 },
  { time: "16:00", cpu: 38, memory: 68, latency: 42 },
  { time: "20:00", cpu: 22, memory: 55, latency: 35 },
  { time: "23:59", cpu: 14, memory: 47, latency: 30 },
];

export default function SystemHealthPage() {
  const components = [
    { name: "API Gateway", status: "Operational", icon: FiGlobe, health: 100, latency: "24ms" },
    { name: "Primary Database", status: "Operational", icon: FiDatabase, health: 98, latency: "12ms" },
    { name: "WebSocket Server", status: "Under Load", icon: FiZap, health: 85, latency: "65ms" },
    { name: "AI Model Service", status: "Operational", icon: FiCpu, health: 100, latency: "420ms" },
    { name: "File Storage", status: "Operational", icon: FiHardDrive, health: 99, latency: "150ms" },
    { name: "Auth Service", status: "Operational", icon: FiCheckCircle, health: 100, latency: "8ms" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight">System Health</h1>
        <p className="text-text-muted mt-1 font-medium">Real-time infrastructure monitoring and performance metrics.</p>
      </header>

      {/* Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((comp, i) => (
          <motion.div
            key={comp.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-[2rem] bg-surface-2 border border-white/5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-surface-1 border border-white/10 flex items-center justify-center text-primary">
                <comp.icon size={24} />
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                comp.health > 90 ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-amber-500/30 text-amber-500 bg-amber-500/5'
              }`}>
                {comp.status}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white">{comp.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-text-muted font-medium">Latency</span>
                <span className="text-sm font-bold text-white">{comp.latency}</span>
              </div>
            </div>

            <div className="h-1.5 w-full bg-surface-1 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${comp.health}%` }}
                className={`h-full rounded-full ${comp.health > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="p-8 rounded-[2.5rem] bg-surface-2 border border-white/5 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Resource Utilization</h2>
            <p className="text-xs text-text-muted mt-1 font-medium">Historical CPU and Memory usage across all clusters.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">CPU</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Memory</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#227dff" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#227dff" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#ffffff20" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#7f92be' }}
              />
              <YAxis 
                stroke="#ffffff20" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#7f92be' }}
                unit="%"
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0d162a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', fontSize: '12px' }}
                itemStyle={{ color: '#ffffff' }}
              />
              <Area type="monotone" dataKey="cpu" stroke="#227dff" strokeWidth={3} fillOpacity={1} fill="url(#colorCpu)" />
              <Area type="monotone" dataKey="memory" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorMem)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
