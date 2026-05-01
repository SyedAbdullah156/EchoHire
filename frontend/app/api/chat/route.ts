import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });

const SYSTEM_INSTRUCTION = `You are EchoBot, a friendly and expert AI career assistant built into EchoHire — an AI-powered interview preparation and career development platform.

Your core capabilities:
- Help candidates prepare for technical and behavioral interviews
- Provide advice on resume writing, ATS optimization, and keyword selection
- Give guidance on LinkedIn profile optimization
- Answer questions about job searching, salary negotiation, and career transitions
- Provide coding interview tips and common data structure / algorithm concepts
- Help recruiters understand best practices for evaluating candidates

Your personality:
- Concise, warm, and professional
- Always actionable — never give vague advice
- Use bullet points and short paragraphs for readability in chat
- If asked something outside your domain, politely redirect to career-related topics

Important: Format responses in clean plain text or markdown. Keep responses focused and no longer than necessary.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as {
      messages: Array<{ role: "user" | "model"; text: string }>;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required." }, { status: 400 });
    }

    // Build conversation history for Gemini multi-turn
    const contents = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      contents,
    });

    const reply = response.text ?? "Sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Chat failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
