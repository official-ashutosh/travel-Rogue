// pages/api/community-plans.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import samplePlans from '@/lib/sampleCommunityPlans';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { offset = 0, limit = 8 } = req.query;
  const start = Number(offset) || 0;
  const end = start + (Number(limit) || 8);
  res.status(200).json({ plans: samplePlans.slice(start, end) });
}
