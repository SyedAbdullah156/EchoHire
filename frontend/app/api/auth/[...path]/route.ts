import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("echohire-session")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const { pathname } = new URL(req.url);
  const endpoint = pathname.replace("/api/auth/", "");
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
  const body = await req.json().catch(() => ({}));

  try {
    const response = await fetch(`${API_BASE}/api/auth/${endpoint}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
