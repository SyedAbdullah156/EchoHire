import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 pb-12 pt-8 lg:flex-row md:px-6">
        <DashboardSidebar active="support" />
        <div className="flex-1">
        <header className="mb-5 rounded-2xl border border-[#243253] bg-[#0d162a] p-5">
          <h1 className="text-4xl font-semibold text-[#dbe7ff]">Help & Support</h1>
          <p className="mt-1 text-base text-[#9fb1d8]">Get answers quickly and contact the EchoHire team.</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-[#243253] bg-[#0d162a] p-5">
            <h2 className="text-xl font-semibold text-[#dbe7ff]">Common Questions</h2>
            <ul className="mt-3 space-y-2 text-sm text-[#c3d0ed]">
              <li>How do I start an AI interview session?</li>
              <li>How do I upload a new resume?</li>
              <li>How can I improve my ATS score?</li>
              <li>Where can I update my profile settings?</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-[#243253] bg-[#0d162a] p-5">
            <h2 className="text-xl font-semibold text-[#dbe7ff]">Contact Support</h2>
            <p className="mt-3 text-sm text-[#c3d0ed]">Email: support@echohire.ai</p>
            <p className="text-sm text-[#c3d0ed]">Response time: usually within 24 hours.</p>
            <button type="button" className="mt-4 rounded-lg bg-gradient-to-r from-[#2a7df7] to-[#372e8f] px-4 py-2 text-sm font-medium">
              Create Support Ticket
            </button>
          </article>
        </div>

        <Link href="/dashboard" className="mt-5 inline-block rounded-lg border border-[#32466f] px-4 py-2 text-sm text-[#dbe7ff]">
          Back to Dashboard
        </Link>
        </div>
      </section>
    </main>
  );
}
