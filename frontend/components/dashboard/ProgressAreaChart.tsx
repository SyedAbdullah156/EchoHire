"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const progressData = [
  { week: "W1", score: 45 },
  { week: "W2", score: 50 },
  { week: "W3", score: 52 },
  { week: "W4", score: 61 },
  { week: "W5", score: 68 },
  { week: "W6", score: 72 },
  { week: "W7", score: 78 },
  { week: "W8", score: 86 },
];

export default function ProgressAreaChart() {
  return (
    <div className="h-[240px] w-full rounded-xl border border-white/10 bg-[#0a1223]/80 p-3 md:h-[290px]">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
        <AreaChart data={progressData} margin={{ top: 12, right: 10, left: -20, bottom: 4 }}>
          <defs>
            <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ea1ff" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#4ea1ff" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#203458" strokeDasharray="4 4" />
          <XAxis dataKey="week" stroke="#9db4df" tickLine={false} axisLine={false} />
          <YAxis stroke="#9db4df" tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ stroke: "#7aa8f8", strokeWidth: 1 }}
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(8,14,30,0.92)",
              color: "#eaf1ff",
            }}
          />
          <Area type="monotone" dataKey="score" stroke="#66b0ff" strokeWidth={3} fillOpacity={1} fill="url(#progressGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
