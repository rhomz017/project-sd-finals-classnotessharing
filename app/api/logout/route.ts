import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(new URL("/login", "http://localhost:3000"));

  // Clear cookie properly
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
    sameSite: "lax",
  });

  return response;
}