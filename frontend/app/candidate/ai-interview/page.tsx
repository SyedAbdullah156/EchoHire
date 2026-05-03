"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { 
  FiMic, FiMicOff, FiPhoneOff, FiSend, 
  FiVideo, FiVideoOff, FiAlertCircle 
} from "react-icons/fi";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import InterviewLobby from "@/components/interview/InterviewLobby";
import RoundFeedback from "@/components/interview/RoundFeedback";

function InterviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("id");
  const roundIndex = parseInt(searchParams.get("round") || "0");

  const [view, setView] = useState<"lobby" | "active" | "results">("lobby");
  const [chatMessage, setChatMessage] = useState("");
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [roundData, setRoundData] = useState<any>(null);
  const [totalRounds, setTotalRounds] = useState(3);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);

  // AI Voice Synthesis
  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (view === "active" && currentQuestion && !isSubmitting) {
      speak(currentQuestion);
    }
  }, [currentQuestion, view, isSubmitting]);

  // Initial Sync Logic
  useEffect(() => {
    if (!interviewId) {
      toast.error("Invalid session ID.");
      return;
    }

    async function checkState() {
      try {
        const res = await fetch(`/api/ai-interview/${interviewId}/rounds/${roundIndex}`);
        const result = await res.json();
        if (res.ok) {
          const round = result.data.round;
          setRoundData(round);
          setTotalRounds(result.data.interview.rounds.length);
          
          if (round.status === "completed") {
            setView("results");
          } else if (round.qa_pairs.length > 0) {
            setCurrentQuestion(round.qa_pairs[round.qa_pairs.length - 1].question);
            setQaHistory(round.qa_pairs);
            setView("active");
          }
        } else {
          toast.error("Could not sync interview data.");
        }
      } catch (e) {
        console.error("Sync error", e);
        toast.error("Connection lost. Retrying sync...");
      } finally {
        setLoading(false);
      }
    }
    checkState();
  }, [interviewId, roundIndex]);

  // Handle Start Round
  const handleStartRound = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ai-interview/${interviewId}/rounds/${roundIndex}/start`, {
        method: "POST"
      });
      const result = await res.json();
      if (res.ok) {
        setRoundData(result.data.round);
        setCurrentQuestion(result.data.round.qa_pairs[0].question);
        setQaHistory(result.data.round.qa_pairs);
        setView("active");
      } else {
        toast.error(result.message || "Failed to start round.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Answer
  const handleSendResponse = async () => {
    if (!chatMessage.trim()) return;
    setIsSubmitting(true);
    if (isRecording) recognitionRef.current?.stop();

    try {
      const res = await fetch(`/api/ai-interview/${interviewId}/rounds/${roundIndex}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: chatMessage.trim() }),
      });

      const result = await res.json();
      if (res.ok) {
        const round = result.data.round;
        setRoundData(round);
        if (round.status === "completed") {
          setView("results");
        } else {
          setCurrentQuestion(round.qa_pairs[round.qa_pairs.length - 1].question);
          setQaHistory(round.qa_pairs);
          setChatMessage("");
        }
      }
    } catch {
      toast.error("Sync failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Camera Management (Active View)
  useEffect(() => {
    if (view === "active" && !isVideoOff) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(s => {
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      });
    } else {
      stream?.getTracks().forEach(t => t.stop());
    }
    return () => stream?.getTracks().forEach(t => t.stop());
  }, [view, isVideoOff]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;
      const rec = new SpeechRecognition();
      rec.onresult = (e: any) => setChatMessage(e.results[0][0].transcript);
      rec.onend = () => setIsRecording(false);
      rec.start();
      recognitionRef.current = rec;
      setIsRecording(true);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-text-muted">Synchronizing Session...</p>
      </div>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {view === "lobby" && (
        <motion.div key="lobby" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <InterviewLobby onStart={handleStartRound} />
        </motion.div>
      )}

      {view === "results" && (
        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <RoundFeedback 
            roundIndex={roundIndex}
            result={roundData}
            isLastRound={roundIndex >= totalRounds - 1}
            onNext={() => router.push(`/candidate/ai-interview?id=${interviewId}&round=${roundIndex + 1}`)}
            onFinish={() => router.push("/candidate/dashboard")}
          />
        </motion.div>
      )}

      {view === "active" && (
        <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Header */}
          <header className="flex items-center justify-between p-6 rounded-3xl bg-surface-1/40 border border-white/5 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Live Round {roundIndex + 1}
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">Technical Assessment</h1>
            </div>
            <div className="flex items-center gap-4 text-right">
               <div className="border-r border-white/10 pr-4">
                 <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Progress</p>
                 <p className="text-sm font-mono text-white">{qaHistory.length} / {roundData?.max_questions || 5}</p>
               </div>
               <button onClick={() => setShowEndConfirm(true)} className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all">
                  <FiPhoneOff />
               </button>
            </div>
          </header>

          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 bg-black shadow-2xl">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                {isVideoOff && (
                  <div className="absolute inset-0 bg-surface-1 flex items-center justify-center">
                    <FiVideoOff className="text-4xl text-text-muted" />
                  </div>
                )}
                {/* HUD Controls */}
                <div className="absolute bottom-6 left-6 flex gap-2">
                   <button onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-xl ${isMuted ? 'bg-red-500 text-white' : 'bg-black/40 text-white backdrop-blur-md'}`}>
                      {isMuted ? <FiMicOff /> : <FiMic />}
                   </button>
                   <button onClick={() => setIsVideoOff(!isVideoOff)} className={`p-3 rounded-xl ${isVideoOff ? 'bg-red-500 text-white' : 'bg-black/40 text-white backdrop-blur-md'}`}>
                      {isVideoOff ? <FiVideoOff /> : <FiVideo />}
                   </button>
                </div>
              </div>

              <div className="p-10 rounded-[2.5rem] bg-surface-1/40 border border-primary/10 relative overflow-hidden">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Interviewer Question</p>
                <p className="text-2xl font-bold text-white leading-relaxed tracking-tight">"{currentQuestion}"</p>
                {isSubmitting && (
                   <div className="mt-4 flex gap-1">
                     {[0,1,2].map(i => <motion.div key={i} animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: i*0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary" />)}
                   </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
               <div className="flex-1 p-6 rounded-[2.5rem] bg-surface-1/40 border border-white/5 overflow-y-auto space-y-4">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest px-2">Conversation</h3>
                  {qaHistory.map((q, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                       <p className="text-[9px] font-black text-primary uppercase">Question {i+1}</p>
                       <p className="text-xs text-text-secondary leading-relaxed">{q.question}</p>
                    </div>
                  ))}
               </div>

               <div className="p-6 rounded-[2.5rem] bg-surface-1/40 border border-white/5 space-y-4">
                  <textarea
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full h-32 bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-xs text-white outline-none focus:border-primary/40 transition-all resize-none disabled:opacity-50"
                    placeholder="Provide your answer..."
                  />
                  <div className="flex gap-2">
                    <button onClick={toggleRecording} className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl ${isRecording ? "bg-red-600 text-white" : "bg-surface-2 text-text-muted"}`}>
                      {isRecording ? <FiMicOff /> : <FiMic />}
                    </button>
                    <button 
                      onClick={handleSendResponse}
                      disabled={isSubmitting || !chatMessage.trim()}
                      className="flex-[3] py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:bg-primary-hover disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          Processing <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                        </div>
                      ) : <span className="flex items-center justify-center gap-2">Submit <FiSend /></span>}
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      )}

      {showEndConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
          <div className="max-w-sm w-full p-10 rounded-[3rem] bg-surface-1 border border-white/10 text-center space-y-6">
            <FiAlertCircle className="text-4xl text-red-500 mx-auto" />
            <h3 className="text-xl font-bold text-white">Exit Interview?</h3>
            <p className="text-xs text-text-muted">Your progress for this round will be saved, but the session will end.</p>
            <div className="grid gap-3">
              <button onClick={() => router.push("/candidate/dashboard")} className="w-full py-4 rounded-2xl bg-red-600 text-white font-bold uppercase tracking-widest">Confirm Exit</button>
              <button onClick={() => setShowEndConfirm(false)} className="w-full py-4 rounded-2xl bg-surface-2 text-white font-bold uppercase tracking-widest">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function AIInterviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InterviewContent />
    </Suspense>
  );
}