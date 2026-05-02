import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  "super_secret_echo_hire_key_2024"
);

export async function getServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("echohire-session")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { id: string; role: string; email: string };
  } catch {
    return null;
  }
}
