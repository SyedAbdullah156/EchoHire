import { proxyRequest } from "@/lib/proxy";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    return proxyRequest("GET", `/api/coding/validate-token?token=${token}`, undefined, false);
}
