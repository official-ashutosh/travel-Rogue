import { NextRequest, NextResponse } from "next/server";
import pool from "@/shared/lib/db";

// Simple Bearer token authentication
function authenticate(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.replace("Bearer ", "").trim();
  // TODO: Replace with your real token validation logic
  return !!token;
}

// GET: Fetch a single plan by ID
export async function GET(req: NextRequest, { params }: { params: { planId: string } }) {
  if (!authenticate(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { planId } = params;
  try {
    const result = await pool.query(
      "SELECT * FROM plans WHERE id = $1",
      [planId]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plan" }, { status: 500 });
  }
}

// PATCH: Update a plan by ID
export async function PATCH(req: NextRequest, { params }: { params: { planId: string } }) {
  if (!authenticate(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { planId } = params;
  const updates = await req.json();
  // Example: update nameoftheplace and preferred_currency
  try {
    const { nameoftheplace, preferred_currency } = updates;
    await pool.query(
      "UPDATE plans SET nameoftheplace = COALESCE($1, nameoftheplace), preferred_currency = COALESCE($2, preferred_currency) WHERE id = $3",
      [nameoftheplace, preferred_currency, planId]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}

// DELETE: Delete a plan by ID
export async function DELETE(req: NextRequest, { params }: { params: { planId: string } }) {
  if (!authenticate(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { planId } = params;
  try {
    await pool.query("DELETE FROM plans WHERE id = $1", [planId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}
