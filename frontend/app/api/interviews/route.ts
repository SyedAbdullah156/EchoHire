import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("echohire-session")?.value;

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

  try {
    const response = await fetch(`${API_BASE}/api/interviews`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("echohire-session")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

  try {
    const contentType = req.headers.get("content-type") || "";
    
    let body;
    if (contentType.includes("multipart/form-data")) {
        body = await req.formData();
    } else {
        body = JSON.stringify(await req.json());
    }

    const response = await fetch(`${API_BASE}/api/interviews`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Note: For FormData, don't set Content-Type, let fetch handle it with the boundary
      },
      body: body as any,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
