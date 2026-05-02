"use client";

import { useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
import ChatDrawer from "./ChatDrawer";

type SupportChatProps = {
  userId: string;
  userRole: "candidate" | "recruiter";
};

export default function SupportChat({ userId, userRole }: SupportChatProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[90] flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-primary text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
        aria-label="Open support chat"
      >
        <FiMessageCircle size={24} />
      </button>

      <ChatDrawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        userId={userId} 
        userRole={userRole} 
      />
    </>
  );
}
