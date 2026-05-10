"use server";

import { neon } from "@neondatabase/serverless";

export async function getData() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const data = await sql`
      SELECT * FROM notes ORDER BY id DESC
    `;

    return data;
  } catch (err) {
    console.error("DB Error:", err);
    return [];
  }
}
