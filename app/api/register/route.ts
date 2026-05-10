import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    
    const existing = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    return NextResponse.json({ message: "Success" });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
