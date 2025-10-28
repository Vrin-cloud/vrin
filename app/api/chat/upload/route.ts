import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api';

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    // Get FormData from request
    const formData = await request.formData();

    console.log('Proxying file upload request');

    // Forward to chat backend
    const response = await fetch(`${API_CONFIG.CHAT_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': authorization,
        'Accept': 'application/json'
        // Don't set Content-Type - fetch will set it with boundary for FormData
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Upload backend error:', data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Upload proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
