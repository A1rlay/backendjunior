import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  const { refreshToken } = await request.json();

  if (!refreshToken) {
    return NextResponse.json(
      { error: "refreshToken is required" },
      { status: 400 }
    );
  }

  db.prepare("DELETE FROM refresh_tokens WHERE token = ?").run(refreshToken);

  return NextResponse.json({ message: "logged out" });
};
