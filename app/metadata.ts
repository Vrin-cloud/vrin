import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL('https://smartmemory.ai'),
  title: "Vrin - Smart Memory for Your AI",
  description: "Transform your LLM applications with persistent memory. Our healthcare-grade API enables AI systems to remember, learn, and provide context-aware responses across conversations.",
  keywords: ["AI memory", "LLM memory", "healthcare AI", "persistent memory", "AI context", "machine learning"],
  authors: [{ name: "Vrin Team" }],
  openGraph: {
    title: "Vrin - Smart Memory for Your AI",
    description: "Transform your LLM applications with persistent memory. Our healthcare-grade API enables AI systems to remember, learn, and provide context-aware responses across conversations.",
    url: "https://smartmemory.ai",
    siteName: "Vrin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vrin - Smart Memory for Your AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vrin - Smart Memory for Your AI",
    description: "Transform your LLM applications with persistent memory. Our healthcare-grade API enables AI systems to remember, learn, and provide context-aware responses across conversations.",
    images: ["/og-image.png"],
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
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
} 