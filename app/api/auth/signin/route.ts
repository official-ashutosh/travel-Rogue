import { NextRequest, NextResponse } from 'next/server';
import pool from '@/shared/lib/db';
import bcrypt from 'bcryptjs';

// POST: Sign in user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, name, email, password FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];
    
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create session/token (simplified)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
    
    const response = NextResponse.json({ 
      user: { id: user.id, name: user.name, email: user.email }, 
      token 
    });
    
    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    
    return response;
  } catch (err) {
    console.error('Error in signin:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
