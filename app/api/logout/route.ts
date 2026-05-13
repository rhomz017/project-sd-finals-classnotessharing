import { NextResponse } from "next/server";

export async function GET() {const response = NextResponse.redirect(new URL("https://project-sd-finals-classnotessharing.vercel.app/login"));
  

  // Clear cookie properly
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
    sameSite: "lax",
  });

  return response;
}