'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, ArrowUpRight } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

type Plan = {
  name: string;
  tagline: string;
  price?: string;
  note: string;
  features: string[];
  cta: string;
  action: 'signup' | 'contact';
  feature?: boolean;
};

const plans: Plan[] = [
  {
    name: 'Builder',
    tagline: 'For individuals exploring reasoning APIs.',
    price: '$0',
    note: 'free forever',
    features: [
      '100k chunks / 100k edges',
      '5k queries / month',
      'Shared reasoning infra',
      'API key authentication',
      'Community support',
    ],
    cta: 'Start free',
    action: 'signup',
  },
  {
    name: 'Team',
    tagline: 'For product teams shipping agents with context.',
    price: 'Custom',
    note: 'scales with usage',
    features: [
      '2M chunks / 3M edges',
      '100k queries / month',
      'Dedicated indices',
      'Full CBOM & TTL',
      'Connectors: Postgres, Drive, Notion',
      'Email support · 48h SLA',
    ],
    cta: 'Talk to sales',
    action: 'contact',
    feature: true,
  },
  {
    name: 'Enterprise',
    tagline: 'For regulated orgs with data-sovereignty requirements.',
    price: 'Custom',
    note: 'BYOC · VPC · on-prem',
    features: [
      'Unlimited chunks / edges',
      'Custom queries, SLA-backed',
      'Private VPC or on-prem',
      'SSO · SAML · SCIM',
      'Data residency & audit packs',
      'Dedicated TAM & DSE',
    ],
    cta: 'Contact us',
    action: 'contact',
  },
];

export function PricingV2({ openContactForm }: { openContactForm: (s: string) => void }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  const handle = (p: Plan) => {
    if (p.action === 'signup') {
      window.location.href = '/waitlist';
    } else {
      window.open('https://cal.com/vedant-vrin/book-a-demo', '_blank');
    }
  };

  return (
    <section id="pricing" className="relative bg-vrin-paper py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="container relative z-10">
        <div className="max-w-4xl mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="eyebrow text-vrin-blue">Pricing</span>
            <span className="hairline flex-1" />
          </div>

          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.0] tracking-[-0.03em] text-vrin-charcoal">
            Start free.
            <br />
            <span className="serif-italic text-vrin-blue">Scale</span> when your agent does.
          </h2>

          <p className="mt-6 max-w-2xl text-lg text-vrin-charcoal/65 leading-relaxed">
            Every plan ships with the full reasoning engine. You choose the capacity and
            the deployment surface.
          </p>
        </div>

        <div ref={ref} className="grid md:grid-cols-3 gap-5">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.1, ease }}
              className={`group relative rounded-3xl p-8 md:p-10 flex flex-col transition-all duration-500 ${
                p.feature
                  ? 'bg-vrin-charcoal text-vrin-cream border border-vrin-charcoal'
                  : 'bg-vrin-cream/70 border border-vrin-charcoal/10 hover:border-vrin-charcoal/25'
              }`}
            >
              {p.feature && (
                <div className="absolute top-5 right-5 text-[10px] font-mono tracking-[0.18em] uppercase px-3 py-1 rounded-full bg-vrin-sage/20 text-vrin-sage border border-vrin-sage/30">
                  Most chosen
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`font-display text-3xl leading-none ${
                    p.feature ? 'text-vrin-cream' : 'text-vrin-charcoal'
                  }`}
                >
                  {p.name}
                </h3>
                <p
                  className={`mt-2 text-sm leading-relaxed ${
                    p.feature ? 'text-vrin-cream/60' : 'text-vrin-charcoal/55'
                  }`}
                >
                  {p.tagline}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`font-display text-5xl leading-none ${
                      p.feature ? 'text-vrin-cream' : 'text-vrin-charcoal'
                    }`}
                  >
                    {p.price}
                  </span>
                  <span
                    className={`text-xs font-mono tracking-wider ${
                      p.feature ? 'text-vrin-cream/50' : 'text-vrin-charcoal/40'
                    }`}
                  >
                    {p.note}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-10">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        p.feature ? 'text-vrin-sage' : 'text-vrin-blue'
                      }`}
                    />
                    <span
                      className={
                        p.feature ? 'text-vrin-cream/80' : 'text-vrin-charcoal/75'
                      }
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handle(p)}
                className={`mt-auto group/btn inline-flex items-center justify-between gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300 ${
                  p.feature
                    ? 'bg-vrin-sage text-vrin-ink hover:bg-vrin-cream'
                    : 'bg-vrin-charcoal text-vrin-cream hover:bg-vrin-blue'
                }`}
              >
                {p.cta}
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:rotate-45" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Fine print — "all plans include" */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease }}
          className="mt-16 grid md:grid-cols-2 gap-10 pt-10 border-t border-vrin-charcoal/10"
        >
          <div>
            <p className="eyebrow text-vrin-blue mb-4">Every plan includes</p>
            <ul className="space-y-2 text-sm text-vrin-charcoal/65">
              {[
                'Multi-hop graph reasoning',
                'Temporal fact versioning',
                'Source-level provenance',
                'Model-agnostic LLM routing',
                'Cohere, Voyage, Bedrock embeddings',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-vrin-blue" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-vrin-blue mb-4">Security &amp; deployment</p>
            <ul className="space-y-2 text-sm text-vrin-charcoal/65">
              {[
                'Hybrid cloud — BYOC or shared',
                'Enterprise keys never leave your VPC',
                'SOC 2 Type II (in progress)',
                'Air-gapped deployment available',
                'EU, US, APAC data residency',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-vrin-blue" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
