'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle, Terminal } from 'lucide-react';
import { useStytchB2BClient, useStytchMemberSession } from '@stytch/nextjs/b2b';

type Phase = 'loading' | 'needs_code' | 'confirm' | 'approving' | 'approved' | 'denied' | 'error';

export default function ActivateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stytch = useStytchB2BClient();
  const { session } = useStytchMemberSession();

  const initialCode = (searchParams.get('user_code') || '').trim().toUpperCase();
  const [userCode, setUserCode] = useState(initialCode);
  const [phase, setPhase] = useState<Phase>(initialCode ? 'loading' : 'needs_code');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Once we know the auth state + have a code, verify it.
  useEffect(() => {
    if (phase !== 'loading' || !userCode) return;
    if (!stytch) return;

    // If not signed in, send to the main auth page and come back here.
    if (!session) {
      const next = `/activate?user_code=${encodeURIComponent(userCode)}`;
      router.replace(`/auth?return_to=${encodeURIComponent(next)}`);
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `/api/auth/device/verify?user_code=${encodeURIComponent(userCode)}`,
        );
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(friendlyError(data.error));
          setPhase('error');
          return;
        }
        setPhase('confirm');
      } catch (e: any) {
        setErrorMsg('Could not reach the authentication service. Please try again.');
        setPhase('error');
      }
    })();
  }, [phase, userCode, stytch, session, router]);

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = userCode.trim().toUpperCase();
    if (!clean) return;
    setUserCode(clean);
    setPhase('loading');
  };

  const approve = async () => {
    setPhase('approving');
    try {
      const res = await fetch('/api/auth/device/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_code: userCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(friendlyError(data.error));
        setPhase('error');
        return;
      }
      setPhase('approved');
    } catch (e: any) {
      setErrorMsg('Could not reach the authentication service. Please try again.');
      setPhase('error');
    }
  };

  const deny = async () => {
    try {
      await fetch('/api/auth/device/deny', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_code: userCode }),
      });
    } catch {
      // best-effort
    }
    setPhase('denied');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-neutral-100 p-2">
            <Terminal className="h-5 w-5 text-neutral-700" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900">Approve CLI access</h1>
            <p className="text-xs text-neutral-500">Device authorization</p>
          </div>
        </div>

        {phase === 'needs_code' && (
          <form onSubmit={submitCode} className="space-y-4">
            <label className="block">
              <span className="text-sm text-neutral-700">Enter the code shown in your terminal</span>
              <input
                autoFocus
                value={userCode}
                onChange={(e) => setUserCode(e.target.value.toUpperCase())}
                placeholder="XXXX-XXXX"
                className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 font-mono text-base tracking-wider text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </label>
            <button
              type="submit"
              disabled={!userCode.trim()}
              className="w-full rounded-lg bg-neutral-900 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              Continue
            </button>
          </form>
        )}

        {phase === 'loading' && (
          <div className="flex flex-col items-center gap-3 py-6 text-sm text-neutral-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Checking code…</span>
          </div>
        )}

        {phase === 'confirm' && (
          <div className="space-y-5">
            <p className="text-sm text-neutral-700">
              A command-line tool is requesting access to your Vrin workspace.
              Approving will let it query and manage your knowledge base on your behalf.
            </p>
            <div className="rounded-lg bg-neutral-50 px-4 py-3 text-center">
              <div className="text-xs uppercase tracking-wider text-neutral-500">Code</div>
              <div className="mt-1 font-mono text-xl tracking-widest text-neutral-900">{userCode}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={deny}
                className="rounded-lg border border-neutral-300 bg-white py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Deny
              </button>
              <button
                onClick={approve}
                className="rounded-lg bg-neutral-900 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Approve
              </button>
            </div>
            <p className="text-center text-xs text-neutral-500">
              Only approve if you just ran <code className="rounded bg-neutral-100 px-1 py-0.5">vrin login</code> yourself.
            </p>
          </div>
        )}

        {phase === 'approving' && (
          <div className="flex flex-col items-center gap-3 py-6 text-sm text-neutral-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Approving…</span>
          </div>
        )}

        {phase === 'approved' && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
            <div className="text-base font-medium text-neutral-900">Approved</div>
            <div className="text-sm text-neutral-600">
              You can close this tab and return to your terminal.
            </div>
          </div>
        )}

        {phase === 'denied' && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <XCircle className="h-10 w-10 text-neutral-400" />
            <div className="text-base font-medium text-neutral-900">Denied</div>
            <div className="text-sm text-neutral-600">
              The CLI will not receive access. You can close this tab.
            </div>
          </div>
        )}

        {phase === 'error' && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <XCircle className="h-10 w-10 text-red-500" />
            <div className="text-base font-medium text-neutral-900">{errorMsg || 'Something went wrong.'}</div>
            <button
              onClick={() => {
                setUserCode('');
                setErrorMsg('');
                setPhase('needs_code');
              }}
              className="mt-2 text-sm text-neutral-600 underline hover:text-neutral-900"
            >
              Try a different code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function friendlyError(code?: string): string {
  switch (code) {
    case 'invalid_code':
      return "That code isn't recognized. Double-check the code shown in your terminal.";
    case 'expired_code':
    case 'expired_token':
      return 'That code has expired. Run `vrin login` again to get a new one.';
    case 'already_used':
      return 'That code was already used. Run `vrin login` again to get a new one.';
    case 'invalid_session':
      return 'Your session expired. Please sign in again and retry.';
    case 'user_not_linked':
      return 'Your Vrin account is not linked yet. Sign in via the website first.';
    default:
      return 'Something went wrong. Try again in a minute.';
  }
}
