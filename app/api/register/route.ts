import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
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
      [name.trim(), email.toLowerCase().trim(), hashedPassword]
    );

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}