import Link from "next/link";
import { 
  ShieldCheck, 
  BellRing, 
  User, 
  ArrowLeft, 
  Save, 
  AlertTriangle,
  ChevronRight 
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Top Navigation Bar - User Control and Freedom */}
      <div className="flex items-center justify-between">
        <Link 
          href="/candidate/dashboard" 
          className="group flex items-center gap-2 text-sm font-medium text-[#9fb1d8] hover:text-white transition-all"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          Return to Dashboard
        </Link>
            <div className="flex items-center gap-2 text-xs font-mono text-[#4a5d89]">
              <span>SERVER STATUS:</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-500">OPERATIONAL</span>
            </div>
          </div>

          <header>
            <h1 className="text-5xl font-extrabold tracking-tight text-white">Settings</h1>
            <p className="mt-3 text-lg text-[#9fb1d8] max-w-2xl">
              Configure your workspace, security protocols, and how you receive intelligence updates.
            </p>
          </header>

          <div className="grid gap-6">
            {/* Account Section - Consistency & Standards */}
            <section className="group rounded-3xl border border-[#243253] bg-[#0d162a]/80 p-8 backdrop-blur-md transition-all hover:border-[#32466f]">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Profile Identity</h2>
                  <p className="text-sm text-[#9fb1d8]">Managed your public presence and account details.</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#050b18] border border-[#243253]">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                    <div>
                        <p className="font-semibold text-white">Hassan Ali</p>
                        <p className="text-xs text-[#9fb1d8]">{"CS Student @ FAST'27"}</p>
                    </div>
                 </div>
                 <button className="text-sm font-medium text-blue-400 hover:underline">Edit Profile</button>
              </div>
            </section>

            {/* Security Grid - Recognition over Recall */}
            <div className="grid gap-6 md:grid-cols-2">
                <section className="rounded-3xl border border-[#243253] bg-[#0d162a] p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <ShieldCheck className="text-emerald-400" size={24} />
                        <h3 className="text-xl font-bold">Security Status</h3>
                    </div>
                    <div className="space-y-4">
                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0a1223] border border-[#32466f] hover:border-blue-500 transition-all group">
                            <span className="text-sm">Multi-Factor Auth</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">ACTIVE</span>
                                <ChevronRight size={16} className="text-[#4a5d89] group-hover:text-white" />
                            </div>
                        </button>
                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0a1223] border border-[#32466f] hover:border-blue-500 transition-all group">
                            <span className="text-sm">Update Password</span>
                            <ChevronRight size={16} className="text-[#4a5d89] group-hover:text-white" />
                        </button>
                    </div>
                </section>

                <section className="rounded-3xl border border-[#243253] bg-[#0d162a] p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <BellRing className="text-orange-400" size={24} />
                        <h3 className="text-xl font-bold">System Alerts</h3>
                    </div>
                    <div className="space-y-3">
                        {['Email Updates', 'Push Notifications'].map((text) => (
                            <label key={text} className="flex items-center justify-between cursor-pointer group">
                                <span className="text-sm text-[#9fb1d8] group-hover:text-white transition-colors">{text}</span>
                                <div className="relative inline-flex items-center">
                                    <input type="checkbox" className="peer sr-only" defaultChecked />
                                    <div className="h-5 w-10 rounded-full bg-[#1e293b] peer-checked:bg-blue-600 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5"></div>
                                </div>
                            </label>
                        ))}
                    </div>
                </section>
            </div>

            {/* Danger Zone - Error Prevention */}
            <section className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
              <div className="flex items-center gap-3 mb-4 text-red-400">
                <AlertTriangle size={20} />
                <h3 className="font-bold uppercase tracking-widest text-sm">Danger Zone</h3>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-sm text-red-200/60">Deleting your account will permanently erase all projects and data. This action is irreversible.</p>
                <button className="whitespace-nowrap rounded-xl bg-red-500/10 border border-red-500/50 px-6 py-2 text-sm font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all">
                  Delete Account
                </button>
              </div>
            </section>
          </div>

          {/* Persistent Action Bar - Aesthetic & Minimalist */}
          <div className="sticky bottom-6 flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d162a]/60 p-4 shadow-2xl backdrop-blur-xl">
            <p className="text-sm text-[#9fb1d8]">Your changes are cached locally.</p>
            <div className="flex gap-4">
                <button className="px-6 py-2 text-sm font-medium text-[#9fb1d8] hover:text-white transition-colors">Discard</button>
                <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-bold text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all active:scale-95">
                    <Save size={18} />
                    Save Configuration
                </button>
            </div>
          </div>
    </div>
  );
}