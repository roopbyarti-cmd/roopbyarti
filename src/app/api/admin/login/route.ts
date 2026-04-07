import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password === process.env.ADMIN_PASSWORD) {
    return NextResponse.json({
      success: true,
      token: "admin-secret-token" // simple token
    });
  }

  return NextResponse.json(
    { error: "Wrong password" },
    { status: 401 }
  );
}