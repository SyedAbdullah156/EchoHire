import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.utils";
import { getGeminiModel } from "../config/gemini.config";
import { Interview } from "../models/interview.model";
import mongoose from "mongoose";
import { sendAccessCode } from "../services/email.service";
import { AuthRequest } from "../types/request.types";
import * as AiService from "../services/aiInterview.services";

export const executeCode = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { code, language, problemStatement, testCases, interviewId, roundIndex } = req.body;
    const userId = req.user?._id;

    if (!code || !language) {
      throw new AppError("Code and language are required", 400);
    }

    const model = getGeminiModel(true);
    const prompt = `
      You are an expert code execution engine and complexity analyzer.
      
      TASK:
      1. Analyze the provided code in ${language}.
      2. If a problem statement is provided ("${problemStatement || 'N/A'}"), check if the code solves it correctly.
      3. Simulate the execution and provide the expected output.
      4. Perform a Big O time and space complexity analysis.
      5. Suggest 2-3 specific technical improvements.
      ${testCases ? `6. Specifically validate the code against these test cases and report pass/fail for each: ${JSON.stringify(testCases)}` : ""}

      CODE:
      \`\`\`${language}
      ${code}
      \`\`\`

      Respond strictly in JSON format:
      {
        "success": boolean,
        "output": "standard output here",
        "timeComplexity": "e.g. O(n log n)",
        "spaceComplexity": "e.g. O(n)",
        "analysis": "detailed explanation of why the code is correct/incorrect",
        "suggestions": ["suggestion 1", "suggestion 2"],
        "testResults": [
          { "input": "input string", "expected": "expected output", "actual": "actual simulated output", "passed": boolean }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean JSON from markdown blocks
    const cleanedJson = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
    const analysisResult = JSON.parse(cleanedJson);

    // If part of an interview, persist results
    if (interviewId && roundIndex !== undefined && userId) {
        const interview = await Interview.findOne({ _id: interviewId, user_id: userId });
        if (interview && interview.rounds[roundIndex]) {
            const passed = analysisResult.testResults?.filter((r: any) => r.passed).length || 0;
            const total = analysisResult.testResults?.length || 0;
            
            interview.rounds[roundIndex].phase_data = {
                coding_complexity: {
                    time: analysisResult.timeComplexity,
                    space: analysisResult.spaceComplexity
                },
                test_cases_passed: passed,
                test_cases_total: total
            };
            
            // Also add as a QA pair for history
            interview.rounds[roundIndex].qa_pairs.push({
                question: `[CODING CHALLENGE] ${problemStatement || "Solution"}`,
                candidate_answer: `\`\`\`${language}\n${code}\n\`\`\``,
                ai_evaluation: analysisResult.analysis,
                timestamp: new Date()
            });

            interview.markModified("rounds");
            await interview.save();
        }
    }

    res.status(200).json({
      success: true,
      data: analysisResult
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Validate unique assessment token from URL
 */
export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.query;
        if (!token) throw new AppError("Token is required", 400);

        const interview = await Interview.findOne({ assessment_token: token as string })
            .populate("job_id", "name role")
            .populate("user_id", "name email");

        if (!interview) {
            throw new AppError("Invalid or expired assessment link", 404);
        }

        res.status(200).json({
            success: true,
            data: interview
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Validate unique join code
 */
export const validateJoinCode = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const joinCodeRaw = req.query.joinCode as string;
        const joinCode = joinCodeRaw?.trim();
        const userId = req.user?._id;

        if (!joinCode) throw new AppError("Join code is required", 400);

        // Find the interview by code first
        const interview = await Interview.findOne({ 
            join_code: { $regex: new RegExp(`^${joinCode}$`, "i") }
        }).populate("job_id", "name role");

        if (!interview) {
            throw new AppError("Invalid or expired join code", 404);
        }

        // Check if the current user is the owner
        if (interview.user_id.toString() !== userId?.toString()) {
            console.warn(`[AUTH] User ${userId} attempted to join assessment ${interview._id} owned by ${interview.user_id}`);
            throw new AppError("This assessment belongs to a different account. Please log in as the correct candidate.", 403);
        }

        // AUTO-CORRECT: Apply to all coding rounds in the interview
        for (let i = 0; i < interview.rounds.length; i++) {
            if (interview.rounds[i].type === "CodingAssessment") {
                await AiService.autoCorrectRound(interview, i);
            }
        }

        res.status(200).json({
            success: true,
            data: interview
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Challenge Gate: Request a unique access code
 */
export const requestAccessCode = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        const { interviewId } = req.body; // This could be _id OR join_code

        const interview = await Interview.findOne({ 
            $or: [{ _id: mongoose.Types.ObjectId.isValid(interviewId) ? interviewId : new mongoose.Types.ObjectId() }, { join_code: interviewId }],
            user_id: userId 
        });
        if (!interview) throw new AppError("Assessment not found. Please check your Join Code.", 404);

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`[AUTH] ACCESS CODE GENERATED: ${code} for Assessment: ${interviewId}`);
        interview.access_code = code;
        interview.access_code_expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        await interview.save();

        // Send Email (Async)
        const interviewPopulated = await interview.populate("user_id", "email");
        const userEmail = (interviewPopulated.user_id as any).email;

        if (userEmail) {
            sendAccessCode(userEmail, code).catch(err => console.error("Email Error:", err));
        }

        res.status(200).json({
            success: true,
            message: "Access code sent to your registered email"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Challenge Gate: Verify the access code
 */
export const verifyAccessCode = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        const { interviewId, code } = req.body;

        const interview = await Interview.findOne({ 
            $or: [{ _id: mongoose.Types.ObjectId.isValid(interviewId) ? interviewId : new mongoose.Types.ObjectId() }, { join_code: interviewId }],
            user_id: userId 
        });
        if (!interview) throw new AppError("Assessment not found", 404);

        if (interview.access_code !== code) {
            throw new AppError("Invalid access code", 400);
        }

        if (interview.access_code_expires && new Date() > interview.access_code_expires) {
            throw new AppError("Access code has expired", 400);
        }

        // Clear code after verification
        interview.access_code = undefined;
        interview.access_code_expires = undefined;
        await interview.save();

        res.status(200).json({
            success: true,
            message: "Access granted"
        });
    } catch (error) {
        next(error);
    }
};
