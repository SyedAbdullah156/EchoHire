"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="fixed top-6 w-full flex justify-center px-4 z-[1000]">
     <nav className="w-full max-w-7xl flex items-center justify-between px-6 py-2.5
  rounded-2xl 
  border border-white/30 
  bg-black/20 backdrop-blur-xl
  shadow-[0_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(59,130,246,0.3)]">

        {/* Logo Section */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white text-xs font-bold">EH</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Echo<span className="text-blue-400">Hire</span>
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-10 text-[13px] font-medium tracking-wide">
          <Link href="/" className="text-gray-400 hover:text-blue-300 transition-colors duration-300">Features</Link>
          <Link href="/pricing" className="text-gray-400 hover:text-blue-300 transition-colors duration-300">Pricing</Link>
          <Link href="/dashboard" className="text-gray-400 hover:text-blue-300 transition-colors duration-300">AI Interview</Link>
          <Link href="/auth" className="text-gray-400 hover:text-blue-300 transition-colors duration-300">About Us</Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-6">
          <Link href="/auth" className="text-[13px] font-medium text-gray-300 hover:text-white transition-all">
            Sign In
          </Link>

          <Link href="/auth" className="relative group px-5 py-2 rounded-xl overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 group-hover:scale-105 transition-transform duration-300"></div>
            {/* Button Text */}
            <span className="relative text-sm font-semibold text-white">
              Get Started
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}