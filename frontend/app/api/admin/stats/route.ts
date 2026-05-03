import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("echohire-session")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5050";

  try {
    const response = await fetch(`${API_BASE}/api/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Admin Stats Proxy Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
