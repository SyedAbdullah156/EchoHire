"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeadphones, FiMessageSquare, FiX, FiCpu, FiUser } from "react-icons/fi";
import EchoBot from "@/components/EchoBot";
import SupportChat from "@/components/support/SupportChat";
import { useAuth } from "@/context/AuthContext";

export default function UnifiedChatLauncher() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [echoBotOpen, setEchoBotOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const chatContext = useMemo(() => {
    if (pathname.startsWith("/candidate")) {
      return { show: true, role: "candidate" as const, userId: user?.id || "anon-candidate" };
    }
    if (pathname.startsWith("/recruiter")) {
      return { show: true, role: "recruiter" as const, userId: user?.id || "anon-recruiter" };
    }
    return { show: false, role: "candidate" as const, userId: "anon" };
  }, [pathname, user]);

  if (!chatContext.show) return null;

  return (
    <>
      <EchoBot showLauncher={false} isOpen={echoBotOpen} onOpenChange={setEchoBotOpen} />
      <SupportChat
        userId={chatContext.userId}
        userRole={chatContext.role}
        showLauncher={false}
        isOpen={supportOpen}
        onOpenChange={setSupportOpen}
      />

      <div className="fixed bottom-5 right-5 z-[120]">
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" }}
              className="mb-4 flex flex-col gap-3 rounded-[2rem] border border-white/10 bg-[#0d162a]/90 p-3 backdrop-blur-2xl shadow-2xl shadow-black/50"
            >
              <div className="px-3 py-2 border-b border-white/5 mb-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">How can we help?</p>
              </div>

              <button
                onClick={() => {
                  setEchoBotOpen(true);
                  setSupportOpen(false);
                  setMenuOpen(false);
                }}
                className="group flex w-[240px] items-center gap-4 rounded-2xl p-4 text-left transition-all hover:bg-blue-600/10 border border-transparent hover:border-blue-500/30"
              >
                <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiCpu size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none">AI Career Coach</p>
                  <p className="mt-1 text-[10px] text-slate-500 font-medium uppercase tracking-wider">Instant Guidance</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setSupportOpen(true);
                  setEchoBotOpen(false);
                  setMenuOpen(false);
                }}
                className="group flex w-[240px] items-center gap-4 rounded-2xl p-4 text-left transition-all hover:bg-emerald-600/10 border border-transparent hover:border-emerald-500/30"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiUser size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none">Live Support</p>
                  <p className="mt-1 text-[10px] text-slate-500 font-medium uppercase tracking-wider">Talk to a Human</p>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setMenuOpen((v) => !v)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex h-[64px] w-[64px] items-center justify-center rounded-full bg-gradient-to-br transition-all duration-500 shadow-2xl ${
            menuOpen 
              ? "from-slate-800 to-slate-900 border border-white/10" 
              : "from-[#227dff] to-[#332989] shadow-[#227dff]/30"
          }`}
          aria-label="Open chat options"
        >
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                <FiX className="h-6 w-6 text-white" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
                <FiMessageSquare className="h-6 w-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
