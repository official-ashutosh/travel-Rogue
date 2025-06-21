import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

// GET /api/plans/[planId]?public=true
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { planId } = req.query;
  const isPublic = req.query.public === 'true';

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!planId || typeof planId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid planId' });
  }

  try {
    // If public, only return if is_published is true
    let query = 'SELECT * FROM plans WHERE id = $1';
    let params: any[] = [planId];
    if (isPublic) {
      query += ' AND is_published = true';
    }
    const result = await pool.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found or not public' });
    }
    return res.status(200).json({ plan: result.rows[0] });
  } catch (err) {
    console.error('Error fetching plan:', err);
    return res.status(500).json({ error: 'Failed to fetch plan' });
  }
}
