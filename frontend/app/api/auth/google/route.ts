import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5050";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const response = await fetch(`${API_BASE}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, message: result.message || "Google login failed" }, { status: response.status });
    }

    if (result.mfaRequired) {
      return NextResponse.json({ 
        success: true, 
        mfaRequired: true, 
        userId: result.userId 
      });
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

    return NextResponse.json({ 
      success: true, 
      message: "Logged in successfully",
      data: data
    });
  } catch (error) {
    console.error("Google Auth Proxy Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
