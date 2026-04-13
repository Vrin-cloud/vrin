import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = process.env.NOTION_ENTERPRISE_DB_ID!;

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW = 60 * 60 * 1000;

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
    const { firstName, lastName, email, company, role, companySize, useCase } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid work email is required.' }, { status: 400 });
    }
    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }
    if (!company) {
      return NextResponse.json({ error: 'Company name is required.' }, { status: 400 });
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        Name: {
          title: [{ text: { content: fullName } }],
        },
        Email: {
          rich_text: [{ text: { content: email.trim().toLowerCase() } }],
        },
        Company: {
          rich_text: [{ text: { content: company.trim() } }],
        },
        Role: {
          rich_text: role ? [{ text: { content: role.trim() } }] : [],
        },
        'Company Size': companySize ? {
          select: { name: companySize },
        } : { select: null },
        'Use Case': {
          rich_text: useCase ? [{ text: { content: useCase.trim() } }] : [],
        },
        Status: {
          select: { name: 'New' },
        },
      },
    });

    return NextResponse.json(
      { success: true, message: `Thanks, ${firstName.trim()}! We'll be in touch within 24 hours.` },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
