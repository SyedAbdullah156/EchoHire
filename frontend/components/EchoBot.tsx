"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiX, FiSend, FiLoader, FiRefreshCw } from "react-icons/fi";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

// ─── Markdown-ish renderer (lightweight, no library needed) ────────────────────

function renderText(text: string) {
  // Convert **bold**, *italic*, bullet lists, and newlines to JSX
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      return (
        <li key={i} className="ml-4 list-disc">
          {formatInline(trimmed.slice(2))}
        </li>
      );
    }
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      return (
        <p key={i} className="font-semibold text-[#dbe7ff]">
          {trimmed.slice(2, -2)}
        </p>
      );
    }
    if (trimmed === "") {
      return <div key={i} className="h-2" />;
    }
    return <p key={i}>{formatInline(trimmed)}</p>;
  });
}

function formatInline(text: string) {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-[#dbe7ff]">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

// ─── Message Bubble ─────────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#227dff] to-[#332989] text-xs font-bold text-white">
          E
        </div>
      )}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-[#227dff] text-white"
            : "rounded-bl-sm bg-[#0d162a] text-[#bdc9e3] border border-white/5"
        }`}
      >
        {isUser ? (
          <p>{message.text}</p>
        ) : (
          <div className="space-y-0.5">{renderText(message.text)}</div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#227dff] to-[#332989] text-xs font-bold text-white">
        E
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-[#0d162a] border border-white/5 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[#227dff]"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Suggested Prompts ────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  "How do I prepare for a system design interview?",
  "What keywords should I add to my resume?",
  "How do I answer 'Tell me about yourself'?",
  "Tips for negotiating a job offer?",
];

// ─── Main EchoBot Widget ──────────────────────────────────────────────────────

type EchoBotProps = {
  showLauncher?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function EchoBot({ showLauncher = true, isOpen: controlledOpen, onOpenChange }: EchoBotProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen ?? internalOpen;
  const setIsOpen = (open: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(open);
    }
    onOpenChange?.(open);
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      text: "Hey! I'm **EchoBot** 👋\n\nI'm your AI career coach. Ask me anything about interview prep, resumes, LinkedIn, or career advice.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        text: content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const conversationHistory = [...messages, userMessage]
          .filter((m) => m.id !== "welcome")
          .map((m) => ({ role: m.role, text: m.text }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: conversationHistory }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error ?? "Failed to get a response.");
        }

        const modelMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: data.reply,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, modelMessage]);
      } catch (err) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: "Sorry, I ran into an issue. Please try again in a moment.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "model",
        text: "Hey! I'm **EchoBot** 👋\n\nI'm your AI career coach. Ask me anything about interview prep, resumes, LinkedIn, or career advice.",
        timestamp: new Date(),
      },
    ]);
    setInput("");
  };

  const showSuggestions = messages.length === 1;

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-[88px] right-5 z-50 flex w-[360px] flex-col rounded-[1.5rem] border border-white/10 bg-[#070d1a] overflow-hidden"
            style={{ maxHeight: "calc(100vh - 120px)", height: "540px" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/5 bg-[#0d162a] px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#227dff] to-[#332989]">
                <FiMessageSquare className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">EchoBot</p>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <p className="text-xs text-[#7f92be]">AI Career Coach · Online</p>
                </div>
              </div>
              <button
                onClick={resetChat}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7f92be] transition-colors hover:bg-white/5 hover:text-white"
                title="Clear chat"
              >
                <FiRefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7f92be] transition-colors hover:bg-white/5 hover:text-white"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {/* Suggested prompts */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-2 pt-1"
                  >
                    <p className="text-xs text-[#5c6f94] px-1">Suggested questions</p>
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => sendMessage(prompt)}
                        className="rounded-xl border border-white/5 bg-[#0d162a] px-3 py-2.5 text-left text-xs text-[#98a7cb] transition-colors hover:border-[#227dff]/30 hover:bg-[#227dff]/5 hover:text-[#dbe7ff]"
                      >
                        {prompt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/5 bg-[#0d162a] px-4 py-3">
              <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-[#070d1a] px-3 py-2 focus-within:border-[#227dff]/40">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask EchoBot anything…"
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-sm text-[#dbe7ff] placeholder:text-[#5c667f] outline-none max-h-[100px] leading-relaxed"
                  style={{ height: "auto" }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = `${Math.min(target.scrollHeight, 100)}px`;
                  }}
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#227dff] text-white transition-all hover:bg-[#1a68d4] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <FiLoader className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <FiSend className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-[#3d4f6b]">
                Powered by Gemini 2.0 Flash · Press Enter to send
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      {showLauncher && (
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-5 right-5 z-50 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-gradient-to-br from-[#227dff] to-[#332989] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#227dff]"
          aria-label="Open EchoBot chat"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <FiX className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <FiMessageSquare className="h-5 w-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </>
  );
}
