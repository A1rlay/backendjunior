import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "@/lib/db";
import crypto from "crypto";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 }
    );
  };

  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email) as { id: number; password_hash: string } | undefined;

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return NextResponse.json(
      { error: "invalid credentials" },
      { status: 401 }
    );
  };

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  const refreshToken = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  db.prepare(
    "INSERT INTO refresh_tokens(token, user_id, expires_at) VALUES (?, ?, ?)"
  ).run(refreshToken, user.id, expiresAt);

  return NextResponse.json({ accessToken, refreshToken });
};

