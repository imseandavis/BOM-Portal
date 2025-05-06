import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Set custom claims
    await adminAuth.setCustomUserClaims(uid, {
      role: 'admin'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting admin role:', error);
    return NextResponse.json(
      { error: 'Failed to set admin role' },
      { status: 500 }
    );
  }
} 