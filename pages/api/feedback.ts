import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

// You should move this to a shared config in production
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { planId, label, message } = req.body;
    if (!label || !message) {
      return res.status(400).json({ error: 'Label and message are required.' });
    }
    try {
      const query = `INSERT INTO feedback (plan_id, label, message, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *`;
      const values = [planId || null, label, message];
      const result = await pool.query(query, values);
      return res.status(201).json({ feedback: result.rows[0] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to submit feedback.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
