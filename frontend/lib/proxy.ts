import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

export async function proxyRequest(
    method: string, 
    path: string, 
    req?: Request,
    includeAuth: boolean = true
) {
    const cookieStore = await cookies();
    const token = cookieStore.get("echohire-session")?.value;

    if (includeAuth && !token) {
        return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    try {
        let body = undefined;
        let contentType = undefined;

        if (req && (method === "POST" || method === "PUT" || method === "PATCH")) {
            const originalContentType = req.headers.get("content-type") || "";
            if (originalContentType.includes("multipart/form-data")) {
                body = await req.formData();
                // Fetch will handle Content-Type for FormData
            } else {
                body = JSON.stringify(await req.json());
                contentType = "application/json";
            }
        }

        const response = await fetch(`${API_BASE}${path}`, {
            method,
            headers: {
                ...(includeAuth && token && { Authorization: `Bearer ${token}` }),
                ...(contentType && { "Content-Type": contentType }),
            },
            body: body as any,
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error(`Proxy Error [${method} ${path}]:`, error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
