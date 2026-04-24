// app/page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="bg-black text-white">
      <Navbar />
      <Hero />
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/pricing"
            className="rounded-xl border border-blue-900/60 bg-[#071125] p-5 transition hover:border-blue-500"
          >
            <p className="text-lg font-semibold text-blue-300">Pricing</p>
            <p className="text-sm text-gray-300">Choose the plan that fits you best.</p>
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-blue-900/60 bg-[#071125] p-5 transition hover:border-blue-500"
          >
            <p className="text-lg font-semibold text-blue-300">Dashboard</p>
            <p className="text-sm text-gray-300">Track interviews, skills, and progress.</p>
          </Link>
          <Link
            href="/auth"
            className="rounded-xl border border-blue-900/60 bg-[#071125] p-5 transition hover:border-blue-500"
          >
            <p className="text-lg font-semibold text-blue-300">Sign In / Sign Up</p>
            <p className="text-sm text-gray-300">Access your workspace securely.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}