import { proxyRequest } from "@/lib/proxy";

export async function DELETE(req: Request) {
    return proxyRequest("DELETE", "/api/candidates/me", req, true);
}

export async function PUT(req: Request) {
    return proxyRequest("PUT", "/api/candidates/me", req, true);
}

export async function GET(req: Request) {
    return proxyRequest("GET", "/api/candidates/me", req, true);
}
