import { Suspense } from 'react';
import ActivateContent from './activate-content';

export const metadata = {
  title: 'Approve CLI Access — Vrin',
  description: 'Approve a command-line tool to access your Vrin workspace.',
};

export default function ActivatePage() {
  return (
    <Suspense fallback={<ActivateFallback />}>
      <ActivateContent />
    </Suspense>
  );
}

function ActivateFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-sm text-neutral-500">Loading…</div>
    </div>
  );
}
