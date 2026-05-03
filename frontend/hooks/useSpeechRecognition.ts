import { useState, useRef, useCallback } from "react";

interface UseSpeechRecognitionReturn {
    transcript: string;
    isListening: boolean;
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
    isSupported: boolean;
}

export const useSpeechRecognition = (
    onFinalTranscript: (text: string) => void,
): UseSpeechRecognitionReturn => {
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    const isSupported =
        typeof window !== "undefined" &&
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

    const finalizedTextRef = useRef("");

    const startListening = useCallback(() => {
        if (!isSupported) return;

        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event: any) => {
            let interimTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalizedTextRef.current += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            setTranscript(finalizedTextRef.current + interimTranscript);
        };

        recognition.onerror = (event: any) => {
            if (event.error === "aborted") return; // Ignore manual stops
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            setTranscript((current) => {
                if (current.trim()) onFinalTranscript(current.trim());
                return current;
            });
        };

        recognitionRef.current = recognition;
        recognition.start();
    }, [isSupported, onFinalTranscript]);

    const stopListening = useCallback(() => {
        recognitionRef.current?.stop();
        setIsListening(false);
    }, []);

    const resetTranscript = useCallback(() => {
        finalizedTextRef.current = "";
        setTranscript("");
    }, []);

    return {
        transcript,
        isListening,
        startListening,
        stopListening,
        resetTranscript,
        isSupported,
    };
};
