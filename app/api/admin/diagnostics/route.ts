import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Quote } from "@/lib/models/Quote";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const connection = mongoose.connection;
    const dbName = connection.db?.databaseName ?? connection.name;
    const host = connection.host ? `${connection.host}${connection.port ? `:${connection.port}` : ""}` : "unknown";
    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get("quoteId");
    const debug = searchParams.get("debug") === "1";
    let quoteFound: boolean | undefined;
    let quoteError: string | undefined;
    if (quoteId) {
      try {
        quoteFound = Boolean(await Quote.exists({ _id: quoteId }));
      } catch (error) {
        quoteFound = false;
        quoteError = error instanceof Error ? error.message : "Unknown error";
      }
    }
    const recent = debug
      ? await Quote.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select({ _id: 1, createdAt: 1, totalAmount: 1 })
      : undefined;

    return NextResponse.json({
      connected: connection.readyState === 1,
      readyState: connection.readyState,
      dbName,
      host,
      quoteFound,
      quoteError,
      recent,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Unable to load diagnostics", details: message }, { status: 500 });
  }
}
