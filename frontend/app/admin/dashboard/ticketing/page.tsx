"use client";

import { useState, useMemo } from "react";
import { 
  FiMessageSquare, 
  FiSearch,
  FiSend,
  FiMoreVertical
} from "react-icons/fi";
import { useTicketSocket } from "@/hooks/useTicketSocket";

type TicketStatus = "all" | "open" | "closed";

export default function AdminTicketingDashboard() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TicketStatus>("all");
  
  // Use socket for the selected ticket AND the global ticket queue
  const { messages, ticketList, sendMessage } = useTicketSocket(selectedTicketId || undefined, "admin");
  const [inputValue, setInputValue] = useState("");

  const selectedTicket = useMemo(() => 
    ticketList.find(t => t.id === selectedTicketId),
    [selectedTicketId, ticketList]
  );

  const filteredTickets = useMemo(() => {
    return ticketList.filter(t => {
      const matchesSearch = t.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "all" || t.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab, ticketList]);

  const handleSend = () => {
    if (!inputValue.trim() || !selectedTicketId) return;
    const success = sendMessage(inputValue, "admin-001", "admin");
    if (success) setInputValue("");
  };

  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden rounded-[2rem] border border-white/10 bg-surface-1">
      
      {/* --- Left Pane: Ticket Queue --- */}
      <aside className="w-80 flex flex-col border-r border-white/10 bg-surface-2/30">
        <header className="p-6 border-b border-white/10 space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Support Queue</h2>
          
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              className="w-full h-10 rounded-xl bg-surface-1 border border-white/5 pl-9 pr-4 text-xs text-white placeholder:text-slate-500 outline-none focus:border-primary/50 transition-all"
            />
          </div>

          <div className="flex gap-2 p-1 rounded-xl bg-surface-1 border border-white/5">
            {(["all", "open", "closed"] as TicketStatus[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                  activeTab === tab ? "bg-primary text-white" : "text-text-muted hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {filteredTickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => setSelectedTicketId(ticket.id)}
              className={`relative w-full text-left p-4 rounded-2xl transition-all group ${
                selectedTicketId === ticket.id 
                  ? "bg-primary/10 border border-primary/20" 
                  : "hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <div className="text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border border-blue-500/30 text-blue-400 bg-blue-500/5">
                    USER
                  </div>
                </div>
                <span className="text-[10px] font-medium text-slate-500">
                  {new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <h4 className="text-sm truncate pr-4 text-slate-200">
                {ticket.userName}
              </h4>
              <p className="text-xs text-text-muted truncate mt-0.5">{ticket.subject}</p>
            </button>
          ))}
        </div>
      </aside>

      {/* --- Right Pane: Active Chat --- */}
      <main className="flex-1 flex flex-col bg-surface-1">
        {selectedTicket ? (
          <>
            {/* Chat Header */}
            <header className="h-20 flex items-center justify-between px-8 border-b border-white/10 bg-surface-2/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center font-black text-white text-xs">
                  {selectedTicket.userName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white leading-none">{selectedTicket.userName}</h3>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active Now
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">Ticket {selectedTicket.id} • {selectedTicket.subject}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="h-10 px-4 rounded-xl border border-white/10 text-xs font-bold text-white hover:bg-white/5 transition-all">
                  Resolve Ticket
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 text-text-muted hover:text-white hover:bg-white/5 transition-all">
                  <FiMoreVertical />
                </button>
              </div>
            </header>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
               <div className="flex justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    Conversation Started
                  </span>
               </div>

               {messages.map((msg, i) => {
                  const isAdmin = msg.senderRole === "admin";
                  return (
                    <div key={i} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                      <div className="flex flex-col gap-1.5 max-w-[70%]">
                        <div className={`rounded-[1.5rem] px-5 py-3 text-sm leading-relaxed ${
                          isAdmin 
                            ? "bg-primary text-white font-medium" 
                            : "bg-surface-2 border border-white/10 text-slate-200"
                        }`}>
                          {msg.content}
                        </div>
                        <span className={`text-[10px] font-medium text-slate-500 uppercase tracking-widest ${isAdmin ? "text-right mr-2" : "ml-2"}`}>
                          {isAdmin ? "Support Agent" : selectedTicket.userName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
               })}
            </div>

            {/* Message Input */}
            <footer className="p-8 border-t border-white/10 bg-surface-2/20">
              <div className="relative max-w-4xl mx-auto flex items-center gap-4">
                <div className="relative flex-1">
                  <input 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={`Reply to ${selectedTicket.userName}...`}
                    className="h-14 w-full rounded-2xl bg-surface-1 border border-white/10 pl-6 pr-16 text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 transition-all"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-2">
                    <button 
                      onClick={handleSend}
                      className="h-10 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-primary/20"
                    >
                      <FiSend />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 mb-6">
              <FiMessageSquare size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Ticket Selected</h3>
            <p className="text-text-muted max-w-xs">Select a ticket from the sidebar to start responding to users.</p>
          </div>
        )}
      </main>
    </div>
  );
}
