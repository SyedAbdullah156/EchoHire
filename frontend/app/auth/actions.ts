"use server";

import { cookies } from "next/headers";
import { z } from "zod";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["candidate", "recruiter", "admin"]),
});

export async function loginAction(formData: z.infer<typeof loginSchema>) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || "Invalid credentials" };
    }

    const { token, data } = result;

    // Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("echohire-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return { 
      success: true, 
      message: "Logged in successfully",
      redirectUrl: getDashboardRoute(data.role) 
    };
  } catch (err) {
    console.error("Login Action Error:", err);
    return { success: false, message: "A system error occurred. Please try again." };
  }
}

export async function registerAction(formData: z.infer<typeof registerSchema>) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || "Registration failed" };
    }

    const { token, data } = result;

    // Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("echohire-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return { 
      success: true, 
      message: "Registered successfully",
      redirectUrl: getDashboardRoute(data.role) 
    };
  } catch (err) {
    console.error("Register Action Error:", err);
    return { success: false, message: "A system error occurred. Please try again." };
  }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("echohire-session");
    return { success: true, redirectUrl: "/auth" };
}

function getDashboardRoute(role: string) {
  switch (role) {
    case "admin": return "/admin/dashboard";
    case "recruiter": return "/recruiter/dashboard";
    case "candidate": return "/candidate/dashboard";
    default: return "/";
  }
}
