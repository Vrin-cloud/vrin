'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Plus,
  Copy,
  Trash2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useDashboardAuth } from '../../../components/dashboard/v2/shell/auth-context';

/**
 * Shape returned by GET /api/auth/api-keys (v2 contract).
 *
 * Raw keys are NEVER returned by the backend after the v2 cutover — only
 * hashes are stored. The raw key is shown exactly once at creation, in a
 * copy-once modal; subsequent visits render the prefix only (positive
 * identifier, not a secret). Users who lost the raw key rotate: create a
 * new one, then revoke the old.
 */
interface ApiKey {
  key_prefix: string;
  key_name?: string;
  environment?: string;
  status?: string;
  email?: string;
  created_at?: string | number | null;
  last_used_at?: string | number | null;
  expires_at?: string | number | null;
}

function formatDate(value?: string | number | null): string {
  if (!value) return '—';
  const asNumber = typeof value === 'number' || /^\d+$/.test(String(value));
  const raw = asNumber ? Number(value) * 1000 : value;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatRelative(value?: string | number | null): string {
  if (!value) return 'Never';
  return formatDate(value);
}

export function ModernApiKeysSection() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [revealedKey, setRevealedKey] = useState<{ raw: string; name: string } | null>(null);
  const [deletingPrefix, setDeletingPrefix] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ApiKey | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { authedFetch } = useDashboardAuth();

  useEffect(() => {
    fetchApiKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchApiKeys() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authedFetch('/api/auth/api-keys');
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch API keys');
      setApiKeys(data.api_keys || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateApiKey() {
    const name = newProjectName.trim();
    if (!name) {
      setError('Key name is required');
      return;
    }
    setIsCreating(true);
    setError(null);
    try {
      const response = await authedFetch('/api/auth/api-keys', {
        method: 'POST',
        body: JSON.stringify({ project_name: name }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to create API key');
      // The backend returns the raw key exactly once. Hand it to the reveal
      // modal so the user can copy + save it; once they close the modal
      // we never surface it again.
      const raw = data.api_key || data.api_key_value || '';
      setShowCreateModal(false);
      setNewProjectName('');
      setRevealedKey({ raw, name });
      await fetchApiKeys();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteApiKey(key: ApiKey) {
    setDeletingPrefix(key.key_prefix);
    setError(null);
    try {
      const response = await authedFetch('/api/auth/api-keys', {
        method: 'DELETE',
        body: JSON.stringify({ key_prefix: key.key_prefix }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to revoke key');
      toast.success('Key revoked');
      setConfirmDelete(null);
      await fetchApiKeys();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeletingPrefix(null);
    }
  }

  async function copyToClipboard(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
      toast.success('Copied');
    } catch {
      toast.error('Copy failed');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Keys are shown in full exactly once at creation. After that we only keep a hash —
            rotate the key if you lost the original.
          </p>
        </div>
        <motion.button
          onClick={() => setShowCreateModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          New key
        </motion.button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-md border border-destructive/30 bg-destructive/5 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="text-xs underline">
            dismiss
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border/60 bg-surface-2/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="text-left font-medium px-4 py-3">Name</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-left font-medium px-4 py-3">Secret key</th>
                <th className="text-left font-medium px-4 py-3">Created</th>
                <th className="text-left font-medium px-4 py-3">Last used</th>
                <th className="text-right font-medium px-4 py-3 w-[80px]" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    <RefreshCw className="w-4 h-4 animate-spin inline mr-2" />
                    Loading…
                  </td>
                </tr>
              ) : apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center">
                    <div className="inline-flex flex-col items-center gap-2 text-muted-foreground">
                      <Key className="w-5 h-5" />
                      <p className="text-sm text-foreground">No API keys yet</p>
                      <p className="text-xs">Click <span className="font-medium">New key</span> to create one.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                apiKeys.map((key) => {
                  const active = (key.status || 'active') === 'active';
                  const prefixLabel = `${key.key_prefix}…`;
                  return (
                    <tr key={key.key_prefix} className="hover:bg-surface-3/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">
                        {key.key_name || <span className="text-muted-foreground italic">unnamed</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-muted-foreground'}`}
                          />
                          <span className="capitalize">{key.status || 'active'}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {/* Prefix is a read-only identifier — not a secret,
                            not the full key. No copy affordance because there
                            is nothing useful to paste anywhere. The raw key
                            was shown once at creation and is gone. */}
                        <code className="font-mono text-xs text-muted-foreground">
                          {prefixLabel}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">{formatDate(key.created_at)}</td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">{formatRelative(key.last_used_at)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setConfirmDelete(key)}
                          disabled={deletingPrefix === key.key_prefix}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                          title="Revoke key"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-background rounded-xl p-6 max-w-md w-full shadow-xl border border-border/60"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-1">Create API key</h3>
              <p className="text-xs text-muted-foreground mb-4">
                You&apos;ll see the raw key once, then only the prefix.
              </p>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                Key name
              </label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g. Production API, Local development"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm outline-none focus:border-foreground/40"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newProjectName.trim() && !isCreating) handleCreateApiKey();
                }}
              />
              <div className="flex gap-2 pt-5">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 h-9 px-3 rounded-md border border-border text-sm hover:bg-surface-3"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateApiKey}
                  disabled={isCreating || !newProjectName.trim()}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-9 px-3 rounded-md bg-foreground text-background text-sm font-medium disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      Creating…
                    </>
                  ) : (
                    <>
                      <Key className="w-3.5 h-3.5" />
                      Create
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copy-once reveal modal — closing this wipes the raw key from memory */}
      <AnimatePresence>
        {revealedKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-background rounded-xl p-6 max-w-lg w-full shadow-xl border border-border/60"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Save this key now</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {revealedKey.name} · we never store the raw key, so you won&apos;t see it again.
                    If you lose it, create a new key and revoke this one.
                  </p>
                </div>
              </div>

              <div className="rounded-md border border-border bg-surface-3/50 p-3 flex items-center gap-2">
                <code className="flex-1 font-mono text-xs text-foreground break-all select-all">
                  {revealedKey.raw}
                </code>
                <button
                  onClick={() => copyToClipboard(revealedKey.raw, 'revealed')}
                  className="shrink-0 inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-border text-xs hover:bg-surface-3"
                >
                  {copiedId === 'revealed' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-end pt-5">
                <button
                  onClick={() => setRevealedKey(null)}
                  className="h-9 px-3 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90"
                >
                  I&apos;ve saved it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => deletingPrefix ? null : setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-background rounded-xl p-6 max-w-md w-full shadow-xl border border-border/60"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-1">Revoke API key?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                <span className="font-medium text-foreground">{confirmDelete.key_name || 'unnamed'}</span> ·{' '}
                <code className="font-mono text-xs">{confirmDelete.key_prefix}…</code>
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Any application using this key will start seeing 401 errors immediately. This can&apos;t be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setConfirmDelete(null)}
                  disabled={!!deletingPrefix}
                  className="h-9 px-3 rounded-md border border-border text-sm hover:bg-surface-3 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteApiKey(confirmDelete)}
                  disabled={!!deletingPrefix}
                  className="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {deletingPrefix ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
                      Revoking…
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      Revoke
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
