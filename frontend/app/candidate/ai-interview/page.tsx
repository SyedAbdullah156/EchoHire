"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import {
  FiMic, FiMicOff, FiPhoneOff, FiSend,
  FiVideo, FiVideoOff, FiAlertCircle, FiZap
} from "react-icons/fi";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import InterviewLobby from "@/components/interview/InterviewLobby";
import RoundFeedback from "@/components/interview/RoundFeedback";
import CodingSandbox from "@/components/CodingSandbox";
import QuizInterface from "@/components/interview/QuizInterface";

interface TQAPair {
  question: string;
  candidate_answer?: string;
  ai_evaluation?: string;
  timestamp: string | Date;
  metadata?: {
    problem_statement?: string;
    test_cases?: Array<{ input: string; expected: string }>;
    initial_code?: string;
  };
}

interface TInterviewRound {
  type: string;
  status: string;
  qa_pairs: TQAPair[];
  max_questions: number;
  score?: number;
  remarks?: string;
}

interface SpeechRecognitionInstance {
  stop: () => void;
  start: () => void;
  onresult: (e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void;
  onend: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

function InterviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("id");
  const token = searchParams.get("token");
  const roundIndex = parseInt(searchParams.get("round") || "0");

  const [view, setView] = useState<"selection" | "lobby" | "active" | "results">(
    !interviewId && !token ? "selection" : "selection"
  );
  const [chatMessage, setChatMessage] = useState("");
  const [inputInterviewId, setInputInterviewId] = useState("");
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const [loading, setLoading] = useState(!interviewId && !token ? false : true);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState<TQAPair[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [roundData, setRoundData] = useState<TInterviewRound | null>(null);
  const [assessmentToken, setAssessmentToken] = useState<string | null>(token);

  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Initial Sync Logic
  useEffect(() => {
    async function syncInterview() {
      if (!interviewId && !token) return;

      try {
        const cleanId = interviewId?.trim();
        const cleanToken = token?.trim();

        const url = cleanId 
          ? `/api/ai-interview/${cleanId}/rounds/${roundIndex}`
          : `/api/coding/validate-token?token=${cleanToken}`;
          
        const res = await fetch(url);
        const result = await res.json();

        if (res.ok) {
          // If we used a token, we might need to set the internal interviewId for subsequent calls
          const actualInterviewId = result.data.interview?._id || result.data._id;
          if (token && actualInterviewId && !interviewId) {
            router.replace(`/candidate/ai-interview?id=${actualInterviewId}&round=${roundIndex}`, { scroll: false });
            return;
          }

          const interviewObj = result.data.interview || result.data;
          const round = result.data.round || interviewObj.rounds[roundIndex];

          setRoundData(round);
          setAssessmentToken(interviewObj.assessment_token);
          setQaHistory(round.qa_pairs);

          if (round.status === "completed") {
            setView("results");
          } else if (round.qa_pairs.length > 0) {
            setCurrentQuestion(round.qa_pairs[round.qa_pairs.length - 1].question);
            setView("active");
          } else {
            setView("lobby");
          }
        } else {
          toast.error("Could not sync interview data.");
          setView("selection");
        }
      } catch (error) {
        console.error("Sync error:", error);
        toast.error("Connection lost.");
        setView("selection");
      } finally {
        setLoading(false);
      }
    }
    syncInterview();
  }, [interviewId, token, roundIndex, router]);

  // AI Voice Synthesis
  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      const maleVoice = voices.find(v => 
        v.name.toLowerCase().includes("male") || 
        v.name.toLowerCase().includes("david") || 
        v.name.toLowerCase().includes("guy")
      );
      
      if (maleVoice) utterance.voice = maleVoice;
      utterance.rate = 1.0;
      utterance.pitch = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (view === "active" && currentQuestion && !isSubmitting) {
      speak(currentQuestion);
    }
  }, [currentQuestion, view, isSubmitting]);

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
      } else if (res.status === 429) {
        toast.error("Rate limit exceeded: Please wait 15 minutes before starting another AI interview round.");
      } else {
        toast.error(result.message || "Failed to start round.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const startPractice = async (category: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-interview/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });
      const result = await res.json();
      if (res.ok) {
        const interviewId = result.data._id;
        router.push(`/candidate/ai-interview?id=${interviewId}&round=0`);
      } else {
        toast.error(result.message || "Failed to start practice.");
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
      } else if (res.status === 429) {
        toast.error("Rate limit exceeded: Please wait 15 minutes before sending another answer.");
      } else {
        toast.error(result?.message || "Failed to submit answer.");
      }
    } catch {
      toast.error("Sync failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const streamRef = useRef<MediaStream | null>(null);

  // Camera Management (Active View)
  useEffect(() => {
    const startCamera = async () => {
      try {
        if (view === "active" && !isVideoOff && !streamRef.current) {
          const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          streamRef.current = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        toast.error("Please enable camera/mic access to proceed.");
      }
    };

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => {
          t.stop();
          t.enabled = false;
        });
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
    };

    if (view === "active" && !isVideoOff) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [view, isVideoOff]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      const win = window as unknown as { 
        SpeechRecognition: SpeechRecognitionConstructor; 
        webkitSpeechRecognition: SpeechRecognitionConstructor; 
      };
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (!SpeechRecognition) return;
      const rec = new SpeechRecognition();
      rec.onresult = (e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => setChatMessage(e.results[0][0].transcript);
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
      {view === "selection" && (
        <motion.div
          key="selection"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-4xl mx-auto space-y-12 py-12"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black text-foreground tracking-tight">AI Interview Terminal</h1>
            <p className="text-text-muted">Enter your interview ID or sharpen your skills with a practice session.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Start Job Interview */}
            <div className="p-10 rounded-[3rem] bg-surface-1 border border-primary/20 space-y-6 shadow-2xl shadow-primary/5">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl">
                <FiZap />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Job Interview</h2>
                <p className="text-sm text-text-muted">Have an interview ID? Enter it below to begin your official assessment.</p>
              </div>
              <div className="space-y-4 pt-4">
                <input
                  type="text"
                  placeholder="Paste Interview ID here..."
                  value={inputInterviewId}
                  onChange={(e) => setInputInterviewId(e.target.value)}
                  className="w-full h-14 bg-surface-2 border border-border-medium rounded-2xl px-6 text-sm text-foreground outline-none focus:border-primary/50 transition-all"
                />
                <button
                  onClick={() => inputInterviewId && router.push(`/candidate/ai-interview?id=${inputInterviewId}&round=0`)}
                  disabled={!inputInterviewId}
                  className="w-full h-14 bg-primary text-foreground font-black uppercase tracking-widest rounded-2xl hover:bg-primary-hover transition-all disabled:opacity-50"
                >
                  Join Session
                </button>
              </div>
            </div>

            {/* Practice Mode */}
            <div className="p-10 rounded-[3rem] bg-surface-1 border border-border-subtle space-y-6">
              <div className="h-14 w-14 rounded-2xl bg-surface-2 flex items-center justify-center text-foreground text-2xl">
                <FiMic />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Practice Lab</h2>
                <p className="text-sm text-text-muted">Warm up with AI-generated mock interviews across different categories.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                {["Frontend", "Backend", "Behavioral", "System Design"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => startPractice(cat)}
                    className="p-4 rounded-2xl bg-surface-2 border border-border-subtle text-left hover:border-primary/40 transition-all group"
                  >
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 group-hover:text-foreground">{cat}</p>
                    <p className="text-xs text-text-muted">Start Session</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

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
            isLastRound={roundIndex >= 1} // Only 2 AI conversational rounds
            onNext={() => router.push(`/candidate/ai-interview?id=${interviewId}&round=${roundIndex + 1}`)}
            onFinish={() => router.push(`/candidate/coding-test?token=${assessmentToken}`)}
          />
        </motion.div>
      )}

      {view === "active" && (
        <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Header */}
          <header className="flex items-center justify-between p-6 rounded-3xl bg-surface-1/40 border border-border-subtle backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Live Round {roundIndex + 1}
              </div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Technical Assessment</h1>
            </div>
            <div className="flex items-center gap-4 text-right">
              <div className="border-r border-border-medium pr-4">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Progress</p>
                <p className="text-sm font-mono text-foreground">{qaHistory.length} / {roundData?.max_questions || 5}</p>
              </div>
              <button onClick={() => setShowEndConfirm(true)} className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all">
                <FiPhoneOff />
              </button>
            </div>
          </header>

          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              {/* --- Phase Specific Content --- */}
              {roundData?.type === "FrameworkProficiency" ? (
                <QuizInterface 
                  question={currentQuestion} 
                  onAnswer={(ans) => {
                    setChatMessage(ans);
                    handleSendResponse();
                  }}
                  isSubmitting={isSubmitting}
                />
              ) : roundData?.type === "CodingAssessment" ? (
                <CodingSandbox 
                  problemStatement={roundData?.qa_pairs[qaHistory.length - 1]?.metadata?.problem_statement || currentQuestion}
                  testCases={roundData?.qa_pairs[qaHistory.length - 1]?.metadata?.test_cases}
                  initialCode={roundData?.qa_pairs[qaHistory.length - 1]?.metadata?.initial_code}
                  interviewId={interviewId || ""}
                  roundIndex={roundIndex}
                  onSuccess={() => {
                    // Automatically move to next question if coding is done
                    toast.success("Solution captured. Moving to evaluation...");
                    setTimeout(handleSendResponse, 2000);
                  }}
                />
              ) : (
                <>
                  <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-border-medium bg-black shadow-2xl">
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                    {isVideoOff && (
                      <div className="absolute inset-0 bg-surface-1 flex items-center justify-center">
                        <FiVideoOff className="text-4xl text-text-muted" />
                      </div>
                    )}
                    {/* HUD Controls */}
                    <div className="absolute bottom-6 left-6 flex gap-2">
                      <button onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-xl ${isMuted ? 'bg-red-500 text-foreground' : 'bg-black/40 text-foreground backdrop-blur-md'}`}>
                        {isMuted ? <FiMicOff /> : <FiMic />}
                      </button>
                      <button onClick={() => setIsVideoOff(!isVideoOff)} className={`p-3 rounded-xl ${isVideoOff ? 'bg-red-500 text-foreground' : 'bg-black/40 text-foreground backdrop-blur-md'}`}>
                        {isVideoOff ? <FiVideoOff /> : <FiVideo />}
                      </button>
                    </div>
                  </div>

                  <div className="p-10 rounded-[2.5rem] bg-surface-1/40 border border-primary/10 relative overflow-hidden">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Interviewer Question</p>
                    <p className="text-2xl font-bold text-foreground leading-relaxed tracking-tight">&quot;{currentQuestion}&quot;</p>
                    {isSubmitting && (
                      <div className="mt-4 flex gap-1">
                        {[0, 1, 2].map(i => <motion.div key={i} animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary" />)}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex-1 p-6 rounded-[2.5rem] bg-surface-1/40 border border-border-subtle overflow-y-auto space-y-4">
                <h3 className="text-xs font-black text-foreground uppercase tracking-widest px-2">Conversation</h3>
                {qaHistory.map((q, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-border-subtle space-y-2">
                    <p className="text-[9px] font-black text-primary uppercase">Question {i + 1}</p>
                    <p className="text-xs text-text-secondary leading-relaxed">{q.question}</p>
                  </div>
                ))}
              </div>

              {/* Hide chat input for Quiz/Coding rounds as they have their own */}
              {roundData?.type !== "FrameworkProficiency" && roundData?.type !== "CodingAssessment" && (
                <div className="p-6 rounded-[2.5rem] bg-surface-1/40 border border-border-subtle space-y-4">
                  <textarea
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full h-32 bg-white/[0.02] border border-border-subtle rounded-2xl p-4 text-xs text-foreground outline-none focus:border-primary/40 transition-all resize-none disabled:opacity-50"
                    placeholder="Provide your answer..."
                  />
                  <div className="flex gap-2">
                    <button onClick={toggleRecording} className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl ${isRecording ? "bg-red-600 text-foreground" : "bg-surface-2 text-text-muted"}`}>
                      {isRecording ? <FiMicOff /> : <FiMic />}
                    </button>
                    <button
                      onClick={handleSendResponse}
                      disabled={isSubmitting || !chatMessage.trim()}
                      className="flex-[3] py-4 rounded-2xl bg-primary text-foreground font-black uppercase tracking-widest hover:bg-primary-hover disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          Processing <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                        </div>
                      ) : <span className="flex items-center justify-center gap-2">Submit <FiSend /></span>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {showEndConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
          <div className="max-w-sm w-full p-10 rounded-[3rem] bg-surface-1 border border-border-medium text-center space-y-6">
            <FiAlertCircle className="text-4xl text-red-500 mx-auto" />
            <h3 className="text-xl font-bold text-foreground">Exit Interview?</h3>
            <p className="text-xs text-text-muted">Your progress for this round will be saved, but the session will end.</p>
            <div className="grid gap-3">
              <button onClick={() => router.push("/candidate/dashboard")} className="w-full py-4 rounded-2xl bg-red-600 text-foreground font-bold uppercase tracking-widest">Confirm Exit</button>
              <button onClick={() => setShowEndConfirm(false)} className="w-full py-4 rounded-2xl bg-surface-2 text-foreground font-bold uppercase tracking-widest">Cancel</button>
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