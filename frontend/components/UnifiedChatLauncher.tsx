"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeadphones, FiMessageSquare, FiX } from "react-icons/fi";
import EchoBot from "@/components/EchoBot";
import SupportChat from "@/components/support/SupportChat";

export default function UnifiedChatLauncher() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [echoBotOpen, setEchoBotOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const chatContext = useMemo(() => {
    if (pathname.startsWith("/candidate")) {
      return { show: true, role: "candidate" as const, userId: "candidate-001" };
    }
    if (pathname.startsWith("/recruiter")) {
      return { show: true, role: "recruiter" as const, userId: "recruiter-001" };
    }
    return { show: false, role: "candidate" as const, userId: "candidate-001" };
  }, [pathname]);

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
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="mb-3 flex flex-col gap-2 rounded-2xl border border-white/10 bg-[#0d162a]/95 p-2 backdrop-blur-xl"
            >
              <button
                onClick={() => {
                  setSupportOpen(true);
                  setEchoBotOpen(false);
                  setMenuOpen(false);
                }}
                className="flex min-w-[190px] items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#dbe7ff] transition-colors hover:bg-white/5"
              >
                <FiHeadphones className="text-emerald-400" />
                Open Support Chat
              </button>
              <button
                onClick={() => {
                  setEchoBotOpen(true);
                  setSupportOpen(false);
                  setMenuOpen(false);
                }}
                className="flex min-w-[190px] items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#dbe7ff] transition-colors hover:bg-white/5"
              >
                <FiMessageSquare className="text-blue-400" />
                Open Chatbot
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setMenuOpen((v) => !v)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-gradient-to-br from-[#227dff] to-[#332989] text-white shadow-xl shadow-[#227dff]/25"
          aria-label="Open chat options"
        >
          {menuOpen ? <FiX className="h-5 w-5" /> : <FiMessageSquare className="h-5 w-5" />}
        </motion.button>
      </div>
    </>
  );
}
