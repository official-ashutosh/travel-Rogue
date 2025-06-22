import { NextRequest, NextResponse } from "next/server";
import pool from "@/shared/lib/db";

// GET: Fetch preferred currency for a plan
export async function GET(req: NextRequest, { params }: { params: { planId: string } }) {
  const { planId } = params;
  try {
    const result = await pool.query(
      "SELECT preferred_currency FROM plans WHERE id = $1",
      [planId]
    );
    const currency = result.rows[0]?.preferred_currency || "INR";
    return NextResponse.json({ currency });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch currency" }, { status: 500 });
  }
}

// POST: Set preferred currency for a plan
export async function POST(req: NextRequest, { params }: { params: { planId: string } }) {
  const { planId } = params;
  const { currency } = await req.json();
  if (!currency) {
    return NextResponse.json({ error: "Currency is required" }, { status: 400 });
  }
  try {
    await pool.query(
      "UPDATE plans SET preferred_currency = $1 WHERE id = $2",
      [currency, planId]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save currency" }, { status: 500 });
  }
}
