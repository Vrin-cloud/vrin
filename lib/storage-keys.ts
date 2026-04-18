/**
 * Central registry for every `localStorage` key used in this app.
 *
 * Why: previously keys were string-literals scattered across components/hooks.
 * Renaming, auditing, or clearing them was painful. Register here first; import
 * and reference everywhere else.
 *
 * Convention: snake_case. `vrin_*` prefix for app-owned keys. `enterprise_*`
 * for enterprise portal scope.
 *
 * Adding a key:
 * 1. Add the constant here with a JSDoc comment explaining what it stores.
 * 2. Import `STORAGE_KEYS` in your hook/component.
 * 3. Reference via `STORAGE_KEYS.VRIN_API_KEY`, never a literal.
 */

export const STORAGE_KEYS = {
  // --- App-level auth ---
  /** User API key (Bearer token) — used by every apiCall. */
  VRIN_API_KEY: 'vrin_api_key',
  /** Serialized user profile {id, email, name, ...}. */
  VRIN_USER: 'vrin_user',
  /** Stytch session artifact — used by app/auth flows. */
  VRIN_STYTCH_AUTH: 'vrin_stytch_auth',
  /** Legacy auth container — TODO: audit + remove. */
  VRIN_AUTH: 'vrin_auth',
  /** Generic token (legacy) — TODO: audit + remove. */
  AUTH_TOKEN: 'auth_token',

  // --- Enterprise portal ---
  /** Enterprise-scoped API key (vrin_ent_ prefix). */
  ENTERPRISE_API_KEY: 'enterprise_api_key',
  /** Enterprise session token. */
  ENTERPRISE_TOKEN: 'enterprise_token',
  /** Enterprise user profile. */
  ENTERPRISE_USER: 'enterprise_user',

  // --- Chat UI ---
  /** Currently active chat session id for resume. */
  VRIN_CHAT_SESSION_ID: 'vrin_chat_session_id',
  /** Locally cached chat messages (temporary / pre-persist). */
  VRIN_CHAT_MESSAGES: 'vrin_chat_messages',

  // --- OAuth / redirects ---
  /** Where to return after OAuth redirect completes. */
  OAUTH_RETURN_TO: 'oauth_return_to',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

/**
 * Typed wrappers — optional. Prefer these over raw `localStorage.getItem(STORAGE_KEYS.X)`
 * when the value is JSON-serialized.
 */
export const storage = {
  get(key: StorageKey): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  },
  set(key: StorageKey, value: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  },
  remove(key: StorageKey): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },
  getJson<T>(key: StorageKey): T | null {
    const raw = storage.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setJson(key: StorageKey, value: unknown): void {
    storage.set(key, JSON.stringify(value));
  },
};
