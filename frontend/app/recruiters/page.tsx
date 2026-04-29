import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FiArrowRight, FiBarChart2, FiCheckCircle, FiClock, FiUsers } from "react-icons/fi";

const recruiterHighlights = [
  {
    title: "Shortlist Faster",
    desc: "Standardize early screening so you spend time on the best candidates.",
    icon: FiClock,
  },
  {
    title: "Role-fit Insights",
    desc: "See structured signals across technical and behavioral dimensions.",
    icon: FiBarChart2,
  },
  {
    title: "Consistent Hiring Loop",
    desc: "Keep evaluation criteria clear so interview rounds stay aligned.",
    icon: FiCheckCircle,
  },
  {
    title: "Team Collaboration",
    desc: "Share candidate context and notes across the hiring team cleanly.",
    icon: FiUsers,
  },
];

export default function RecruitersLandingPage() {
  return (
    <main className="bg-[#030712] text-white">
      <Navbar />

      <section className="relative flex min-h-[86vh] items-center bg-[url('/mainpagepic.png')] bg-cover bg-center px-6 pt-24 md:px-20">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.82)_18%,rgba(3,7,18,0.56)_58%,rgba(3,7,18,0.4)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[#0a1226]/35 backdrop-brightness-75" />

        <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/15 bg-[#081228]/45 p-6 backdrop-blur-[2px] md:p-8">
          <p className="text-sm font-medium uppercase tracking-wider text-[#8db5ff]">For Recruiters</p>
          <h1 className="mb-5 mt-2 text-4xl font-bold leading-tight text-white md:text-6xl">
            Hire with clarity.
          </h1>
          <p className="mb-8 max-w-xl text-base leading-relaxed text-[#c6d1ea] md:text-lg">
            Keep screening consistent, reduce noise, and move candidates through your pipeline with confidence — without losing the modern, clean experience.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/auth"
              prefetch
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white shadow-[0_10px_30px_rgba(59,130,246,0.35)]"
            >
              Start as Recruiter <FiArrowRight />
            </Link>
            <Link
              href="/students"
              prefetch
              className="rounded-lg border border-blue-400/70 px-6 py-3 text-white transition hover:bg-blue-500/10"
            >
              I’m a Student
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-12" aria-labelledby="recruiter-features-heading">
        <div className="mb-8 text-center">
          <h2 id="recruiter-features-heading" className="text-2xl font-semibold text-white md:text-3xl">
            A tighter hiring workflow
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#98a7cb] md:text-base">
            Bring structure to early evaluation while keeping the experience simple and fast.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recruiterHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(7,20,43,0.95)_0%,rgba(11,23,48,0.65)_100%)] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10">
                  <Icon className="text-blue-200" size={22} />
                </div>
                <p className="text-lg font-semibold text-blue-200">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#aab8d8]">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href="/auth"
            prefetch
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#227dff] to-[#332989] px-6 py-3 text-base font-medium text-white shadow-[0_10px_30px_rgba(39,131,255,0.25)] focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Create Recruiter Account <FiArrowRight className="ml-2" />
          </Link>
          <Link
            href="/about-echohire"
            prefetch
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-base font-medium text-[#dbe7ff] transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            See How It Works <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </main>
  );
}

