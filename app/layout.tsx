import type { Metadata } from "next"
import { Inter, Manrope } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })
const manrope = Manrope({
  subsets: ["latin"],
  variable: '--font-manrope',
  weight: ['400', '600', '700']
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.vrin.cloud'),
  title: {
    default: "Vrin - AI Deep Search & Reasoning Engine for Enterprise",
    template: "%s | Vrin"
  },
  description: "Vrin is the Cognitive Reasoning Core for teams & enterprises. Our AI Deep Search engine structures siloed data into entity-centric Knowledge Graphs, enabling multi-hop reasoning and cross-document insights with source-backed answers.",
  keywords: [
    // Primary positioning
    "AI deep search", "AI reasoning engine", "cognitive reasoning core", "enterprise AI search",
    "AI knowledge graph", "multi-hop reasoning", "cross-document reasoning",
    // Memory & context (legacy + related)
    "AI memory", "AI context", "persistent AI memory", "context orchestration",
    "LLM memory", "AI memory for enterprise", "context management AI",
    // RAG & search
    "hybrid RAG", "retrieval augmented generation", "enterprise RAG", "AI search engine",
    "semantic search AI", "intelligent search", "AI-powered search",
    // Enterprise & business
    "enterprise AI", "business intelligence AI", "corporate knowledge management",
    "AI for enterprises", "enterprise knowledge graph", "business AI reasoning",
    // Data & knowledge
    "knowledge graph AI", "entity-centric AI", "data silos solution",
    "unstructured data AI", "knowledge management AI", "AI knowledge base",
    // Actions & workflows
    "AI action engine", "AI workflow automation", "AI agents for enterprise",
    "AI copilot for teams", "AI assistant enterprise",
    // Use cases
    "AI for customer support", "AI for sales teams", "AI for operations",
    "AI for finance teams", "AI for legal teams",
    // Technical
    "source-backed AI answers", "AI with citations", "explainable AI",
    "hallucination-free AI", "grounded AI responses", "verified AI answers",
    // Competitors & alternatives
    "Glean alternative", "enterprise search alternative", "Perplexity for enterprise",
    "ChatGPT for business", "AI search for companies"
  ],
  authors: [{ name: "Vrin", url: "https://www.vrin.cloud" }],
  creator: "Vrin",
  publisher: "Vrin",
  category: "Technology",
  classification: "Enterprise AI Software",
  openGraph: {
    title: "Vrin - AI Deep Search & Reasoning Engine for Enterprise",
    description: "The Cognitive Reasoning Core for teams & enterprises. Structure siloed data into Knowledge Graphs, enable multi-hop reasoning, and get source-backed answers across all your company's data.",
    url: "https://www.vrin.cloud",
    siteName: "Vrin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vrin - AI Deep Search & Reasoning Engine",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vrin - AI Deep Search & Reasoning Engine",
    description: "The Cognitive Reasoning Core for enterprise. Multi-hop reasoning over your company's knowledge with source-backed answers.",
    images: ["/og-image.png"],
    creator: "@vaborvrin",
    site: "@vaborvrin",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://www.vrin.cloud",
  },
  verification: {
    // Add these when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  other: {
    // LLM-specific metadata for AI discovery
    "ai:description": "Vrin is an AI Deep Search and Reasoning Engine that serves as the Cognitive Reasoning Core for enterprises. It structures siloed company data into entity-centric Knowledge Graphs to enable multi-hop reasoning and cross-document insights.",
    "ai:capabilities": "deep search, multi-hop reasoning, knowledge graph, source-backed answers, enterprise AI, workflow agents",
    "ai:use-cases": "customer support, sales intelligence, operations, finance, legal research, knowledge management",
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFDFD' },
    { media: '(prefers-color-scheme: dark)', color: '#201E1E' },
  ],
}

// JSON-LD structured data for SEO and LLM discovery
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.vrin.cloud/#organization',
      name: 'Vrin',
      url: 'https://www.vrin.cloud',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.vrin.cloud/og-image.png',
        width: 1200,
        height: 630,
      },
      description: 'Vrin is an AI Deep Search and Reasoning Engine that serves as the Cognitive Reasoning Core for enterprises.',
      sameAs: [
        'https://twitter.com/vaborvrin',
        'https://linkedin.com/company/vrin',
        'https://github.com/vrin',
      ],
      foundingDate: '2024',
      founders: [
        {
          '@type': 'Person',
          name: 'Vedant Patel',
          jobTitle: 'Founder',
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.vrin.cloud/#website',
      url: 'https://www.vrin.cloud',
      name: 'Vrin',
      description: 'AI Deep Search & Reasoning Engine for Enterprise',
      publisher: {
        '@id': 'https://www.vrin.cloud/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.vrin.cloud/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.vrin.cloud/#software',
      name: 'Vrin',
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'Enterprise AI Software',
      operatingSystem: 'Web-based, Cloud',
      description: 'AI Deep Search and Reasoning Engine - The Cognitive Reasoning Core for teams & enterprises. Structures siloed data into entity-centric Knowledge Graphs enabling multi-hop reasoning and cross-document insights.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free tier available, enterprise plans available',
      },
      featureList: [
        'AI Deep Search across enterprise data',
        'Multi-hop reasoning over Knowledge Graphs',
        'Entity-centric data structuring',
        'Cross-document insights synthesis',
        'Source-backed answers with citations',
        'Workflow agents for automation',
        'Enterprise-grade security',
        'Integration with Zendesk, Intercom, Slack, Confluence, and more',
      ],
      screenshot: 'https://www.vrin.cloud/og-image.png',
      creator: {
        '@id': 'https://www.vrin.cloud/#organization',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '50',
        bestRating: '5',
        worstRating: '1',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.vrin.cloud/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Vrin?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Vrin is an AI Deep Search and Reasoning Engine designed to serve as the Cognitive Reasoning Core for teams and enterprises. It structures siloed company data into entity-centric Knowledge Graphs to enable multi-hop reasoning and cross-document insights.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does Vrin differ from traditional search or RAG systems?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Unlike traditional RAG systems that retrieve chunks of text, Vrin builds entity-centric Knowledge Graphs that enable multi-hop reasoning across documents. This allows Vrin to synthesize insights from multiple sources and provide source-backed answers with full provenance.',
          },
        },
        {
          '@type': 'Question',
          name: 'What integrations does Vrin support?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Vrin integrates with popular enterprise tools including Zendesk, Intercom, Freshdesk, Slack, Confluence, Notion, Google Drive, SharePoint, Jira, GitHub, Linear, and more.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Vrin secure for enterprise use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, Vrin offers enterprise-grade security with SOC 2 compliance, data isolation, VPC deployment options, SSO integration, and air-gapped deployment for maximum security requirements.',
          },
        },
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js" type="module" async></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Additional meta tags for comprehensive SEO */}
        <meta name="application-name" content="Vrin" />
        <meta name="apple-mobile-web-app-title" content="Vrin" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#083C5E" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        {/* Geo and language targeting */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="San Francisco" />
        <meta name="language" content="English" />
        <meta httpEquiv="content-language" content="en-US" />
        {/* Additional SEO meta tags */}
        <meta name="rating" content="General" />
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${inter.className} ${manrope.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
