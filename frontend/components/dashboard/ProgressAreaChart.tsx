"use client";

import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid
} from "recharts";

const progressData = [
  { week: "W1", score: 45 }, { week: "W2", score: 50 }, { week: "W3", score: 52 },
  { week: "W4", score: 61 }, { week: "W5", score: 68 }, { week: "W6", score: 72 },
  { week: "W7", score: 78 }, { week: "W8", score: 86 },
];

export default function ProgressAreaChart() {
  return (
    <div className="h-[300px] w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
          <XAxis 
            dataKey="week" 
            stroke="#4a5d89" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis stroke="#4a5d89" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0d162a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              color: "#fff"
            }}
            itemStyle={{ color: "#60a5fa", fontWeight: "bold" }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#3b82f6"
            strokeWidth={4}
            fill="url(#chartGlow)"
            animationDuration={2000}
            dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#050b18" }}
            activeDot={{ r: 8, fill: "#fff", stroke: "#3b82f6", strokeWidth: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}