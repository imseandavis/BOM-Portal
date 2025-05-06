import { NextResponse } from 'next/server';

const YELP_API_KEY = process.env.YELP_API_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');
    const location = searchParams.get('location');
    const limit = searchParams.get('limit');

    if (!term || !location || !limit) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    if (!YELP_API_KEY) {
      console.error('YELP_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Yelp API key is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.yelp.com/v3/businesses/search?term=${encodeURIComponent(term)}&location=${encodeURIComponent(location)}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${YELP_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache results for 1 hour
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Yelp API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      return NextResponse.json(
        { error: `Yelp API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Yelp search:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from Yelp API' },
      { status: 500 }
    );
  }
} 