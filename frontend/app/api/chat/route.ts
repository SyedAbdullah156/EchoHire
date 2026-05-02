import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;


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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("CHAT ERROR: GEMINI_API_KEY is missing");
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    // Initialize the model with system instruction
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Build conversation history for Gemini multi-turn
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const lastMessage = messages[messages.length - 1].text;

    console.log(`[ChatAPI] Starting chat with model: ${modelName}`);
    console.log(`[ChatAPI] History length: ${history.length}`);

    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const reply = response.text();

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("CHAT API ERROR:", error);
    const message = error instanceof Error ? error.message : "Chat failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
