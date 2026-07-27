import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getUserId } from "@/lib/auth";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  const userId = getUserId(request);
  if (userId === null) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const transaction = db
    .prepare(
      "SELECT id, amount, type, created_at FROM transactions WHERE id = ? AND user_id = ?"
    )
    .get(id, userId);

  if (!transaction) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(transaction);
};

export async function PUT(request: Request, { params }: Context) {
  const userId = getUserId(request);
  if (userId === null) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { amount, type } = await request.json();

  if (!Number.isInteger(amount)) {
    return NextResponse.json(
      { error: "amount must be an integer number of cents" },
      { status: 400 }
    );
  }

  if (type !== "deposit" && type !== "withdrawal") {
    return NextResponse.json(
      { error: "type must be 'deposit' or 'withdrawal'" },
      { status: 400 }
    );
  }

  const result = db
    .prepare(
      "UPDATE transactions SET amount = ?, type = ? WHERE id = ? and user_id = ?"
    )
    .run(amount, type, id, userId);

  if (result.changes === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json({ id: Number(id), amount, type });
};

export async function DELETE(request: Request, { params }: Context) {
  const userId = getUserId(request);
  if (userId === null) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = db
    .prepare("DELETE FROM transactions WHERE id = ? and user_id = ?")
    .run(id, userId);

  if (result.changes === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
};
