"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    fetch("http://localhost:5000/")
      .then(res => res.text())
      .then(data => console.log(data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">

      {/* 🔹 Navbar */}
      <nav className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold text-blue-400">EchoHire</h1>
        <div className="space-x-6">
          <button className="hover:text-blue-400">Features</button>
          <button className="hover:text-blue-400">Dashboard</button>
          <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">
            Get Started
          </button> 
          
        </div>
      </nav>

      {/* 🔥 Hero Section */}
      <section className="text-center mt-20 px-4">
        <h1 className="text-5xl font-extrabold leading-tight">
          AI-Powered Interview <br />
          & Career Optimization System
        </h1>

        <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
          Practice interviews, improve coding skills, optimize resumes, and boost your career with intelligent AI insights.
        </p>

        <div className="mt-8 space-x-4">
          <button className="bg-blue-500 px-6 py-3 rounded-xl text-lg hover:bg-blue-600">
            Start Interview
          </button>
          <button className="border border-gray-500 px-6 py-3 rounded-xl hover:bg-gray-700">
            Upload Resume
          </button>
        </div>
      </section>

      {/* 🚀 Features Section */}
      <section className="mt-24 px-10 grid md:grid-cols-3 gap-8">

        {/* Card 1 */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h2 className="text-xl font-bold text-blue-400">AI Interviewer</h2>
          <p className="mt-3 text-gray-400">
            Real-time text & voice-based AI interviews with adaptive questioning.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h2 className="text-xl font-bold text-blue-400">Live Coding</h2>
          <p className="mt-3 text-gray-400">
            Solve coding problems in real-time with performance analysis.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h2 className="text-xl font-bold text-blue-400">Resume Analyzer</h2>
          <p className="mt-3 text-gray-400">
            ATS scoring, keyword optimization, and AI suggestions.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h2 className="text-xl font-bold text-blue-400">LinkedIn Optimizer</h2>
          <p className="mt-3 text-gray-400">
            Improve visibility and recruiter reach using AI insights.
          </p>
        </div>

        {/* Card 5 */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h2 className="text-xl font-bold text-blue-400">Performance Analytics</h2>
          <p className="mt-3 text-gray-400">
            Track your progress with smart dashboards and reports.
          </p>
        </div>

        {/* Card 6 */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h2 className="text-xl font-bold text-blue-400">Career Dashboard</h2>
          <p className="mt-3 text-gray-400">
            Manage interviews, resumes, and career growth in one place.
          </p>
        </div>

      </section>

      {/* 📊 CTA Section */}
      <section className="mt-24 text-center pb-20">
        <h2 className="text-3xl font-bold">
          Ready to level up your career?
        </h2>

        <button className="mt-6 bg-blue-500 px-8 py-3 rounded-xl text-lg hover:bg-blue-600">
          Get Started Now
        </button>
      </section>

    </div>
  );
}