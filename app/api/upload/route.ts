import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const subject = formData.get("subject") as string;
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // AUTH
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token (no userId)" }, { status: 401 });
    }

    // FILE → SUPABASE STORAGE
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = `notes/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("notes")
      .upload(filePath, buffer);

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage
      .from("notes")
      .getPublicUrl(filePath);

    const fileUrl = data.publicUrl;

    // DATABASE INSERT (FIXED)
    await db.query(
      `INSERT INTO notes 
      (user_id, title, subject, file_path, file_url, created_at) 
      VALUES ($1, $2, $3, $4, $5, NOW())`,
      [userId, title, subject, filePath, fileUrl]
    );

    return NextResponse.json({
      success: true,
      message: "Upload successful",
      fileUrl,
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}