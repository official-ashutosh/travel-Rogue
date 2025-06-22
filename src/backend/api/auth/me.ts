import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/shared/lib/db";
import { parse } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Example: get session token from cookies
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies["token"];

  if (!token) {
    return res.status(401).json({ user: null });
  }

  // Replace this with your real session lookup logic
  try {
    // Example: select user by session token
    const { rows } = await pool.query(
      "SELECT id, name, email FROM users WHERE session_token = $1 LIMIT 1",
      [token]
    );
    if (rows.length === 0) {
      return res.status(401).json({ user: null });
    }
    return res.status(200).json({ user: rows[0] });
  } catch (err) {
    return res.status(500).json({ error: "Database error" });
  }
}
