import { NextRequest, NextResponse } from "next/server";
import pool from "@/shared/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
    }
    await pool.query(
      `DELETE FROM expenses WHERE _id = ANY($1::uuid[])`,
      [ids]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete expenses" }, { status: 500 });
  }
}
