import { NextRequest, NextResponse } from 'next/server';
import pool from '@/shared/lib/db';
import bcrypt from 'bcryptjs';

// POST: Sign up a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);    // Create user
    const result = await pool.query(
      'INSERT INTO users (name, email, password, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    
    const user = result.rows[0];
    
    // Create session/token (simplified - in production use proper session management)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
    
    const response = NextResponse.json({ user, token }, { status: 201 });
    
    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    
    return response;
  } catch (err) {
    console.error('Error in signup:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
