'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Terminal, Code2, Zap, MessagesSquare } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

type Surface = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  code: React.ReactNode;
};

const surfaces: Surface[] = [
  {
    id: 'sdk',
    label: 'SDK',
    icon: Code2,
    tagline: 'Drop Vrin into your agent in four lines.',
    code: (
      <pre className="font-mono text-[13px] leading-[1.7]">
        <code>
          <span className="text-[#C084FC]">from</span>{' '}
          <span className="text-[#F9F7F2]">vrin</span>{' '}
          <span className="text-[#C084FC]">import</span>{' '}
          <span className="text-[#67E8F9]">VRINClient</span>
          {'\n\n'}
          <span className="text-[#F9F7F2]/80">client = </span>
          <span className="text-[#67E8F9]">VRINClient</span>
          <span className="text-[#F9F7F2]/80">(api_key=</span>
          <span className="text-[#86EFAC]">&quot;vrin_...&quot;</span>
          <span className="text-[#F9F7F2]/80">)</span>
          {'\n\n'}
          <span className="text-[#64748B] italic"># one call. graph traversal + vector + reasoning.</span>
          {'\n'}
          <span className="text-[#F9F7F2]/80">result = client.</span>
          <span className="text-[#67E8F9]">query</span>
          <span className="text-[#F9F7F2]/80">(</span>
          {'\n    '}
          <span className="text-[#86EFAC]">
            &quot;How did Q4 revenue compare to Q3 across all subsidiaries?&quot;
          </span>
          {'\n'}
          <span className="text-[#F9F7F2]/80">)</span>
          {'\n\n'}
          <span className="text-[#F9F7F2]/80">result.</span>
          <span className="text-[#67E8F9]">summary</span>{' '}
          <span className="text-[#64748B] italic"># cited, time-aware answer</span>
          {'\n'}
          <span className="text-[#F9F7F2]/80">result.</span>
          <span className="text-[#67E8F9]">sources</span>{' '}
          <span className="text-[#64748B] italic"># fact-level provenance</span>
        </code>
      </pre>
    ),
  },
  {
    id: 'cli',
    label: 'CLI',
    icon: Terminal,
    tagline: 'The full knowledge layer, in a single binary.',
    code: (
      <pre className="font-mono text-[13px] leading-[1.7]">
        <code>
          <span className="text-[#64748B]">$</span>{' '}
          <span className="text-[#86EFAC]">vrin insert</span>{' '}
          <span className="text-[#F9F7F2]">./acme-q4.pdf --title &quot;Acme Q4 2025&quot;</span>
          {'\n'}
          <span className="text-[#67E8F9]">✓</span>{' '}
          <span className="text-[#F9F7F2]/70">Ingested · 127 facts · 42 entities · 4 relationships</span>
          {'\n\n'}
          <span className="text-[#64748B]">$</span>{' '}
          <span className="text-[#86EFAC]">vrin query</span>{' '}
          <span className="text-[#F9F7F2]">&quot;what drove the margin expansion?&quot;</span>
          {'\n'}
          <span className="text-[#67E8F9]">✓</span>{' '}
          <span className="text-[#F9F7F2]/70">Traversed 3 hops · 1.8s</span>
          {'\n\n'}
          <span className="text-[#C084FC]">Answer</span>
          <span className="text-[#F9F7F2]/70">: SG&amp;A reduction of 8.2% paired with</span>
          {'\n'}
          <span className="text-[#F9F7F2]/70">a 4.1% gross-margin lift from the new EU supplier...</span>
          {'\n\n'}
          <span className="text-[#64748B]">[1] 10-K § 4.2  [2] Earnings call · 2025-11-08</span>
        </code>
      </pre>
    ),
  },
  {
    id: 'mcp',
    label: 'MCP',
    icon: Zap,
    tagline: 'Native tool in Claude, Cursor, Windsurf, and Desktop agents.',
    code: (
      <pre className="font-mono text-[13px] leading-[1.7]">
        <code>
          <span className="text-[#64748B] italic"># ~/.claude/mcp_config.json</span>
          {'\n'}
          <span className="text-[#F9F7F2]/80">&#123;</span>
          {'\n  '}
          <span className="text-[#86EFAC]">&quot;mcpServers&quot;</span>
          <span className="text-[#F9F7F2]/80">: &#123;</span>
          {'\n    '}
          <span className="text-[#86EFAC]">&quot;vrin&quot;</span>
          <span className="text-[#F9F7F2]/80">: &#123;</span>
          {'\n      '}
          <span className="text-[#86EFAC]">&quot;command&quot;</span>
          <span className="text-[#F9F7F2]/80">: </span>
          <span className="text-[#86EFAC]">&quot;npx&quot;</span>
          <span className="text-[#F9F7F2]/80">,</span>
          {'\n      '}
          <span className="text-[#86EFAC]">&quot;args&quot;</span>
          <span className="text-[#F9F7F2]/80">: [</span>
          <span className="text-[#86EFAC]">&quot;-y&quot;</span>
          <span className="text-[#F9F7F2]/80">, </span>
          <span className="text-[#86EFAC]">&quot;@vrin/mcp&quot;</span>
          <span className="text-[#F9F7F2]/80">]</span>
          {'\n    '}
          <span className="text-[#F9F7F2]/80">&#125;</span>
          {'\n  '}
          <span className="text-[#F9F7F2]/80">&#125;</span>
          {'\n'}
          <span className="text-[#F9F7F2]/80">&#125;</span>
          {'\n\n'}
          <span className="text-[#64748B] italic"># Exposed tools</span>
          {'\n'}
          <span className="text-[#67E8F9]">vrin_query_async</span>{' '}
          <span className="text-[#64748B]">· reason over the graph</span>
          {'\n'}
          <span className="text-[#67E8F9]">vrin_search_entities</span>{' '}
          <span className="text-[#64748B]">· find by name</span>
          {'\n'}
          <span className="text-[#67E8F9]">vrin_get_facts</span>{' '}
          <span className="text-[#64748B]">· structured facts</span>
        </code>
      </pre>
    ),
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: MessagesSquare,
    tagline: 'A conversational surface for teams that don\'t write code.',
    code: (
      <div className="font-sans text-[13px] leading-[1.65] space-y-3">
        <div className="flex gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full bg-vrin-blue/30 text-vrin-cream text-[10px] flex items-center justify-center font-mono">
            You
          </span>
          <p className="text-vrin-cream/90">
            How did Acme&apos;s EU expansion affect margins over the last 3 quarters?
          </p>
        </div>
        <div className="flex gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full bg-vrin-sage/40 text-vrin-ink text-[10px] flex items-center justify-center font-mono">
            V
          </span>
          <div className="space-y-2 text-vrin-cream/80">
            <p>
              EU margins expanded from <span className="text-vrin-sage">22.1%</span> in Q2 to{' '}
              <span className="text-vrin-sage">26.3%</span> in Q4, driven primarily by the
              Bavarian supplier contract signed August 2025.
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[10px] font-mono text-vrin-cream/40">sources:</span>
              {['10-K § 4', 'Board memo · Aug', 'CFO letter'].map((s) => (
                <span
                  key={s}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-vrin-cream/15 text-vrin-cream/60"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export function Surfaces() {
  const [active, setActive] = useState(surfaces[0].id);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const current = surfaces.find((s) => s.id === active)!;

  return (
    <section className="relative bg-vrin-paper py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="max-w-4xl mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="eyebrow text-vrin-blue">Surfaces</span>
            <span className="hairline flex-1" />
          </div>

          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.0] tracking-[-0.03em] text-vrin-charcoal">
            Use Vrin the way
            <br />
            your <span className="serif-italic text-vrin-blue">agent</span> already works.
          </h2>

          <p className="mt-6 max-w-2xl text-lg text-vrin-charcoal/65 leading-relaxed">
            One reasoning engine, four surfaces. Swap between them without re-indexing a
            single document.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {surfaces.map((s) => {
            const Icon = s.icon;
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`group relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-vrin-charcoal text-vrin-cream shadow-sm'
                    : 'border border-vrin-charcoal/15 text-vrin-charcoal/70 hover:border-vrin-charcoal/40 hover:text-vrin-charcoal'
                }`}
              >
                <Icon className="w-4 h-4" />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Code panel */}
        <div className="relative rounded-3xl border border-vrin-charcoal/10 bg-vrin-ink overflow-hidden">
          {/* top bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-vrin-cream/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/50" />
            </div>
            <span className="text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-cream/40">
              vrin · {current.id}
            </span>
            <span className="text-[11px] font-mono text-vrin-cream/30">
              v1.2.0
            </span>
          </div>

          {/* code body */}
          <div className="p-8 min-h-[340px] relative">
            <div className="absolute inset-0 grid-faint-dark opacity-30 pointer-events-none" />
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease }}
                className="relative z-10"
              >
                {current.code}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* tagline footer */}
          <div className="flex items-center gap-3 px-5 py-3 border-t border-vrin-cream/10 text-[13px] text-vrin-cream/60">
            <span className="w-1 h-1 rounded-full bg-vrin-sage" />
            <span className="serif-italic">{current.tagline}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
