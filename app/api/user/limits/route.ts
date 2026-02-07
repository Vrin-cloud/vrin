// User Limits API - Proxy route to backend /api/user/limits endpoint
// Returns: plan, usage, limits, features, allowed_models

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api';

export async function GET(request: NextRequest) {
  try {
    // Get authorization header (API key)
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    console.log('Proxying user limits request to backend');

    // Proxy to backend auth handler /api/user/limits endpoint
    const response = await fetch(
      `${API_CONFIG.AUTH_BASE_URL}/api/user/limits`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorization,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('User limits fetch error:', response.status, errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }

      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    console.log('User limits fetched:', data.plan, data.success);

    return NextResponse.json(data);
  } catch (error) {
    console.error('User limits proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
