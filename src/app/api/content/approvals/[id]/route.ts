import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { cookies } from 'next/headers'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')?.value
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify session cookie with the correct issuer
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, {
      issuer: 'https://session.firebase.google.com/blue-oak-marketing'
    })

    const userId = decodedClaims.uid
    console.log('User ID:', userId)
    console.log('Custom claims:', decodedClaims)

    // Check if user has admin role in custom claims
    if (decodedClaims.role !== 'admin') {
      return NextResponse.json(
        { error: 'You do not have permission to view content approvals' },
        { status: 403 }
      )
    }

    const docRef = adminDb.collection('content-approvals').doc(params.id)
    const docSnap = await docRef.get()
    
    if (!docSnap.exists) {
      return NextResponse.json(
        { error: 'Content approval not found' },
        { status: 404 }
      )
    }

    const data = docSnap.data()
    const approval = {
      id: docSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    }

    return NextResponse.json(approval)
  } catch (error) {
    console.error('Error fetching approval:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content approval' },
      { status: 500 }
    )
  }
} 