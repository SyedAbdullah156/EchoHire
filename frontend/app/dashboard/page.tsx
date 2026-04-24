import Navbar from "@/components/Navbar";
import {
  FiBarChart2,
  FiBookOpen,
  FiFileText,
  FiGrid,
  FiHelpCircle,
  FiLogOut,
  FiPieChart,
  FiSettings,
  FiUser,
} from "react-icons/fi";

const sidebarItems = [
  { label: "Dashboard", icon: FiGrid, active: true },
  { label: "AI Interview", icon: FiBookOpen },
  { label: "Resume Analyzer", icon: FiFileText },
  { label: "Linkedin Optimization", icon: FiBarChart2 },
  { label: "Exam & Quizzes", icon: FiBookOpen },
  { label: "Progress", icon: FiPieChart },
];

const profileItems = [
  { label: "Profile", icon: FiUser },
  { label: "Settings", icon: FiSettings },
  { label: "Logout", icon: FiLogOut },
  { label: "Help & Support", icon: FiHelpCircle },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#eef0f5]">
      <Navbar />
      <section className="mx-auto flex max-w-[1500px] gap-5 px-4 pb-6 pt-24">
        <aside className="w-[310px] rounded-md bg-[#14161c] p-5 text-[#d2d9ea] shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
          <h2 className="mb-8 text-[40px] font-bold text-[#3390ff]">EchoHire</h2>
          <nav className="space-y-2">
            {sidebarItems.map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[27px] ${
                  active
                    ? "bg-gradient-to-r from-[#2a7df7] to-[#332b8c] text-white"
                    : "text-[#aeb7cc] hover:bg-[#1f2330]"
                }`}
              >
                <Icon />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-14 space-y-2 border-t border-white/10 pt-6">
            {profileItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[25px] text-[#aeb7cc] hover:bg-[#1f2330]"
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 space-y-4 rounded-md">
          <header className="rounded-2xl bg-white p-5 shadow-sm">
            <h1 className="text-[44px] font-semibold text-[#141a29]">
              Welcome Back, Uzair Ahmad
            </h1>
            <p className="text-[24px] text-[#74809a]">
              Explore your Interviews and keep progressing today
            </p>
          </header>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-[24px] font-semibold text-[#151a2c]">Recent Interview</p>
              <p className="mt-4 text-[30px] text-[#6f7b94]">Google Senior Software Engineer</p>
              <p className="text-[23px] text-[#7e889f]">Date: Sep 5th | Time: 2PM</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-[24px] font-semibold text-[#151a2c]">LinkedIn Visibility</p>
              <p className="mt-3 text-[66px] text-[#111827]">82 / 100</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-[24px] font-semibold text-[#151a2c]">Resume Score</p>
              <p className="mt-3 text-[66px] text-[#111827]">92 / 100</p>
            </div>
          </div>

          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-[40px] font-semibold text-[#151a2c]">Interview Progress</p>
              <p className="mb-4 text-[24px] text-[#77839b]">
                Track all ongoing and completed interviews
              </p>
              <svg viewBox="0 0 700 280" className="h-[280px] w-full rounded-lg bg-[#f2f6fc]">
                <polyline
                  fill="none"
                  stroke="#2c86d0"
                  strokeWidth="5"
                  points="20,110 90,150 160,125 230,140 300,35 370,190 440,70 510,180 580,195 650,115 690,170"
                />
              </svg>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-[38px] font-semibold text-[#151a2c]">Skill Mastery</p>
                <p className="mb-4 text-[24px] text-[#77839b]">Track your progress and skills</p>
                {[
                  ["Coding", "90%"],
                  ["Design", "72%"],
                  ["Behavioral", "58%"],
                  ["Technical", "66%"],
                ].map(([label, width]) => (
                  <div key={label} className="mb-3">
                    <p className="mb-1 text-[24px] text-[#253047]">{label}</p>
                    <div className="h-3 rounded-full bg-[#e4ecf8]">
                      <div className="h-3 rounded-full bg-[#6ea8da]" style={{ width }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="mb-3 text-[34px] font-semibold text-[#151a2c]">Daily Challenges</p>
                <ul className="space-y-2 text-[25px] text-[#202b42]">
                  <li>
                    <strong>Coding Challenge:</strong> Implement a Hash Map
                  </li>
                  <li>
                    <strong>Resume Improvement:</strong> Add another project section
                  </li>
                  <li>
                    <strong>Coding Challenge:</strong> Implement a URL Shortner
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
