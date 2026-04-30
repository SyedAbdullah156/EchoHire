import Link from "next/link";
import {
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiFileText,
  FiMessageSquare,
} from "react-icons/fi";

const highlights = [
  {
    title: "AI Interview Practice",
    desc: "Practice adaptive technical and behavioral interviews with feedback-focused sessions.",
    icon: FiMessageSquare,
  },
  {
    title: "Resume + ATS Analysis",
    desc: "Upload your resume to get ATS compatibility insights and targeted improvements.",
    icon: FiFileText,
  },
  {
    title: "LinkedIn Optimization",
    desc: "Analyze your profile URL or PDF and get clear, actionable profile recommendations.",
    icon: FiBarChart2,
  },
];

export default function AboutEchoHirePage() {
  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6">
        <header className="rounded-2xl border border-white/20 bg-black/20 p-6 shadow-[0_0_1px_1px_rgba(255,255,255,0.08),0_0_20px_rgba(59,130,246,0.2)] backdrop-blur-xl">
          <p className="text-sm font-medium uppercase tracking-wider text-[#8db5ff]">
            About EchoHire
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#e8efff] md:text-5xl">
            Career Growth, Powered by Practical AI
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#aebfdf] md:text-base">
            EchoHire is a focused career platform that helps candidates prepare better for real
            opportunities. We combine mock interviews, resume analytics, and profile optimization
            to help users improve confidence and outcomes.
          </p>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-2xl border border-[#2a3b61] bg-[#0d162a] p-5 shadow-[0_0_20px_rgba(10,39,105,0.15)]"
              >
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-blue-300/30 bg-blue-500/10 text-[#8db5ff]">
                  <Icon />
                </div>
                <h2 className="text-lg font-semibold text-[#dbe7ff]">{item.title}</h2>
                <p className="mt-2 text-sm text-[#9fb1d8]">{item.desc}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-[#2a3b61] bg-[#0d162a] p-5">
          <h3 className="text-xl font-semibold text-[#dbe7ff]">What makes EchoHire different?</h3>
          <ul className="mt-3 space-y-2 text-sm text-[#b8c8e8]">
            {[
              "Simple workflow: prepare, analyze, improve, repeat.",
              "Modern UI designed for speed and clarity.",
              "Actionable insights instead of overwhelming reports.",
            ].map((point) => (
              <li key={point} className="flex items-start gap-2">
                <FiCheckCircle className="mt-0.5 text-[#4fa0ff]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/auth"
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#227dff] to-[#332989] px-5 py-3 text-sm font-medium text-white"
          >
            Start with EchoHire
            <FiArrowRight className="ml-2" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-[#dbe7ff]"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
