"use server";

import { z } from "zod";

const recruiterSetupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  jobTitle: z.string().min(2, "Job title is required"),
  companyId: z.string().min(1, "Please select a company"),
  avatarDataUrl: z.string().optional(),
  notifications: z.object({
    email: z.boolean(),
    desktop: z.boolean(),
    marketing: z.boolean(),
  }),
});

export async function setupRecruiterProfile(data: unknown) {
  try {
    // 1. Validate data
    const validatedData = recruiterSetupSchema.parse(data);

    // 2. Prepare payload for Express backend
    const payload = {
      name: `${validatedData.firstName} ${validatedData.lastName}`,
      profile: {
        jobTitle: validatedData.jobTitle,
        companyId: validatedData.companyId,
        avatarDataUrl: validatedData.avatarDataUrl,
        notifications: validatedData.notifications,
      },
    };

    // 3. Hit the Express backend (assuming internal network or accessible URL)
    // In a real scenario, you'd get the user ID from the session/token
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5050";
    
    // NOTE: We need the user's token from the cookie to authorize this request
    // This is a simplified version
    const response = await fetch(`${backendUrl}/api/users/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile");
    }

    return { success: true, message: "Profile setup successfully" };
  } catch (error) {
    console.error("Setup Error:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}
