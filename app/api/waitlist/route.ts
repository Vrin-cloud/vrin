import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = process.env.NOTION_WAITLIST_DB_ID!;

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email, company } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email is required.' },
        { status: 400 }
      );
    }

    // Create new entry (dedup handled in Notion)
    await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        Email: {
          title: [{ text: { content: email.trim().toLowerCase() } }],
        },
        Name: {
          rich_text: (firstName || lastName)
            ? [{ text: { content: `${(firstName || '').trim()} ${(lastName || '').trim()}`.trim() } }]
            : [],
        },
        Company: {
          rich_text: company ? [{ text: { content: company.trim() } }] : [],
        },
        Status: {
          select: { name: 'Waitlisted' },
        },
      },
    });

    return NextResponse.json(
      { success: true, message: 'You\'re on the list! We\'ll reach out when it\'s your turn.' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
