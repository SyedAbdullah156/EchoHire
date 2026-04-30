"use client";

import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import RecruiterSidebar from "@/components/RecruiterSidebar";
import { useAuth } from "@/context/AuthContext";
import { 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown, 
  Search,
  Zap,
  User,
  Briefcase,
  Code
} from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import { useState } from "react";

const FAQ_DATA = [
  {
    category: "General",
    icon: <Zap size={18} className="text-amber-400" />,
    items: [
      {
        question: "What is EchoHire?",
        answer: "EchoHire is an AI-driven recruitment platform that streamlines the hiring process through automated resume analysis, AI-powered video interviews, and technical assessments. We help candidates showcase their true potential and recruiters find the best fit efficiently."
      },
      {
        question: "How does the AI interview work?",
        answer: "Our AI interview system uses advanced natural language processing to ask role-specific questions and analyze your responses. It evaluates not just what you say, but how you communicate, providing a holistic view of your capabilities."
      },
      {
        question: "Is my data secure?",
        answer: "Yes, we take data privacy seriously. All candidate data and interview recordings are encrypted and stored securely. We comply with major data protection regulations and never share your personal information with third parties without your consent."
      }
    ]
  },
  {
    category: "For Candidates",
    icon: <User size={18} className="text-primary" />,
    items: [
      {
        question: "How can I improve my ATS score?",
        answer: "To improve your ATS score on EchoHire, ensure your resume is clearly formatted, uses standard section headings, and includes relevant keywords from the job description. Our Resume Analyzer tool provides specific feedback to help you optimize it."
      },
      {
        question: "Can I retake an AI interview?",
        answer: "Usually, companies set their own policies for retakes. If a technical issue occurred, you can contact our support team to request a reset. Otherwise, we recommend preparing thoroughly and using our practice mode before the real interview."
      },
      {
        question: "How do I track my application status?",
        answer: "You can track all your applications in real-time through the Candidate Dashboard. We'll also send you email notifications whenever there's an update from the recruiter."
      }
    ]
  },
  {
    category: "Technical Assessments",
    icon: <Code size={18} className="text-purple-400" />,
    items: [
      {
        question: "What programming languages are supported?",
        answer: "Our technical assessment platform supports over 20+ programming languages, including Python, JavaScript, Java, C++, Go, and Ruby. The specific languages available for a test depend on the recruiter's requirements."
      },
      {
        question: "Is there a time limit for coding tests?",
        answer: "Yes, most coding tests have a pre-defined time limit. The timer starts as soon as you begin the assessment. We recommend ensuring you have a stable internet connection and a quiet environment before starting."
      }
    ]
  },
  {
    category: "For Recruiters",
    icon: <Briefcase size={18} className="text-emerald-400" />,
    items: [
      {
        question: "How does the AI ranking work?",
        answer: "EchoHire ranks candidates based on a combination of their resume score, AI interview performance, and technical assessment results. Our algorithm balances these factors to surface the most qualified candidates for your specific role."
      },
      {
        question: "Can I customize the interview questions?",
        answer: "Absolutely! Recruiters can choose from our extensive library of validated questions or create their own custom questions tailored to their company's culture and specific role requirements."
      }
    ]
  }
];

export default function FAQPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = FAQ_DATA.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <main className="min-h-screen bg-background text-[#e2e8f0] flex flex-col lg:flex-row p-4 lg:p-8 gap-8 antialiased">
      {user?.role === "recruiter" ? (
        <RecruiterSidebar />
      ) : (
        <DashboardSidebar active="support" />
      )}

      <div className="flex-1 flex flex-col min-w-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-background/80 backdrop-blur-md border-b border-border-medium/60 pb-6 mb-2 rounded-3xl">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center text-sm text-text-secondary mb-6 px-2">
            <Link 
              href="/support" 
              className="group flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> 
              Back to Support
            </Link>
          </nav>

          <header className="px-2">
            <div className="flex items-center gap-3 mb-2">
              <HelpCircle className="text-primary" size={28} />
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Knowledge Base</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">Frequently Asked Questions</h1>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl leading-relaxed">
              Find quick answers to common questions about EchoHire&apos;s features, security, and process.
            </p>
          </header>
        </div>

        <div className="px-2 space-y-12">
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input 
              type="text" 
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border-subtle bg-surface-2 py-4 pl-12 pr-4 text-foreground placeholder-[#4a5d89] transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-lg"
            />
          </div>

          <div className="grid gap-12 max-w-4xl">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((category, idx) => (
                <section key={idx} className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-border-medium/60 pb-3">
                    {category.icon}
                    <h2 className="text-xl font-bold text-foreground tracking-tight">{category.category}</h2>
                  </div>

                  <Accordion.Root type="single" collapsible className="space-y-4">
                    {category.items.map((item, itemIdx) => (
                      <Accordion.Item 
                        key={itemIdx} 
                        value={`${idx}-${itemIdx}`}
                        className="group overflow-hidden rounded-2xl border border-border-subtle bg-surface-2/50 backdrop-blur-sm transition-all hover:border-[#32466f]"
                      >
                        <Accordion.Header>
                          <Accordion.Trigger className="flex w-full items-center justify-between p-5 text-left transition-all">
                            <span className="text-base font-semibold text-slate-200 group-hover:text-foreground group-data-[state=open]:text-primary">
                              {item.question}
                            </span>
                            <ChevronDown 
                              size={18} 
                              className="text-text-muted transition-transform duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary" 
                            />
                          </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content className="overflow-hidden text-sm text-text-secondary data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                          <div className="p-5 pt-0 leading-relaxed border-t border-border-medium/30 mt-2">
                            {item.answer}
                          </div>
                        </Accordion.Content>
                      </Accordion.Item>
                    ))}
                  </Accordion.Root>
                </section>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-text-muted text-lg">No results found for &quot;{searchQuery}&quot;</p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-primary hover:underline font-semibold"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 px-2 pb-12">
          <div className="rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-8 lg:p-12 border border-blue-500/20 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <h3 className="text-2xl font-bold text-foreground mb-4 relative z-10">Still have questions?</h3>
            <p className="text-text-secondary max-w-xl mx-auto mb-8 relative z-10">
              Can&apos;t find the answer you&apos;re looking for? Please chat with our friendly team.
            </p>
            <button 
              onClick={() => window.dispatchEvent(new Event("open-support-chat"))}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-foreground shadow-xl shadow-blue-500/20 transition-all hover:bg-primary hover:scale-105 active:scale-95 relative z-10 cursor-pointer"
            >
              Contact Support
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
