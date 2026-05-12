import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "No ID provided" },
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

    const user: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    // Get note
    const result = await db.query(
      "SELECT * FROM notes WHERE id = $1",
      [id]
    );

    const note = result.rows[0];

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    // Ownership check
    if (note.user_id !== user.userId) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }

    // Delete note
    await db.query(
      "DELETE FROM notes WHERE id = $1",
      [id]
    );

    return NextResponse.json({
      message: "Deleted successfully"
    });

  } catch (error) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}