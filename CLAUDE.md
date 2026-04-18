# CLAUDE.md — VRIN Frontend

Next.js 15 + React 19 application serving the VRIN marketing site, user dashboard, and enterprise portal. When in tension, choose **reliable over clever**. Match existing patterns before inventing new ones.

---

## Task Resolver

Routing table for work. Pick the skill that matches the user's intent.

| If the user asks to… | Use |
|---|---|
| Ship a new UI component (shadcn/Radix-wrapped) | skill `ship-component` |
| Wire a new TanStack Query hook to a backend endpoint | skill `wire-api-hook` |
| Add a new enterprise portal page (auth guard + form + API wire) | skill `add-enterprise-page` |
| Investigate a UI bug (blank screen, network error, SSE issue) | skill `investigate-ui-bug` |
| Investigate a file / module / concept and produce a report | skill `investigate` |
| Diarize a session | skill `diarize` |
| Codify a lesson as feedback memory | skill `codify` |
| Propose improvements to a skill based on failure cases | skill `improve` |
| Audit resolver health | skill `check-resolvable` |
| Run trigger-evals | skill `eval-triggers` |

If none match, answer directly. Do NOT force a skill to fire.

## Filing Resolver

All file placement is governed by [`.claude/RESOLVER.md`](./.claude/RESOLVER.md). Every skill that writes files reads it first. Misfiling traps in [`.claude/_filing-rules.md`](./.claude/_filing-rules.md). New content types go through the unknown-type protocol — STOP, propose, confirm, then write.

---

## Hard Rules

- **Next.js 15 App Router, React 19, TypeScript 5 strict.** Never mix with Pages Router.
- **Every API call goes through `config/api.ts::apiCall()`.** Add endpoints to `API_CONFIG.ENDPOINTS` first — never hardcode a URL in a component or hook.
- **Every `localStorage` key lives in `lib/storage-keys.ts`.** Import `STORAGE_KEYS` / `storage` — never string-literal `localStorage.getItem('vrin_foo')` in app code.
- **Every `/enterprise/*` page** inherits from `app/enterprise/layout.tsx` which enforces Stytch auth. New enterprise routes live under that layout.
- **Client-only code** marks `'use client'` at the top of the file. Browser-only libraries (Socket.IO, `window`, `localStorage`) are dynamic-imported where possible.
- **Styling**: Tailwind + CVA for variant composition. Never inline hex colors. Use `cn()` from `@/lib/utils` for class merging.
- **Theming**: dark/light via `next-themes`. Don't branch on `document.theme` manually.
- **Format on save** (user configures locally). No Prettier config in repo yet — match existing indentation and import order.

---

## Patterns (references to imitate, not prose to read)

### Hook template
See `hooks/use-api-keys.ts` for the canonical TanStack Query hook pattern:
- `queryKey: ['domain-name', apiKey, ...deps]`
- `queryFn: async () => apiCall(endpoint, {}, apiKey)`
- `enabled: !!apiKey && isAuthenticated`
- `staleTime: 30_000` (short) or `5 * 60 * 1000` (for rarely-changing data, see `use-knowledge-graph.ts`)
- `refetchOnWindowFocus: false`
- `retry: 2` with exponential backoff

Mutations use `useMutation` + `queryClient.invalidateQueries([...])` on success.

### Component template
See `components/ui/button.tsx` for the canonical shadcn/Radix pattern:
- `class-variance-authority` (`cva`) for variant/size composition
- `@radix-ui/react-slot` for `asChild` polymorphism
- `cn()` for class merging from `@/lib/utils`
- `forwardRef` with typed props extending the Radix or native element

Feature components live in `components/<feature>/`; shadcn primitives only in `components/ui/`.

### Page template
See `app/chat/page.tsx` for a canonical client-side page:
- `'use client'` at top
- `framer-motion` for enter/exit animations
- `lucide-react` icons (wholesale import is fine)
- Custom hooks for data (not inline `useEffect` + `fetch`)

App Router layouts handle auth guards (especially under `app/enterprise/`).

### Real-time pattern
See `hooks/use-real-time-updates.ts` for Socket.IO setup:
- Dynamic import to avoid SSR
- Auto-reconnect with capped attempts
- Typed event subscriptions (`kg_update`, `conflict_update`, `statistics_update`)
- `useRef` for socket persistence; local state for UI reactivity

---

## Change Protocol

For non-trivial changes, **before coding**:
1. Restate the problem + constraints in 3–5 bullets
2. Note options considered and chosen approach with rationale
3. Call out risks: SSR breakage, auth flow regressions, perf, accessibility
4. Describe rollback plan if applicable

Default to **additive, incremental, reversible** changes. Never break public routes without a redirect (`next.config.ts` already has some — check before renaming).

---

## Compact Instructions

When compacting, preserve:
- Current task list and status
- Files modified this session
- Component/hook/page conventions applied
- Any SSR or auth-guard gotchas hit

Write summary to `.claude/checkpoints/latest.md` before compacting. Overwrite each session.

---

## Related repos

- **Backend** (Python Lambdas, Hybrid RAG engine): `/Users/Vedant/Documents/vrin-engine` — see that repo's `CLAUDE.md` for API shapes, auth routing (`vrin_` vs `vrin_ent_`), enterprise data sovereignty rules, and deployment procedures.

The frontend talks to the backend via AWS API Gateway endpoints listed in `config/api.ts`. Auth is via Stytch (user) + Bearer token API keys. File uploads use the dedicated `/upload` endpoint on `cg7yind3j5` (vrin-chat-api-dev), NOT the streaming Lambda.
