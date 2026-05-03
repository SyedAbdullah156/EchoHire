"use client";

import { useEffect, useRef, useState } from "react";
import { FiVideo, FiMic, FiZap, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";

type InterviewLobbyProps = {
  onStart: () => void;
};

export default function InterviewLobby({ onStart }: InterviewLobbyProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [micLevel, setMicLevel] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    async function setupHardware() {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true,
        });
        setStream(userStream);
        if (videoRef.current) videoRef.current.srcObject = userStream;

        // Mic indicator logic
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(userStream);
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateMicLevel = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setMicLevel(average);
          requestAnimationFrame(updateMicLevel);
        };
        updateMicLevel();
      } catch (err) {
        console.error("Hardware setup failed", err);
      }
    }

    setupHardware();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8 lg:p-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Video Preview */}
        <div className="space-y-6">
          <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 bg-black shadow-2xl">
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4">
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  animate={{ width: `${Math.min(micLevel * 2, 100)}%` }}
                />
              </div>
              <FiMic className={micLevel > 5 ? "text-primary animate-pulse" : "text-white/40"} />
            </div>
          </div>
          <div className="flex items-center gap-4 px-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050b18] bg-surface-2 flex items-center justify-center">
                  <FiCheckCircle className="text-emerald-500 text-xs" />
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted font-medium">Camera, Microphone, and Connection verified.</p>
          </div>
        </div>

        {/* Right: Info & Action */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
              Ready for your <span className="text-primary">AI Interview?</span>
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Before we begin, ensure you are in a quiet environment with stable lighting. The AI will evaluate your technical depth and communication skills in real-time.
            </p>
          </div>

          <div className="grid gap-4">
             <div className="p-6 rounded-3xl bg-surface-1 border border-white/5 flex items-start gap-4">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><FiZap /></div>
                <div>
                   <h4 className="text-sm font-bold text-white mb-1">Adaptive Round</h4>
                   <p className="text-xs text-text-muted">Questions will change based on your previous answers.</p>
                </div>
             </div>
             <div className="p-6 rounded-3xl bg-surface-1 border border-white/5 flex items-start gap-4">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500"><FiAlertCircle /></div>
                <div>
                   <h4 className="text-sm font-bold text-white mb-1">Stay Focused</h4>
                   <p className="text-xs text-text-muted">Do not refresh the page or switch tabs during the session.</p>
                </div>
             </div>
          </div>

          <button 
            onClick={onStart}
            disabled={!stream}
            className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:bg-primary-hover transition-all active:scale-95 shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            Start Interview Now
          </button>
        </div>
      </div>
    </div>
  );
}
