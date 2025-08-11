import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { custom_prompt, reasoning_focus, analysis_depth, confidence_threshold, max_reasoning_chains } = await request.json();

    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const apiKey = authHeader.substring(7); // Remove "Bearer " prefix

    // Forward to VRIN backend specialization endpoint
    const response = await fetch('https://thuiu23t0c.execute-api.us-east-1.amazonaws.com/dev/specialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        custom_prompt,
        reasoning_focus: reasoning_focus || ['general_analysis'],
        analysis_depth: analysis_depth || 'expert',
        confidence_threshold: confidence_threshold || 0.7,
        max_reasoning_chains: max_reasoning_chains || 10
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('VRIN backend specialization error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Specialization API route error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const apiKey = authHeader.substring(7); // Remove "Bearer " prefix

    // Forward to VRIN backend to get current specialization
    const response = await fetch('https://thuiu23t0c.execute-api.us-east-1.amazonaws.com/dev/specialize', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ success: false, error: 'No specialization configured' }, { status: 404 });
      }
      const errorText = await response.text();
      console.error('VRIN backend get specialization error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Get specialization API route error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}