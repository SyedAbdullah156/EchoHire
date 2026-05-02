"use client";

import { useState, useEffect, useRef } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { 
  FiMic, FiMicOff, FiMonitor, FiPhoneOff, FiSend, 
  FiVideo, FiVideoOff, FiLayers, FiMessageSquare, FiAlertCircle 
} from "react-icons/fi";
import { toast } from "sonner";

const questions = [
  "Tell me about yourself and your recent work.",
  "Describe a time you optimized a slow API.",
  "How would you design a scalable chat service?",
  "What trade-offs exist between SQL and NoSQL?",
];

export default function AIInterviewPage() {
  const [chatMessage, setChatMessage] = useState("");
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // HCI Principle: Visibility of System Status & Error Prevention
  // Explicitly managing the stream life-cycle prevents "ghost" camera usage
  useEffect(() => {
    async function setupCamera() {
      try {
        if (!isVideoOff) {
          const newStream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720 }, 
            audio: true 
          });
          setStream(newStream);
          if (videoRef.current) videoRef.current.srcObject = newStream;
        } else {
          stream?.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      } catch (err) {
        setIsVideoOff(true);
        toast.error("Camera access denied. Please check system permissions.");
      }
    }
    setupCamera();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [isVideoOff]);

  const handleSendResponse = () => {
    if (!chatMessage.trim()) return toast.error("Please enter a response.");
    toast.success("Response sent to AI Interviewer.");
    setChatMessage("");
  };

  return (
    <div className="space-y-6">
          {/* Header: Context & Status */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-slate-800/60 bg-[#0f172a]/40 p-6 backdrop-blur-md">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Active Interview
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Senior Software Engineer Role</h1>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block border-r border-slate-800 pr-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time Elapsed</p>
                  <p className="text-sm font-mono text-blue-400">14:02 / 45:00</p>
               </div>
               <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg text-[10px] font-black text-blue-400 uppercase tracking-widest">
                  Adaptive AI
               </div>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left: The "Stage" */}
            <div className="lg:col-span-8 space-y-6">
              {/* Camera Stage */}
              <div className="relative group aspect-video overflow-hidden rounded-[2.5rem] border border-slate-800 bg-[#020617] shadow-2xl">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className={`h-full w-full object-cover transition-opacity duration-1000 ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
                />
                
                {/* HCI: Feedback for Disabled State */}
                {isVideoOff && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                    <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center mb-4 border border-slate-700">
                        <FiVideoOff className="text-3xl text-slate-500" />
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Camera Disabled</p>
                  </div>
                )}

                {/* AI Persona (Picture-in-Picture feel) */}
                <div className="absolute top-6 right-6 w-40 aspect-video rounded-2xl border border-white/5 bg-slate-950/80 backdrop-blur-md overflow-hidden shadow-2xl">
                   <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600/10 to-indigo-600/10">
                      <div className="flex gap-1 mb-2">
                        <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce" />
                        <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <p className="text-[8px] font-black text-blue-400 uppercase tracking-[0.2em]">AI Listening</p>
                   </div>
                </div>

                {/* Floating HUD Controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/5 bg-slate-950/60 backdrop-blur-xl shadow-2xl opacity-90 hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setIsMuted(!isMuted); toast.info(isMuted ? "Mic On" : "Mic Muted"); }}
                    className={`p-3 rounded-xl transition-all ${isMuted ? 'bg-rose-500/20 text-rose-500' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'}`}
                  >
                    {isMuted ? <FiMicOff size={18} /> : <FiMic size={18} />}
                  </button>
                  <button 
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-3 rounded-xl transition-all ${isVideoOff ? 'bg-rose-500/20 text-rose-500' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'}`}
                  >
                    {isVideoOff ? <FiVideoOff size={18} /> : <FiVideo size={18} />}
                  </button>
                  <button 
                    onClick={() => setIsSharing(!isSharing)}
                    className={`p-3 rounded-xl transition-all ${isSharing ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'}`}
                  >
                    <FiMonitor size={18} />
                  </button>
                  <div className="w-px h-6 bg-slate-800 mx-1" />
                  <button 
                    onClick={() => setShowEndConfirm(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] uppercase tracking-widest transition-all"
                  >
                    <FiPhoneOff /> Leave
                  </button>
                </div>
              </div>

              {/* Prompt Card: HCI Focus on Clarity */}
              <div className="rounded-[2.5rem] border border-blue-500/10 bg-[#0f172a]/40 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
                  <FiMessageSquare size={120} />
                </div>
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Prompt</h4>
                <p className="text-xl md:text-2xl font-bold text-white leading-relaxed tracking-tight">
                  "How do you handle production incidents under high pressure while maintaining team morale?"
                </p>
              </div>
            </div>

            {/* Right: Interaction & Progress */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-[2.5rem] border border-slate-800 bg-[#0f172a]/40 p-6">
                <div className="flex items-center gap-3 mb-6 px-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <FiLayers size={16} />
                  </div>
                  <h3 className="font-bold text-white text-sm">Question Path</h3>
                </div>
                <div className="space-y-2">
                  {questions.map((q, i) => (
                    <div key={i} className="group p-4 rounded-2xl bg-slate-900/30 border border-slate-800/50 hover:border-slate-700 transition-all">
                      <div className="flex items-start gap-3">
                        <span className="text-[10px] font-mono font-bold text-slate-600 mt-1">0{i+1}</span>
                        <p className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed">{q}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fallback Input */}
              <div className="rounded-[2.5rem] border border-slate-800 bg-[#0f172a]/40 p-6">
                <h3 className="font-bold text-white text-sm mb-4 px-2">Text Response</h3>
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full h-32 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 outline-none focus:border-blue-500/40 transition-all resize-none placeholder:text-slate-600"
                  placeholder="Describe your approach here..."
                />
                <button 
                  onClick={handleSendResponse}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-900/10"
                >
                  <FiSend /> Submit Answer
                </button>
              </div>
            </div>
          </div>
      {/* Confirmation Overlay: HCI Aesthetic & Minimalist Design */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
          <div className="relative w-full max-w-sm rounded-[3rem] border border-slate-800 bg-[#0f172a] p-10 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 mx-auto">
              <FiAlertCircle className="text-2xl text-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">End Session?</h3>
            <p className="text-xs text-slate-400 mb-8 leading-relaxed">
              Are you sure you want to exit? Your current interview progress will be saved as a draft.
            </p>
            <div className="grid gap-3">
              <button
                onClick={() => { setShowEndConfirm(false); toast.info("Session Concluded."); }}
                className="w-full py-4 rounded-2xl bg-rose-600 font-black text-[10px] uppercase tracking-widest text-white hover:bg-rose-500 transition-all"
              >
                Confirm Exit
              </button>
              <button
                onClick={() => setShowEndConfirm(false)}
                className="w-full py-4 rounded-2xl bg-slate-800 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-white transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}