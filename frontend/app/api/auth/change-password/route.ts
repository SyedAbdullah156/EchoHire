import { proxyRequest } from "@/lib/proxy";

export async function POST(req: Request) {
    return proxyRequest("POST", "/api/auth/change-password", req);
}
