import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    try {
      const query = `SELECT id, email, credits, free_credits FROM users WHERE id = $1`;
      const values = [userId];
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Map DB fields to expected frontend fields
      const user = {
        id: result.rows[0].id,
        email: result.rows[0].email,
        credits: result.rows[0].credits,
        freeCredits: result.rows[0].free_credits,
      };
      return res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch user.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
