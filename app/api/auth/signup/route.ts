import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 }
    );
  };

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const result = db.
      prepare("INSERT INTO users(email, password_hash) VALUES (?, ?)")
      .run(email, passwordHash);

    return NextResponse.json(
      { id: result.lastInsertRowid, email },
      { status: 201 }
    );
  } catch (err: any) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return NextResponse.json(
        { error: "email already registered" },
        { status: 409 }
      );
    }

    throw err;
  };
};
