import connectDB from "@/app/db/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
  } catch (err) {
    return new NextResponse(err.message, { status: 500 });
  }
  const msg = req.nextUrl.searchParams.msg || "Hello World!";

  return new NextResponse(msg);
}
