import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getUserId } from "@/lib/auth";

export async function POST(request: Request) {
  const userId = getUserId(request);
  if (userId === null) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { amount, type } = await request.json();

  if (!Number.isInteger(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "amount must be an integer number of cents" },
      { status: 400 }
    );
  };

  if (type !== "deposit" && type !== "withdrawal") {
    return NextResponse.json(
      { error: "type must be a 'deposit' or 'withdrawal'" },
      { status: 400 }
    );
  };

  const result = db
    .prepare(
      "INSERT INTO transactions(user_id, amount, type) VALUES (?, ?, ?)"
    )
    .run(userId, amount, type);

  return NextResponse.json(
    { id: result.lastInsertRowid, amount, type },
    { status: 201 }
  );
};

export async function GET(request: Request) {
  const userId = getUserId(request);
  if (userId === null) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const transactions = db
    .prepare(
      "SELECT id, amount, type, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC"
    )
    .all(userId);

  return NextResponse.json(transactions);
};
