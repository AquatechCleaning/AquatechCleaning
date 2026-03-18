import { NextResponse } from "next/server";

// Auth temporarily disabled. Return empty session responses.
export async function GET() {
  return NextResponse.json({ session: null, message: "Auth disabled" });
}

export async function POST() {
  return NextResponse.json({ session: null, message: "Auth disabled" });
}
