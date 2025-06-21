import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import { serialize, parse } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  // Remove session token from user (or sessions table)
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies["token"];
  if (token) {
    await pool.query("UPDATE users SET session_token = NULL WHERE session_token = $1", [token]);
  }
  res.setHeader(
    "Set-Cookie",
    serialize("token", "", { path: "/", httpOnly: true, sameSite: "lax", maxAge: 0 })
  );
  return res.status(200).json({ success: true });
}
