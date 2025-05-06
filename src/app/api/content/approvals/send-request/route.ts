import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import sgMail from '@sendgrid/mail';
import { getApprovalRequestEmailTemplate } from '@/lib/email-templates';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function POST(request: Request) {
  try {
    const sessionCookie = await cookies().get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await getAuth().verifySessionCookie(sessionCookie);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { approvalId, clientEmail, title } = await request.json();
    if (!approvalId || !clientEmail || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the email template
    const emailHtml = getApprovalRequestEmailTemplate(title, approvalId);

    // Send the email
    const msg = {
      to: clientEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com',
      subject: `Content Approval Request: ${title}`,
      html: emailHtml,
    };

    await sgMail.send(msg);

    // Update the approval status in Firestore
    const db = getFirestore();
    await db.collection('content-approvals').doc(approvalId).update({
      status: 'pending',
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending approval request:', error);
    return NextResponse.json(
      { error: 'Failed to send approval request' },
      { status: 500 }
    );
  }
} 