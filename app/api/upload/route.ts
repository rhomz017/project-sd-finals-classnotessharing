import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const subject = formData.get("subject") as string;
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.redirect(new URL("/dashboard?error=nofile", req.url));
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const user: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = Date.now() + "_" + file.name;
    const uploadPath = path.join(process.cwd(), "public/uploads", fileName);

    await writeFile(uploadPath, buffer);

    await db.query(
      "INSERT INTO notes (user_id, title, subject, file_path) VALUES (?, ?, ?, ?)",
      [user.id, title, subject, "/uploads/" + fileName]
    );

    return NextResponse.redirect(new URL("/dashboard", req.url));

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.redirect(new URL("/dashboard?error=upload", req.url));
  }
}