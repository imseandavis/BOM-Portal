import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp();
}

export async function POST(request: Request) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 400 }
      );
    }

    // Get user and their custom claims
    const user = await getAuth().getUser(uid);
    const customClaims = user.customClaims || {};

    return NextResponse.json({ 
      uid: user.uid,
      email: user.email,
      customClaims 
    });
  } catch (error) {
    console.error('Error getting user claims:', error);
    return NextResponse.json(
      { error: 'Failed to get user claims' },
      { status: 500 }
    );
  }
} 