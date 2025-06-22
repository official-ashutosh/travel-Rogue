import { NextRequest, NextResponse } from 'next/server';
import samplePlans from '@/shared/lib/sampleCommunityPlans';

// GET: Fetch community plans (published plans or sample plans)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const offset = parseInt(searchParams.get('offset') || '0');
    const limit = parseInt(searchParams.get('limit') || '8');
    const companion = searchParams.get('companion');
    
    let filteredPlans = samplePlans;
    
    // Filter by companion if specified
    if (companion && companion !== '') {
      filteredPlans = samplePlans.filter(plan => 
        plan.companion === companion
      );
    }
    
    // Apply pagination
    const start = offset;
    const end = start + limit;
    const paginatedPlans = filteredPlans.slice(start, end);
    
    return NextResponse.json({ 
      plans: paginatedPlans,
      total: filteredPlans.length,
      hasMore: end < filteredPlans.length 
    });
  } catch (err) {
    console.error('Error fetching community plans:', err);
    return NextResponse.json({ error: 'Failed to fetch community plans' }, { status: 500 });
  }
}
