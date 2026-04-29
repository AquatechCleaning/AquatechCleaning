import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/nextauth";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return session;
}

export async function requireAdminApi() {
  const session = await requireAdminSession();
  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { session, response: null };
}
