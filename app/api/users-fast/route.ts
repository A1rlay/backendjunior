import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const rows = db
    .prepare(
      `SELECT
				u.id AS user_id,
				u.email,
				t.id AS tx_id,
				t.amount,
				t.type
			FROM users u
			LEFT JOIN transactions t ON t.user_id = u.id
			ORDER BY u.id
			`
    )
    .all() as {
      user_id: number;
      email: string;
      tx_id: number | null;
      amount: number | null;
      type: string | null;
    }[];

  console.log(`[JOIN] 1 query returned ${rows.length} rows`);

  const usersById = new Map<
    number,
    { id: number; email: string; transactions: object[] }
  >();

  for (const row of rows) {
    if (!usersById.has(row.user_id)) {
      usersById.set(row.user_id, {
        id: row.user_id,
        email: row.email,
        transactions: [],
      });
    }
    if (row.tx_id !== null) {
      usersById.get(row.user_id)!.transactions.push({
        id: row.tx_id,
        amount: row.amount,
        type: row.type,
      });
    }
  }

  return NextResponse.json([...usersById.values()]);
};

