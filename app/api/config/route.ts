import { NextRequest, NextResponse } from 'next/server';

// GET: Check API configuration
export async function GET(request: NextRequest) {
  try {    const config = {
      database: {
        connected: false,
        error: null as string | null
      },
      maps: {
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 'configured' : 'missing',
        keyLength: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.length || 0
      },
      weather: {
        apiKey: process.env.OPENWEATHER_API_KEY ? 'configured' : 'missing'
      },
      gemini: {
        apiKey: process.env.GEMINI_API_KEY ? 'configured' : 'missing'
      }
    };

    // Test database connection
    try {
      const { testDbConnection } = await import('@/shared/lib/db');
      await testDbConnection();
      config.database.connected = true;
    } catch (error) {
      config.database.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: 'Configuration check failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
