import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { cookies } from 'next/headers'

export async function GET() {
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
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)

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

    // Get all content approvals using Admin SDK
    const approvalsRef = adminDb.collection('content-approvals')
    const snapshot = await approvalsRef.orderBy('createdAt', 'desc').get()
    
    const approvals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    }))

    return NextResponse.json(approvals)
  } catch (error) {
    console.error('Error fetching approvals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content approvals' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
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
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)

    const userId = decodedClaims.uid
    console.log('User ID:', userId)
    console.log('Custom claims:', decodedClaims)

    // Check if user has admin role in custom claims
    if (decodedClaims.role !== 'admin') {
      return NextResponse.json(
        { error: 'You do not have permission to create content approvals' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.description || !body.content || !body.type || !body.clientId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new content approval using Admin SDK
    const approvalRef = adminDb.collection('content-approvals')
    const docRef = await approvalRef.add({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
    })

    return NextResponse.json({
      id: docRef.id,
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
    })
  } catch (error) {
    console.error('Error creating approval:', error)
    return NextResponse.json(
      { error: 'Failed to create content approval' },
      { status: 500 }
    )
  }
} 