import { NextRequest, NextResponse } from 'next/server';
import pool from '@/shared/lib/db';

// GET: List all plans for the current user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: userId required' }, { status: 401 });
    }

    const result = await pool.query(
      'SELECT * FROM plans WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    return NextResponse.json({ plans: result.rows });
  } catch (err) {
    console.error('Error fetching plans:', err);
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}

// POST: Create a new plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nameoftheplace, abouttheplace, userId } = body;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: userId required' }, { status: 401 });
    }
    
    if (!nameoftheplace) {
      return NextResponse.json({ error: 'Missing plan name' }, { status: 400 });
    }

    // Generate UUID for the new plan
    const result = await pool.query(
      'INSERT INTO plans (id, user_id, nameoftheplace, abouttheplace, is_published, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) RETURNING *',
      [userId, nameoftheplace, abouttheplace || '', false]
    );
    
    return NextResponse.json({ plan: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('Error creating plan:', err);
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
  }
}

// DELETE: Delete a plan
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, userId } = body;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: userId required' }, { status: 401 });
    }
    
    if (!planId) {
      return NextResponse.json({ error: 'Missing planId' }, { status: 400 });
    }

    await pool.query('DELETE FROM plans WHERE id = $1 AND user_id = $2', [planId, userId]);
    
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Error deleting plan:', err);
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
  }
}

// PUT: Update a plan
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, nameoftheplace, abouttheplace, userId } = body;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: userId required' }, { status: 401 });
    }
    
    if (!planId) {
      return NextResponse.json({ error: 'Missing planId' }, { status: 400 });
    }

    const result = await pool.query(
      'UPDATE plans SET nameoftheplace = $1, abouttheplace = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING *',
      [nameoftheplace, abouttheplace, planId, userId]
    );
    
    return NextResponse.json({ plan: result.rows[0] });
  } catch (err) {
    console.error('Error updating plan:', err);
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
  }
}
