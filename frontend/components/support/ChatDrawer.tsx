"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiX, FiMessageSquare, FiPaperclip } from "react-icons/fi";
import { useTicketSocket } from "@/hooks/useTicketSocket";

type ChatDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userRole: "candidate" | "recruiter";
  ticketId?: string;
};

export default function ChatDrawer({ isOpen, onClose, userId, userRole, ticketId = "default-ticket" }: ChatDrawerProps) {
  const { messages, status, sendMessage } = useTicketSocket(ticketId);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const success = sendMessage(inputValue, userId, userRole, { 
      userName: userRole === "candidate" ? "Candidate User" : "Recruiter User",
      subject: "Inquiry from Platform"
    });
    if (success) {
      setInputValue("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[101] h-full w-full max-w-md border-l border-white/10 bg-surface-1 flex flex-col"
          >
            {/* Header */}
            <header className="flex h-20 items-center justify-between border-b border-white/10 px-6 bg-surface-2">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FiMessageSquare size={20} />
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface-2 ${status === "connected" ? "bg-emerald-500" : "bg-slate-500"}`} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Support Chat</h3>
                  <p className="text-xs text-text-muted">
                    {status === "connected" ? "Online" : "Connecting..."}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="rounded-xl p-2 text-text-muted hover:bg-white/5 hover:text-white transition-colors">
                <FiX size={20} />
              </button>
            </header>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 max-w-[280px]">
                    <p className="text-sm text-text-muted">No messages yet. How can we help you today?</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = msg.senderId === userId;
                  return (
                    <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] space-y-1`}>
                        <div 
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            isMe 
                              ? "bg-primary text-white" 
                              : "bg-surface-2 border border-white/10 text-white"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <p className={`text-[10px] font-medium uppercase tracking-wider text-text-muted ${isMe ? "text-right" : "text-left"}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Area */}
            <footer className="border-t border-white/10 p-6 bg-surface-2">
              <div className="flex items-center gap-3">
                <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-text-muted hover:bg-white/5 transition-colors">
                  <FiPaperclip size={18} />
                </button>
                <div className="relative flex-1">
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="h-11 w-full rounded-xl border border-white/10 bg-surface-1 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 transition-all"
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white transition-all hover:bg-primary-hover active:scale-90"
                  >
                    <FiSend size={16} />
                  </button>
                </div>
              </div>
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
