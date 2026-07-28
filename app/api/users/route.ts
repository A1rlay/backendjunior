import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const users = db
    .prepare("SELECT id, email FROM users")
    .all() as { id: number; email: string }[];

  console.log(`[N+1] 1 query to fetch ${users.length} users`);

  const result = users.map(user => {
    const transactions = db
      .prepare("SELECT id, amount, type FROM transactions WHERE user_id = ?")
      .all(user.id);

    console.log(`[N+1] +1 query for user ${user.id}`);
    return { ...user, transactions };
  });

  console.log(
    `[N+1] TOTAL: ${1 + users.length} queries for ${users.length} users`
  );

  return NextResponse.json(result);
};
