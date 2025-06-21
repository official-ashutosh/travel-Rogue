import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }
  try {
    // Replace with your real password check (hash, etc.)
    const { rows } = await pool.query(
      "SELECT id, name, email FROM users WHERE email = $1 AND password = $2 LIMIT 1",
      [email, password]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Generate a session token (for demo, use user id + timestamp)
    const token = `${rows[0].id}-${Date.now()}`;
    // Save token to user (in production, use a sessions table)
    await pool.query("UPDATE users SET session_token = $1 WHERE id = $2", [token, rows[0].id]);
    // Set cookie
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, { path: "/", httpOnly: true, sameSite: "lax" })
    );
    return res.status(200).json({ user: rows[0] });
  } catch (err) {
    return res.status(500).json({ error: "Database error" });
  }
}
