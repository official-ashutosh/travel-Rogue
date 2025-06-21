import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

// GET: List all plans for the current user
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // You should get userId from session/cookie/JWT in a real app
  // For now, use a placeholder or req.query.userId
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: userId required' });
  }

  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT * FROM plans WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return res.status(200).json({ plans: result.rows });
    } catch (err) {
      console.error('Error fetching plans:', err);
      return res.status(500).json({ error: 'Failed to fetch plans' });
    }
  }

  // POST: Create a new plan
  if (req.method === 'POST') {
    const { nameoftheplace, abouttheplace } = req.body;
    if (!nameoftheplace) {
      return res.status(400).json({ error: 'Missing plan name' });
    }
    try {
      const result = await pool.query(
        'INSERT INTO plans (user_id, nameoftheplace, abouttheplace) VALUES ($1, $2, $3) RETURNING *',
        [userId, nameoftheplace, abouttheplace || '']
      );
      return res.status(201).json({ plan: result.rows[0] });
    } catch (err) {
      console.error('Error creating plan:', err);
      return res.status(500).json({ error: 'Failed to create plan' });
    }
  }

  // DELETE: Delete a plan
  if (req.method === 'DELETE') {
    const { planId } = req.body;
    if (!planId) {
      return res.status(400).json({ error: 'Missing planId' });
    }
    try {
      await pool.query('DELETE FROM plans WHERE id = $1 AND user_id = $2', [planId, userId]);
      return res.status(204).end();
    } catch (err) {
      console.error('Error deleting plan:', err);
      return res.status(500).json({ error: 'Failed to delete plan' });
    }
  }

  // PUT: Update a plan
  if (req.method === 'PUT') {
    const { planId, nameoftheplace, abouttheplace } = req.body;
    if (!planId) {
      return res.status(400).json({ error: 'Missing planId' });
    }
    try {
      const result = await pool.query(
        'UPDATE plans SET nameoftheplace = $1, abouttheplace = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
        [nameoftheplace, abouttheplace, planId, userId]
      );
      return res.status(200).json({ plan: result.rows[0] });
    } catch (err) {
      console.error('Error updating plan:', err);
      return res.status(500).json({ error: 'Failed to update plan' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
