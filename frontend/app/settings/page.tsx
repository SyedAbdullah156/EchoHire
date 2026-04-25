import Link from "next/link";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <Navbar />
      <section className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 pb-12 pt-28 lg:flex-row md:px-6">
        <DashboardSidebar active="settings" />
        <div className="flex-1">
        <header className="mb-5 rounded-2xl border border-[#243253] bg-[#0d162a] p-5">
          <h1 className="text-4xl font-semibold text-[#dbe7ff]">Account Settings</h1>
          <p className="mt-1 text-base text-[#9fb1d8]">Control security, notifications, and preferences.</p>
        </header>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#243253] bg-[#0d162a] p-5">
            <h2 className="text-xl font-semibold text-[#dbe7ff]">Security</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <button type="button" className="rounded-lg border border-[#32466f] bg-[#0a1223] px-4 py-2 text-left text-sm text-[#dbe7ff]">
                Change Password
              </button>
              <button type="button" className="rounded-lg border border-[#32466f] bg-[#0a1223] px-4 py-2 text-left text-sm text-[#dbe7ff]">
                Enable 2FA
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#243253] bg-[#0d162a] p-5">
            <h2 className="text-xl font-semibold text-[#dbe7ff]">Notifications</h2>
            <div className="mt-3 space-y-2 text-sm text-[#c3d0ed]">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                Interview reminders
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                Weekly progress summary
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Product announcements
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" className="rounded-lg bg-gradient-to-r from-[#2a7df7] to-[#372e8f] px-4 py-2 text-sm font-medium">
              Save Preferences
            </button>
            <Link href="/dashboard" className="rounded-lg border border-[#32466f] px-4 py-2 text-sm text-[#dbe7ff]">
              Back to Dashboard
            </Link>
          </div>
        </div>
        </div>
      </section>
    </main>
  );
}
