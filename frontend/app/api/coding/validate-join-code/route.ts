import { proxyRequest } from "@/lib/proxy";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const joinCode = searchParams.get("joinCode");
    return proxyRequest("GET", `/api/coding/validate-join-code?joinCode=${joinCode}`, undefined, true);
}
