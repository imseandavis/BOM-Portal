import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

interface UptimeMonitor {
  id: string;
  friendly_name: string;
  url: string;
  status: number;
  type: number;
  custom_uptime_ratio: string;
  logs: Array<{
    datetime: string;
  }>;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await getAuth().verifySessionCookie(sessionCookie);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
      body: new URLSearchParams({
        api_key: process.env.UPTIMEROBOT_API_KEY || '',
        format: 'json',
        logs: '1',
        custom_uptime_ratios: '1-7-30',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch monitors from UptimeRobot');
    }

    const data = await response.json();
    
    if (data.stat !== 'ok') {
      throw new Error(data.error?.message || 'UptimeRobot API error');
    }

    return NextResponse.json({
      monitors: data.monitors.map((monitor: UptimeMonitor) => ({
        id: monitor.id,
        friendly_name: monitor.friendly_name,
        url: monitor.url,
        status: monitor.status,
        type: monitor.type,
        uptime_ratio: monitor.custom_uptime_ratio,
        last_uptime: monitor.logs[0]?.datetime,
      })),
    });
  } catch (error) {
    console.error('Error fetching monitors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monitors' },
      { status: 500 }
    );
  }
} 