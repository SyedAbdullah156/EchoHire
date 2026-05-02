"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
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
  let result;
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || "Invalid credentials" };
    }

    const { token } = result;

    // Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("echohire-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("Login Action Error:", err);
    return { success: false, message: "A system error occurred. Please try again." };
  }
  redirect(getDashboardRoute(result.data.role));
}

export async function registerAction(formData: z.infer<typeof registerSchema>) {
  let result;
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || "Registration failed" };
    }

    const { token } = result;

    // Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("echohire-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("Register Action Error:", err);
    return { success: false, message: "A system error occurred. Please try again." };
  }
  redirect(getDashboardRoute(result.data.role));
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("echohire-session");
    redirect("/auth");
}

function getDashboardRoute(role: string) {
  switch (role) {
    case "admin": return "/admin/dashboard";
    case "recruiter": return "/recruiter/dashboard";
    case "candidate": return "/candidate/dashboard";
    default: return "/";
  }
}
