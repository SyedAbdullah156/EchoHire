"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    FiMic, FiSend, FiVideo, FiVideoOff,
    FiLayers, FiMessageSquare, FiAlertCircle,
    FiLoader, FiLock, FiCheckCircle,
    FiVolume2, FiVolumeX
} from "react-icons/fi";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useSpeechRecognition } from "../../../../hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "../../../../hooks/useSpeechSynthesis";

const BACKEND_URL = "http://localhost:5050/api";

type LoadingState = "idle" | "starting" | "answering" | "fetching";

interface QAPair {
    question: string;
    candidate_answer?: string;
    ai_evaluation?: string;
    timestamp: string;
}

interface RoundData {
    type: string;
    status: string;
    qa_pairs: QAPair[];
    max_questions: number;
    score?: number;
    remarks?: string;
}

export default function AIInterviewPage() {
    const searchParams = useSearchParams();
    const interviewId = searchParams.get("id");
    const roundIndex = searchParams.get("round") ?? "0";

    const [token, setToken] = useState("");
    const [loadingState, setLoadingState] = useState<LoadingState>("idle");
    const [roundData, setRoundData] = useState<RoundData | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [streamingText, setStreamingText] = useState("");
    const [textAnswer, setTextAnswer] = useState("");
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [voiceMode, setVoiceMode] = useState(true);
    const [mounted, setMounted] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const questionLogRef = useRef<HTMLDivElement>(null);

    const { speak, stop: stopSpeaking, isSpeaking, isSupported: ttsSupported } = useSpeechSynthesis();

    // ─── Submit Answer (Streaming) ────────────────────────────────────────────
    const submitAnswer = async (answer: string) => {
        if (!token) return toast.error("Paste your Auth Token first");
        if (!answer.trim()) return toast.error("Answer cannot be empty");

        stopSpeaking(); // Stop AI if it's talking
        setLoadingState("answering");
        setStreamingText("");
        setTextAnswer("");

        try {
            const response = await fetch(
                `${BACKEND_URL}/aiInterview/${interviewId}/rounds/${roundIndex}/answer-stream`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ content: answer }),
                },
            );

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message ?? "Request failed");
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) throw new Error("No stream reader");

            let buffer = "";
            let finalExtractedQuestion = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() ?? ""; // Keep incomplete last line

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;
                    const content = line.slice(6).trim();

                    if (content === "[DONE]") {
                        // Stream finished
                        await fetchRoundStatus(finalExtractedQuestion);
                        setStreamingText("");
                        toast.success("Answer saved");
                        return;
                    }

                    try {
                        const parsed = JSON.parse(content);
                        if (parsed.chunk) {
                            setStreamingText((prev) => {
                                const updated = prev + parsed.chunk;
                                const qMatch = updated.match(/\[QUESTION\]([\s\S]*)/);
                                if (qMatch?.[1]) {
                                    const cleanQ = qMatch[1].trim();
                                    setCurrentQuestion(cleanQ);
                                    finalExtractedQuestion = cleanQ; // Track the final question for TTS
                                }
                                return updated;
                            });
                        }
                    } catch {
                        // Partial JSON chunk — ignore
                    }
                }
            }

            await fetchRoundStatus(finalExtractedQuestion);
        } catch (err: any) {
            toast.error(err.message ?? "Failed to send answer");
            setTextAnswer(answer); // Restore text on failure
        } finally {
            setLoadingState("idle");
            setStreamingText("");
        }
    };

    // ─── STT Setup ────────────────────────────────────────────────────────────
    const handleFinalTranscript = useCallback(
        (spokenText: string) => {
            setTextAnswer(spokenText);
            // Removed auto-submit to prevent double-call bug
        },
        [],
    );

    const {
        transcript,
        isListening,
        startListening,
        stopListening,
        resetTranscript,
        isSupported: sttSupported,
    } = useSpeechRecognition(handleFinalTranscript);

    // ─── Camera Setup ─────────────────────────────────────────────────────────
    useEffect(() => {
        let cancelled = false;

        const setup = async () => {
            streamRef.current?.getTracks().forEach((t) => t.stop());
            streamRef.current = null;

            if (isVideoOff) return;

            try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720 },
                    audio: true,
                });
                if (cancelled) {
                    newStream.getTracks().forEach((t) => t.stop());
                    return;
                }
                streamRef.current = newStream;
                if (videoRef.current) videoRef.current.srcObject = newStream;
            } catch {
                if (!cancelled) {
                    setIsVideoOff(true);
                    toast.error("Camera access denied.");
                }
            }
        };

        setup();

        return () => {
            cancelled = true;
            streamRef.current?.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        };
    }, [isVideoOff]);

    useEffect(() => {
        if (questionLogRef.current) {
            questionLogRef.current.scrollTop = questionLogRef.current.scrollHeight;
        }
    }, [roundData?.qa_pairs.length]);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("interview-token");
        if (saved) setToken(saved);
    }, []);

    // ─── Fetch Round Status ────────────────────────────────────────────────────
    const fetchRoundStatus = useCallback(async (newQuestionToSpeak?: string) => {
        if (!interviewId || !token) return;
        setLoadingState("fetching");
        try {
            const res = await fetch(
                `${BACKEND_URL}/aiInterview/${interviewId}/rounds/${roundIndex}`,
                { headers: { Authorization: `Bearer ${token}` } },
            );
            const data = await res.json();

            if (data.success) {
                const round: RoundData = data.data.round ?? data.data;
                setRoundData(round);

                let questionText = "";
                const unanswered = round.qa_pairs.find((p) => !p.candidate_answer);
                
                if (unanswered) {
                    questionText = unanswered.question;
                } else if (round.status === "completed") {
                    questionText = "✓ Round complete.";
                } else if (round.qa_pairs.length > 0) {
                    questionText = round.qa_pairs[round.qa_pairs.length - 1].question;
                }

                setCurrentQuestion(questionText);

                // Auto-speak if a new question was generated, or if starting/fetching initial state
                if (voiceMode) {
                    if (newQuestionToSpeak) {
                        speak(newQuestionToSpeak);
                    } else if (round.status === "completed" && newQuestionToSpeak !== null) {
                        speak("The interview round is now complete. Thank you for your time.");
                    }
                }

            } else {
                toast.error(data.message ?? "Failed to fetch round status");
            }
        } catch {
            toast.error("Connection error while fetching round");
        } finally {
            setLoadingState("idle");
        }
    }, [interviewId, roundIndex, token, voiceMode, speak]);

    useEffect(() => {
        if (interviewId && token) fetchRoundStatus(null as any); // Pass null so it doesn't auto-speak on mere refresh
    }, [interviewId, token]);

    // ─── Start Round ──────────────────────────────────────────────────────────
    const handleStartRound = async () => {
        if (!token) return toast.error("Paste your Auth Token first");
        if (!interviewId) return toast.error("No interview ID in URL");

        setLoadingState("starting");
        try {
            const res = await fetch(
                `${BACKEND_URL}/aiInterview/${interviewId}/rounds/${roundIndex}/start`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const data = await res.json();
            if (data.success) {
                toast.success("Interview started!");
                const firstQ = data.data?.round?.qa_pairs?.[0]?.question;
                await fetchRoundStatus(firstQ); // Pass the question to trigger TTS
            } else {
                toast.error(data.message ?? "Failed to start");
            }
        } catch {
            toast.error("Connection error");
        } finally {
            setLoadingState("idle");
        }
    };

    const handleMicPress = () => {
        if (isSpeaking) stopSpeaking();
        resetTranscript();
        startListening();
    };

    const handleMicRelease = () => {
        stopListening();
    };

    // ─── Derived State ────────────────────────────────────────────────────────
    const isLoading = loadingState !== "idle";
    const roundStarted = (roundData?.qa_pairs.length ?? 0) > 0;
    const roundComplete = roundData?.status === "completed";
    const canAnswer = roundStarted && !roundComplete && !isLoading;
    const progress = roundData
        ? Math.round((roundData.qa_pairs.length / roundData.max_questions) * 100)
        : 0;

    if (!interviewId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10">
                <FiAlertCircle size={48} className="text-rose-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">No Interview ID</h2>
                <p className="text-slate-400 mb-6 max-w-sm">
                    Add <code className="text-blue-400">?id=YOUR_ID</code> to the URL.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-5 p-4 md:p-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                        </span>
                        Live Interview
                    </div>
                    <h1 className="text-xl font-bold text-white">Session #{interviewId.slice(-6)}</h1>
                    {roundData && (
                        <p className="text-xs text-slate-500 mt-0.5">
                            Round {Number(roundIndex) + 1} · {roundData.type} · {roundData.qa_pairs.length}/{roundData.max_questions} questions
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {roundData && (
                        <div className="flex flex-col gap-1 w-28 hidden md:flex">
                            <div className="text-[10px] text-slate-500 text-right">{progress}%</div>
                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => { setVoiceMode((v) => !v); stopSpeaking(); }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            voiceMode
                                ? "bg-blue-600/20 border border-blue-500/40 text-blue-400"
                                : "bg-slate-800 border border-slate-700 text-slate-400"
                        }`}
                        title="Toggle voice mode"
                    >
                        {voiceMode ? <FiVolume2 size={13} /> : <FiVolumeX size={13} />}
                        {voiceMode ? "Voice On" : "Voice Off"}
                    </button>

                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={11} />
                        <input
                            type="password"
                            placeholder="Auth Token"
                            value={token}
                            onChange={(e) => { setToken(e.target.value); localStorage.setItem("interview-token", e.target.value); }}
                            className="pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500 w-40 transition-all"
                        />
                    </div>

                    {!roundStarted && !isLoading && token && (
                        <button onClick={handleStartRound} className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-xl text-white font-bold text-xs uppercase tracking-widest transition-all">
                            Start
                        </button>
                    )}

                    {isLoading && (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <FiLoader className="animate-spin text-blue-500" size={13} />
                            {loadingState === "starting" ? "Starting..." : loadingState === "answering" ? "AI thinking..." : "Loading..."}
                        </div>
                    )}
                </div>
            </header>

            {mounted && !sttSupported && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center gap-3 text-amber-400">
                    <FiAlertCircle size={16} />
                    <p className="text-xs font-semibold">Voice input is not supported in this browser. Use Chrome or Edge for the full experience.</p>
                </div>
            )}

            {roundComplete && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl flex items-center gap-4">
                    <FiCheckCircle className="text-emerald-400 shrink-0" size={20} />
                    <div>
                        <p className="font-bold text-emerald-400">Round Complete · Score: {roundData?.score ?? "–"}/100</p>
                        {roundData?.remarks && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{roundData.remarks}</p>}
                    </div>
                </div>
            )}

            <div className="grid gap-5 lg:grid-cols-12">
                <div className="lg:col-span-8 space-y-5">
                    <div className="relative aspect-video overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
                        <video ref={videoRef} autoPlay muted playsInline
                            className={`h-full w-full object-cover transition-opacity duration-700 ${isVideoOff ? "opacity-0" : "opacity-100"}`}
                        />
                        {isVideoOff && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                                <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center mb-3 border border-slate-700">
                                    <FiVideoOff className="text-3xl text-slate-500" />
                                </div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Camera Off</p>
                            </div>
                        )}

                        <div className="absolute top-4 right-4 px-3 py-2 rounded-xl border border-white/5 bg-slate-950/80 backdrop-blur-md">
                            <div className="flex items-center gap-2">
                                <div className={`flex gap-0.5 transition-opacity ${isSpeaking ? "opacity-100" : "opacity-30"}`}>
                                    {[0, 100, 200].map((d) => (
                                        <span key={d} className="w-0.5 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: `${d}ms` }} />
                                    ))}
                                </div>
                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">
                                    {isSpeaking ? "AI Speaking" : isListening ? "Listening..." : "AI Ready"}
                                </p>
                            </div>
                        </div>

                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/5 bg-slate-950/70 backdrop-blur-xl">
                            <button
                                onMouseDown={handleMicPress}
                                onMouseUp={handleMicRelease}
                                onTouchStart={handleMicPress}
                                onTouchEnd={handleMicRelease}
                                disabled={!canAnswer || !sttSupported}
                                className={`p-3 rounded-xl transition-all disabled:opacity-40 select-none ${
                                    isListening
                                        ? "bg-rose-500 text-white scale-110 ring-4 ring-rose-500/30"
                                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                }`}
                                title="Hold to speak"
                            >
                                {isListening ? <FiMic size={18} className="animate-pulse" /> : <FiMic size={18} />}
                            </button>

                            <button
                                onClick={() => currentQuestion && speak(currentQuestion)}
                                disabled={!ttsSupported || !currentQuestion || roundComplete}
                                className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition-all"
                                title="Repeat question"
                            >
                                <FiVolume2 size={18} />
                            </button>

                            <button
                                onClick={() => setIsVideoOff((v) => !v)}
                                className={`p-3 rounded-xl transition-all ${isVideoOff ? "bg-rose-500/20 text-rose-500" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                            >
                                {isVideoOff ? <FiVideoOff size={18} /> : <FiVideo size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-blue-500/10 bg-slate-900/40 p-8 relative overflow-hidden min-h-[130px]">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
                            <FiMessageSquare size={100} />
                        </div>

                        {isSpeaking && (
                            <div className="flex items-center gap-1 mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span
                                        key={i}
                                        className="w-1 bg-blue-500 rounded-full animate-pulse"
                                        style={{
                                            height: `${8 + (i % 3) * 6}px`,
                                            animationDelay: `${i * 100}ms`,
                                        }}
                                    />
                                ))}
                                <span className="ml-2 text-[10px] text-blue-400 font-bold uppercase tracking-widest">Speaking</span>
                            </div>
                        )}

                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">AI Question</h4>
                        <p className="text-xl font-bold text-white leading-relaxed">
                            {streamingText
                                ? streamingText.replace(/\[EVALUATION\][\s\S]*?\[QUESTION\]/g, "").trim() ||
                                  "AI is formulating the next question..."
                                : currentQuestion || "Start the interview to begin."}
                        </p>
                    </div>

                        {voiceMode && textAnswer.trim() && !isLoading && (
                            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Review your answer</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => { setTextAnswer(""); resetTranscript(); }}
                                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-[9px] font-bold uppercase transition-all"
                                        >
                                            Clear
                                        </button>
                                        <button
                                            onClick={() => submitAnswer(textAnswer)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] uppercase tracking-widest transition-all"
                                        >
                                            <FiSend size={12} /> Submit Now
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {textAnswer}
                                </p>
                            </div>
                        )}

                        {isListening && (
                        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Listening — release mic to submit</span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed min-h-[20px]">
                                {transcript || <span className="text-slate-600 italic">Start speaking...</span>}
                            </p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 space-y-5">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 h-[380px] flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                <FiLayers size={13} />
                            </div>
                            <h3 className="font-bold text-white text-sm">Question Log</h3>
                            {roundData && (
                                <span className="ml-auto text-[10px] text-slate-500 font-mono">
                                    {roundData.qa_pairs.length}/{roundData.max_questions}
                                </span>
                            )}
                        </div>
                        <div ref={questionLogRef} className="flex-1 overflow-y-auto space-y-2 pr-1">
                            {!roundData?.qa_pairs.length ? (
                                <p className="text-xs text-slate-600 p-2">No questions yet.</p>
                            ) : (
                                roundData.qa_pairs.map((qa, i) => (
                                    <div key={i} className={`p-3 rounded-2xl border transition-all ${
                                        !qa.candidate_answer
                                            ? "border-blue-500/30 bg-blue-500/5"
                                            : "border-slate-800/50 bg-slate-900/30"
                                    }`}>
                                        <div className="flex gap-2">
                                            <span className="text-[10px] font-mono font-bold text-slate-600 mt-0.5 shrink-0">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <div className="space-y-1.5 min-w-0">
                                                <p className="text-xs text-slate-300 leading-relaxed">{qa.question}</p>
                                                {qa.candidate_answer && (
                                                    <p className="text-[10px] text-slate-500 border-l-2 border-slate-700 pl-2 leading-relaxed">
                                                        {qa.candidate_answer.length > 60
                                                            ? qa.candidate_answer.slice(0, 60) + "..."
                                                            : qa.candidate_answer}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-white text-sm">Text Fallback</h3>
                            <span className="text-[10px] text-slate-600">Ctrl+Enter to send</span>
                        </div>
                        <textarea
                            value={voiceMode ? transcript : textAnswer}
                            onChange={(e) => !voiceMode && setTextAnswer(e.target.value)}
                            readOnly={voiceMode}
                            disabled={!canAnswer}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && e.ctrlKey && !voiceMode) submitAnswer(textAnswer);
                            }}
                            className={`w-full h-28 bg-slate-950/50 border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 outline-none focus:border-blue-500/50 transition-all resize-none placeholder:text-slate-600 disabled:opacity-40 ${voiceMode ? "cursor-not-allowed" : ""}`}
                            placeholder={voiceMode ? "Hold mic button to speak..." : "Type your answer..."}
                        />
                        {!voiceMode && (
                            <button
                                onClick={() => submitAnswer(textAnswer)}
                                disabled={!canAnswer || !textAnswer.trim()}
                                className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {loadingState === "answering"
                                    ? <FiLoader className="animate-spin" size={13} />
                                    : <><FiSend size={12} /> Submit</>
                                }
                            </button>
                        )}
                        {voiceMode && (
                            <p className="text-center text-[10px] text-slate-600 mt-3">
                                Switch to text mode using the "Voice On" button above
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
