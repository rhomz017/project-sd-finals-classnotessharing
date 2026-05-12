import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type UserPayload = {
  userId: number;
  name?: string;
  email?: string;
};

// ✅ CREATE TOKEN (login)
export function createToken(user: UserPayload) {
  return jwt.sign(
    {
      userId: user.userId,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );
}

// ✅ GET USER (protected pages)
export async function getUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as UserPayload;

    return decoded;
  } catch {
    return null;
  }
}