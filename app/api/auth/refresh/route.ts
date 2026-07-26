import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

export async function POST(request: Request) {
  const { refreshToken } = await request.json();

  if (!refreshToken) {
    return NextResponse.json(
      { error: "refreshToken is required" },
      { status: 400 }
    );
  }

  const row = db
    .prepare("SELECT * FROM refresh_tokens WHERE token = ?")
    .get(refreshToken) as
    | { token: string, user_id: number, expires_at: string }
    | undefined;

  if (!row) {
    return NextResponse.json(
      { error: "invalid refresh token" },
      { status: 401 }
    );
  };

  if (new Date(row.expires_at) < new Date()) {
    db.prepare("DELETE FROM refresh_tokens WHERE token = ?").run(refreshToken);
    return NextResponse.json(
      { error: "refresh token expired" },
      { status: 401 }
    );
  };

  const accessToken = jwt.sign(
    { userId: row.user_id },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  return NextResponse.json({ accessToken });
};
