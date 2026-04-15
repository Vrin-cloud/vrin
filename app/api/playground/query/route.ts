import { NextRequest } from 'next/server';
import { API_CONFIG } from '@/config/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Simple in-memory rate limiter (resets on deploy)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // queries per hour
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
    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { query, retrieval_mode = 'full', scenario_id } = body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate retrieval_mode
    if (!['full', 'vector_only'].includes(retrieval_mode)) {
      return new Response(
        JSON.stringify({ error: 'retrieval_mode must be "full" or "vector_only"' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Per-scenario API key routing — server-side only, never exposed to client
    const scenarioApiKeys: Record<string, string | undefined> = {
      'ai-research': process.env.AI_RESEARCH_VRIN_API_KEY,
    };
    const demoApiKey = scenarioApiKeys[scenario_id as string] || process.env.DEMO_VRIN_API_KEY;
    if (!demoApiKey) {
      return new Response(
        JSON.stringify({ error: 'Playground not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const backendUrl = `${API_CONFIG.RAG_BASE_URL}/query`;

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${demoApiKey}`,
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        query: query.trim(),
        stream: true,
        retrieval_mode,
        model: 'gpt-5.2',
        include_summary: true,
      }),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Backend query failed' }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Stream the SSE response through
    if (response.body) {
      return new Response(response.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    return new Response(
      JSON.stringify({ error: 'No response body' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
