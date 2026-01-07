import type { Metadata } from "next"

// Shared metadata configuration - kept for reference but main metadata is in layout.tsx
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
  ],
  authors: [{ name: "Vrin", url: "https://www.vrin.cloud" }],
  creator: "Vrin",
  publisher: "Vrin",
  openGraph: {
    title: "Vrin - AI Deep Search & Reasoning Engine for Enterprise",
    description: "The Cognitive Reasoning Core for teams & enterprises. Structure siloed data into Knowledge Graphs, enable multi-hop reasoning, and get source-backed answers.",
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
  },
  robots: {
    index: true,
    follow: true,
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

// Page-specific metadata generators
export function generateCustomerSupportMetadata(): Metadata {
  return {
    title: "AI for Customer Support | Vrin",
    description: "Resolve complex tickets faster with Vrin's AI Deep Search. Bring evidence-backed context into every ticket, draft customer-ready replies, and trigger workflow agents for follow-ups.",
    keywords: [
      "AI for customer support", "AI support agent", "customer support AI", "support ticket AI",
      "Zendesk AI", "Intercom AI", "helpdesk AI", "AI ticket resolution",
      "reduce AHT", "first contact resolution", "support automation",
      "AI customer service", "support copilot", "ticket summarization AI",
    ],
    openGraph: {
      title: "AI for Customer Support - Source-Backed Answers in Every Ticket | Vrin",
      description: "Resolve complex tickets faster. Vrin brings evidence-backed context into Zendesk/Intercom, drafts replies, and triggers workflow agents for escalations and KB updates.",
      url: "https://www.vrin.cloud/industries/customer-support",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Vrin for Customer Support",
        },
      ],
    },
  }
}

export function generateEnterpriseMetadata(): Metadata {
  return {
    title: "Enterprise AI Infrastructure | Vrin",
    description: "Deploy Vrin in your private infrastructure with complete data sovereignty. Multi-cloud deployment, air-gapped options, SSO integration, and enterprise-grade security.",
    keywords: [
      "enterprise AI", "private AI deployment", "AI data sovereignty",
      "enterprise knowledge graph", "private LLM", "air-gapped AI",
      "enterprise search", "corporate AI", "secure AI deployment",
    ],
    openGraph: {
      title: "Enterprise AI with Complete Data Sovereignty | Vrin",
      description: "Deploy Vrin in your private infrastructure. Multi-cloud support, air-gapped options, and enterprise-grade security.",
      url: "https://www.vrin.cloud/enterprise",
    },
  }
}
