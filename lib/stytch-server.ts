/**
 * Stytch B2B Server Client
 *
 * Server-side Stytch client for API routes that need to call
 * Stytch backend APIs (e.g., password auth, member lookup).
 */

import * as stytch from 'stytch';

let serverClient: stytch.B2BClient | null = null;

export function getStytchServerClient(): stytch.B2BClient {
  if (!serverClient) {
    const projectId = process.env.STYTCH_PROJECT_ID;
    const secret = process.env.STYTCH_SECRET;

    if (!projectId || !secret) {
      throw new Error(
        'STYTCH_PROJECT_ID and STYTCH_SECRET must be set in environment variables'
      );
    }

    const isTest = projectId.startsWith('project-test-');

    serverClient = new stytch.B2BClient({
      project_id: projectId,
      secret: secret,
      env: isTest ? 'https://test.stytch.com/' : 'https://api.stytch.com/',
    });
  }

  return serverClient;
}
