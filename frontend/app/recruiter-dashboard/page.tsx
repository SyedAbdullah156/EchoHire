"use client";

import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { FiArrowRight, FiBriefcase, FiSearch, FiUsers } from "react-icons/fi";

const tiles = [
  {
    title: "Post a Job",
    desc: "Create a new role and start collecting applicants.",
    icon: FiBriefcase,
    href: "/companies",
  },
  {
    title: "Search Candidates",
    desc: "Find profiles that match your role requirements.",
    icon: FiSearch,
    href: "/linkedin-optimizer",
  },
  {
    title: "Manage Pipeline",
    desc: "Review candidates and move them through interview rounds.",
    icon: FiUsers,
    href: "/dashboard",
  },
];

export default function RecruiterDashboardPage() {
  return (
    <main className="min-h-screen bg-[#050b18] text-white [font-family:Inter,Manrope,ui-sans-serif,system-ui,sans-serif]">
      <section className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 pb-10 pt-8 lg:flex-row md:px-6">
        <DashboardSidebar active="dashboard" />

        <div className="flex-1 space-y-4">
          <header className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_30px_rgba(10,39,105,0.2)] backdrop-blur-xl">
            <p className="text-sm font-medium uppercase tracking-wider text-[#8db5ff]">
              Recruiter Dashboard
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-[#dbe7ff] md:text-4xl">
              Build a clean hiring loop
            </h1>
            <p className="mt-2 text-sm text-[#bfcbeb] md:text-base">
              Quick actions for posting roles, reviewing candidates, and keeping rounds aligned.
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tiles.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.title}
                  href={t.href}
                  className="group rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(7,20,43,0.95)_0%,rgba(11,23,48,0.65)_100%)] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <div className="flex items-start gap-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10">
                      <Icon className="text-blue-200" size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-blue-200">{t.title}</p>
                      <p className="mt-1 text-sm text-[#aab8d8]">{t.desc}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-[#7f92be]">Open</span>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[#dbe7ff] transition group-hover:text-white">
                      <FiArrowRight />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-[#bfcbeb] shadow-[0_0_30px_rgba(10,39,105,0.12)] backdrop-blur-xl">
            Tip: if you created your account as recruiter by mistake, logout and sign up again as a student.
          </div>
        </div>
      </section>
    </main>
  );
}

