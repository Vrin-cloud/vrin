import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.vrin.cloud'),
  title: "Vrin - Memory & Context OS for AI",
  description: "Vrin is the Memory & Context OS for AI—an insert-data-and-ask platform with adaptive HybridRAG, typed memory, provenance/conflict resolution, and per-claim citation.",
  keywords: ["AI memory", "AI context orchestration", "persistent memory", "HybridRAG"],
  authors: [{ name: "Vrin" }],
  openGraph: {
    title: "Vrin - Memory & Context OS for AI",
    description: "Vrin is the Memory & Context OS for AI—an insert-data-and-ask platform with adaptive HybridRAG, typed memory, provenance/conflict resolution, and per-claim citation.",
    url: "https://www.vrin.cloud",
    siteName: "Vrin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vrin - Memory & Context OS for AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vrin - Memory & Context OS for AI",
    description: "Vrin is the Memory & Context OS for AI—an insert-data-and-ask platform with adaptive HybridRAG, typed memory, provenance/conflict resolution, and per-claim citation.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js" type="module" async></script>
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
