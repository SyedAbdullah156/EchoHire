import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });

const SYSTEM_PROMPT = `You are an Expert Technical Recruiter with 15+ years of experience reviewing resumes for top-tier tech companies.

Analyze the provided resume text thoroughly and return ONLY a valid JSON object matching this exact schema — no markdown, no extra text, no code fences:

{
  "candidateName": string,
  "overallScore": number (0-100, integer),
  "topSkills": string[] (5-8 of the most relevant technical and soft skills),
  "strengths": string[] (3-5 specific, concrete strengths observed in the resume),
  "weaknesses": string[] (3-5 specific, actionable areas for improvement),
  "suggestedInterviewQuestions": string[] (5-7 targeted interview questions based on this specific resume)
}

Base the overallScore on: ATS keyword density, quantified achievements, technical skill breadth, formatting clarity, and role-readiness signals.`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF and DOCX files are supported." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let extractedText = "";

    if (file.type === "application/pdf") {
      // Dynamic import — handle both CJS default and ESM named exports
      const pdfParseModule = await import("pdf-parse");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfParse: (buf: Buffer) => Promise<{ text: string }> =
        (pdfParseModule as any).default ?? (pdfParseModule as any);
      const parsed = await pdfParse(buffer);
      extractedText = parsed.text;
    } else {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from the file. Please try a different file." },
        { status: 400 }
      );
    }

    const model = genAI.models;
    const response = await model.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `${SYSTEM_PROMPT}\n\nResume Text:\n${extractedText.slice(0, 8000)}` }],
        },
      ],
    });

    const rawText = response.text ?? "";

    // Strip potential markdown code fences
    const jsonText = rawText.replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();

    let analysisResult;
    try {
      analysisResult = JSON.parse(jsonText);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse Gemini response. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: analysisResult });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
