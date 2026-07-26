import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

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
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  return NextResponse.json({ token });
};

