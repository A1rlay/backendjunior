import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getUserId } from "@/lib/auth";

export async function GET(request: Request) {
  const userId = getUserId(request);

  if (userId === null) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  };

  const user = db
    .prepare("SELECT id, email, created_at FROM users WHERE id = ?")
    .get(userId);

  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }

  return NextResponse.json(user);
};
