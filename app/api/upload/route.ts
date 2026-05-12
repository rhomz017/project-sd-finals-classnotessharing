import { supabase } from "@/lib/supabase";
import db from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const subject = formData.get("subject") as string;
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

   
    const buffer = Buffer.from(await file.arrayBuffer());

    const filePath = `notes/${Date.now()}-${file.name}`;

   
    const { error } = await supabase.storage
      .from("notes")
      .upload(filePath, buffer);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const { data } = supabase.storage
      .from("notes")
      .getPublicUrl(filePath);

    
    await db.query(
      `INSERT INTO notes 
      (title, subject, file_path, file_url, user_id) 
      VALUES ($1, $2, $3, $4, $5)`,
      [
        title,
        subject,
        filePath,
        data.publicUrl,
        decoded.userId,
      ]
    );

    return NextResponse.json({
      message: "Upload successful",
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}