import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// ✅ CREATE TOKEN (for login)
export function createToken(user: any) {
  return jwt.sign(user, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
}

// ✅ GET USER (for protected pages)
export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}