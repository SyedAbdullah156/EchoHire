import { useState, useCallback, useRef } from "react";

interface UseSpeechSynthesisReturn {
    speak: (text: string) => void;
    stop: () => void;
    isSpeaking: boolean;
    isSupported: boolean;
}

export const useSpeechSynthesis = (): UseSpeechSynthesisReturn => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const isSupported =
        typeof window !== "undefined" && "speechSynthesis" in window;

    const speak = useCallback(
        (text: string) => {
            if (!isSupported || !text.trim()) return;

            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            const voices = window.speechSynthesis.getVoices();
            const preferred = voices.find(
                (v) =>
                    v.name.includes("Google") ||
                    v.name.includes("Microsoft") ||
                    v.lang === "en-US",
            );
            if (preferred) utterance.voice = preferred;

            utterance.rate = 0.95;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        },
        [isSupported],
    );

    const stop = useCallback(() => {
        if (isSupported) {
            window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
    }, [isSupported]);

    return { speak, stop, isSpeaking, isSupported };
};
