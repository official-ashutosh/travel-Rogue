import { NextRequest, NextResponse } from 'next/server';
import pool from '@/shared/lib/db';

// GET: Get current user info
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ user: null });
    }

    // Decode token (simplified - in production use proper JWT)
    try {
      const decoded = Buffer.from(token, 'base64').toString();
      const [userId] = decoded.split(':');
      
      if (!userId) {
        return NextResponse.json({ user: null });
      }

      // Get user from database
      const result = await pool.query(
        'SELECT id, name, email FROM users WHERE id = $1',
        [userId]
      );
      
      if (result.rows.length === 0) {
        return NextResponse.json({ user: null });
      }

      return NextResponse.json({ user: result.rows[0] });
    } catch (decodeError) {
      return NextResponse.json({ user: null });
    }
  } catch (err) {
    console.error('Error in me endpoint:', err);
    return NextResponse.json({ user: null });
  }
}
