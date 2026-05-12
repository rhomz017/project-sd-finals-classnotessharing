import db from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    
    const result = await db.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    
    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    
    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({
      message: "Login successful",
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}