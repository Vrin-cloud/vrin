'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

function LoadingState() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Connecting to VRiN...</p>
      </div>
    </div>
  );
}

const OAuthAuthorizeContent = dynamic(
  () => import('./authorize-content'),
  {
    ssr: false,
    loading: () => <LoadingState />,
  }
);

export default function OAuthAuthorizePage() {
  return <OAuthAuthorizeContent />;
}
