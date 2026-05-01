import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { 
  Search, 
  MessageCircle, 
  Mail, 
  BookOpen, 
  ExternalLink, 
  ArrowLeft,
  LifeBuoy
} from "lucide-react";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#050b18] text-[#e2e8f0] selection:bg-blue-500/30 antialiased">
      <section className="mx-auto flex max-w-[1500px] flex-col gap-8 px-4 pb-12 pt-8 lg:flex-row md:px-8">
        <DashboardSidebar active="support" />

        <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center text-sm text-[#9fb1d8]">
            <Link 
              href="/dashboard" 
              className="group flex items-center gap-2 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> 
              Back to Dashboard
            </Link>
          </nav>

          <header>
            <div className="flex items-center gap-3 mb-2">
              <LifeBuoy className="text-[#2a7df7]" size={28} />
              <span className="text-xs font-bold uppercase tracking-widest text-[#4a5d89]">Help Center</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-white">How can we help?</h1>
            <p className="mt-4 text-lg text-[#9fb1d8] max-w-2xl">
              Search our documentation or contact our engineering team for technical assistance.
            </p>
          </header>

          {/* Search Bar - HCI: Reduces search time */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5d89]" size={20} />
            <input 
              type="text" 
              placeholder="Search for articles, guides, or keywords..."
              className="w-full rounded-2xl border border-[#243253] bg-[#0d162a] py-4 pl-12 pr-4 text-white placeholder-[#4a5d89] transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Quick Guides Card */}
            <article className="group flex flex-col justify-between rounded-3xl border border-[#243253] bg-[#0d162a]/80 p-6 backdrop-blur-md transition-all hover:border-[#32466f] hover:shadow-xl hover:shadow-blue-500/5">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <BookOpen size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">Common Questions</h2>
                <ul className="mt-4 space-y-3 text-sm text-[#c3d0ed]">
                  {['Starting an AI Interview', 'Resume Upload Guide', 'Improving ATS Scores'].map((item) => (
                    <li key={item} className="flex items-center justify-between group/link cursor-pointer hover:text-white transition-colors">
                      {item}
                      <ExternalLink size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </li>
                  ))}
                </ul>
              </div>
              <button className="mt-6 text-sm font-semibold text-blue-400 hover:text-blue-300">
                View Knowledge Base
              </button>
            </article>

            {/* Support Ticket Card */}
            <article className="rounded-3xl border border-[#243253] bg-[#0d162a]/80 p-6 backdrop-blur-md transition-all hover:border-[#32466f]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <MessageCircle size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Direct Assistance</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#c3d0ed]">
                Have a specific technical issue or account question? Open a priority ticket with our team.
              </p>
              <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#2a7df7] to-[#372e8f] py-3 text-sm font-bold shadow-lg shadow-blue-500/20 transition-transform active:scale-95">
                Create Support Ticket
              </button>
            </article>

            {/* Quick Contact Card */}
            <article className="rounded-3xl border border-[#243253] bg-[#0d162a]/80 p-6 backdrop-blur-md transition-all hover:border-[#32466f]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Mail size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Contact EchoHire</h2>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-white">support@echohire.ai</p>
                <p className="text-xs text-[#9fb1d8]">Average Response: &lt; 24 hours</p>
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#050b18] p-3 border border-[#243253]">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">Live Support Online</span>
                </div>
              </div>
            </article>
          </div>

          {/* User Feedback Loop - HCI: Continuous improvement */}
          <footer className="rounded-2xl bg-[#0d162a]/40 p-6 text-center border border-[#243253]">
            <p className="text-sm text-[#9fb1d8]">Did you find what you were looking for?</p>
            <div className="mt-3 flex justify-center gap-4">
               <button className="text-xs bg-[#0a1223] px-4 py-2 rounded-lg border border-[#243253] hover:border-blue-500">Yes, thanks!</button>
               <button className="text-xs bg-[#0a1223] px-4 py-2 rounded-lg border border-[#243253] hover:border-red-500">Not really</button>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}