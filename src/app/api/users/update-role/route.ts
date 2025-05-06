import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

export async function POST(request: Request) {
  try {
    const { uid, role } = await request.json()

    if (!uid || !role) {
      return NextResponse.json(
        { error: 'Missing required fields', details: { uid, role } },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['admin', 'client']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Role must be either admin or client.' },
        { status: 400 }
      )
    }

    console.log('Updating role for user:', uid, 'to:', role)

    // Update custom claims
    try {
      await adminAuth.setCustomUserClaims(uid, { role })
      console.log('Custom claims updated successfully')
    } catch (error) {
      console.error('Error updating custom claims:', error)
      return NextResponse.json(
        { error: 'Failed to update custom claims', details: error },
        { status: 500 }
      )
    }

    // Force token refresh
    try {
      await adminAuth.revokeRefreshTokens(uid)
      console.log('Refresh tokens revoked successfully')
    } catch (error) {
      console.error('Error revoking refresh tokens:', error)
      // Continue execution as this is not critical
    }

    // Update Firestore document
    try {
      await adminDb.collection('users').doc(uid).update({
        role,
        updatedAt: new Date()
      })
      console.log('Firestore document updated successfully')
    } catch (error) {
      console.error('Error updating Firestore document:', error)
      // Continue execution as this is not critical
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in update-role endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to update user role', details: error },
      { status: 500 }
    )
  }
} 