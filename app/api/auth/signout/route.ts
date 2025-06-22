import { NextRequest, NextResponse } from 'next/server';

// POST: Sign out user
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ message: 'Signed out successfully' });
    
    // Clear the auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immediately
    });
    
    return response;
  } catch (err) {
    console.error('Error in signout:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
