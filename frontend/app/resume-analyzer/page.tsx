import Link from "next/link";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { FiAlertCircle, FiCheckCircle, FiUploadCloud } from "react-icons/fi";

const strengths = [
  "Strong technical skill section with relevant tools.",
  "Clear project outcomes with measurable impact.",
  "Good structure and section hierarchy for ATS parsing.",
];

const improvements = [
  "Add keywords: microservices, cloud architecture, CI/CD.",
  "Increase action verbs in experience bullet points.",
  "Include one leadership-focused achievement.",
];

export default function ResumeAnalyzerPage() {
  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <Navbar />
      <section className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 pb-8 pt-28 lg:flex-row md:px-6">
        <DashboardSidebar active="resume-analyzer" />
        <div className="flex-1">
        <header className="mb-5 rounded-2xl border border-[#243253] bg-[#0d162a] p-5 shadow-[0_0_30px_rgba(10,39,105,0.2)]">
          <h1 className="text-2xl font-semibold text-[#dbe7ff] md:text-4xl">Resume Scanner & ATS Analyzer</h1>
          <p className="text-sm text-[#9fb1d8] md:text-lg">Upload your resume and compare it against ATS requirements for your target role.</p>
        </header>

        <div className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
          <article className="rounded-2xl border border-[#243253] bg-[#0d162a] p-6 shadow-[0_0_30px_rgba(10,39,105,0.2)]">
            <p className="mb-3 text-2xl font-semibold text-[#dbe7ff] md:text-3xl">Upload Resume</p>
            <div className="grid min-h-[250px] place-items-center rounded-2xl border-2 border-dashed border-[#37507f] bg-[#0f1a31] p-6 text-center">
              <div>
                <FiUploadCloud className="mx-auto text-4xl text-[#2f7ef4] md:text-5xl" />
                <p className="mt-3 text-lg text-[#dbe7ff] md:text-2xl">Drag & drop your resume here</p>
                <p className="text-sm text-[#8ea4cd] md:text-base">or click to browse files (.pdf, .docx)</p>
                <button
                  type="button"
                  className="mt-4 rounded-lg bg-gradient-to-r from-[#2a7df7] to-[#372e8f] px-4 py-2 text-sm text-white md:text-base"
                >
                  Choose File
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-[#2a3b61] bg-[#0a1223] p-4">
              <p className="text-base text-[#8fa5d3] md:text-lg">ATS Compatibility Score</p>
              <p className="text-4xl font-semibold text-[#f4f7ff] md:text-6xl">92/100</p>
              <p className="text-sm text-[#8ea4cd] md:text-base">Great match for Software Engineer roles with minor keyword improvements.</p>
            </div>
          </article>

          <aside className="space-y-4 rounded-2xl border border-[#243253] bg-[#0d162a] p-6 shadow-[0_0_30px_rgba(10,39,105,0.2)]">
            <div>
              <p className="text-2xl font-semibold text-[#dbe7ff] md:text-[28px]">Strengths</p>
              <ul className="mt-3 space-y-2 text-sm text-[#bdc9e3] md:text-base">
                {strengths.map((item) => (
                  <li key={item} className="flex gap-2 rounded-lg border border-[#2a3b61] bg-[#101c35] p-3">
                    <FiCheckCircle className="mt-0.5 text-[#2f7ef4]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-2xl font-semibold text-[#dbe7ff] md:text-[28px]">Needs Improvement</p>
              <ul className="mt-3 space-y-2 text-sm text-[#bdc9e3] md:text-base">
                {improvements.map((item) => (
                  <li key={item} className="flex gap-2 rounded-lg border border-[#2a3b61] bg-[#101c35] p-3">
                    <FiAlertCircle className="mt-0.5 text-[#d2782b]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                className="rounded-lg bg-[#17243f] px-4 py-2 text-sm text-[#dbe7ff] md:text-base"
              >
                Re-Analyze Resume
              </button>
              <Link
                href="/dashboard"
                className="rounded-lg border border-[#32466f] px-4 py-2 text-sm text-[#dbe7ff] md:text-base"
              >
                Back to Dashboard
              </Link>
            </div>
          </aside>
        </div>
        </div>
      </section>
    </main>
  );
}
