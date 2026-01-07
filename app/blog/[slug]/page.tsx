"use client"

import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { getPostBySlug, getAllPosts } from "@/lib/blog/posts"
import { Calendar, Clock, ArrowLeft, Share2, Twitter, Linkedin, Link as LinkIcon } from "lucide-react"

export default function BlogPostPage() {
  const params = useParams()
  const slug = params?.slug as string
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')
  }

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedBackground />
      <Header />

      {/* Article Header */}
      <article className="pt-32 pb-8 bg-[#FFFDFD] dark:bg-[#201E1E]">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back Link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60 hover:text-[#083C5E] dark:hover:text-[#8DAA9D] transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-[#083C5E]/10 dark:bg-[#8DAA9D]/10 text-[#083C5E] dark:text-[#8DAA9D] border-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 text-[#201E1E] dark:text-[#FFFDFD] leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-[#201E1E]/10 dark:border-[#FFFDFD]/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#083C5E]/20 dark:bg-[#8DAA9D]/20 flex items-center justify-center text-[#083C5E] dark:text-[#8DAA9D] font-medium">
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-[#201E1E] dark:text-[#FFFDFD]">{post.author.name}</p>
                  <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60">{post.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#201E1E]/50 dark:text-[#FFFDFD]/50">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </article>

      {/* Article Content */}
      <section className="py-12 bg-[#FFFDFD] dark:bg-[#201E1E]">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-light prose-headings:text-[#201E1E] dark:prose-headings:text-[#FFFDFD]
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-[#201E1E]/80 dark:prose-p:text-[#FFFDFD]/80 prose-p:leading-relaxed
              prose-a:text-[#083C5E] dark:prose-a:text-[#8DAA9D] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[#201E1E] dark:prose-strong:text-[#FFFDFD] prose-strong:font-semibold
              prose-code:text-[#083C5E] dark:prose-code:text-[#8DAA9D] prose-code:bg-[#083C5E]/10 dark:prose-code:bg-[#8DAA9D]/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-[#201E1E]/10 dark:prose-pre:border-[#FFFDFD]/10 prose-pre:rounded-xl
              prose-blockquote:border-l-[#083C5E] dark:prose-blockquote:border-l-[#8DAA9D] prose-blockquote:text-[#201E1E]/70 dark:prose-blockquote:text-[#FFFDFD]/70 prose-blockquote:not-italic
              prose-ul:text-[#201E1E]/80 dark:prose-ul:text-[#FFFDFD]/80
              prose-ol:text-[#201E1E]/80 dark:prose-ol:text-[#FFFDFD]/80
              prose-li:marker:text-[#083C5E] dark:prose-li:marker:text-[#8DAA9D]
              prose-table:border-collapse
              prose-th:bg-[#083C5E]/10 dark:prose-th:bg-[#8DAA9D]/10 prose-th:text-[#201E1E] dark:prose-th:text-[#FFFDFD] prose-th:font-medium prose-th:px-4 prose-th:py-3 prose-th:border prose-th:border-[#201E1E]/20 dark:prose-th:border-[#FFFDFD]/20
              prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-[#201E1E]/10 dark:prose-td:border-[#FFFDFD]/10
              prose-hr:border-[#201E1E]/10 dark:prose-hr:border-[#FFFDFD]/10
            "
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const isInline = !match && !className

                  if (isInline) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }

                  return (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match ? match[1] : 'text'}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        borderRadius: '0.75rem',
                        fontSize: '0.875rem',
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  )
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </motion.div>

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 pt-8 border-t border-[#201E1E]/10 dark:border-[#FFFDFD]/10"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#201E1E]/60 dark:text-[#FFFDFD]/60" />
                <span className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60">Share this article</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareTwitter}
                  className="border-[#201E1E]/20 dark:border-[#FFFDFD]/20"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareLinkedIn}
                  className="border-[#201E1E]/20 dark:border-[#FFFDFD]/20"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyLink}
                  className="border-[#201E1E]/20 dark:border-[#FFFDFD]/20"
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Author Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 p-8 rounded-2xl bg-[#083C5E]/5 dark:bg-[#8DAA9D]/5 border border-[#083C5E]/10 dark:border-[#8DAA9D]/10"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[#083C5E]/20 dark:bg-[#8DAA9D]/20 flex items-center justify-center text-xl text-[#083C5E] dark:text-[#8DAA9D] font-medium flex-shrink-0">
                {post.author.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium text-lg text-[#201E1E] dark:text-[#FFFDFD]">{post.author.name}</p>
                <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60 mb-3">{post.author.role}</p>
                <p className="text-[#201E1E]/70 dark:text-[#FFFDFD]/70">
                  Building the next generation of enterprise AI memory at VRIN. We believe in transparent research and open benchmarks.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16 bg-[#201E1E]/5 dark:bg-[#FFFDFD]/5">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-light mb-8 text-[#201E1E] dark:text-[#FFFDFD]">
            More from VRIN
          </h2>
          <div className="text-center py-8">
            <p className="text-[#201E1E]/60 dark:text-[#FFFDFD]/60 mb-4">
              More articles coming soon. Subscribe to get notified.
            </p>
            <Button asChild variant="outline">
              <Link href="/blog">
                View all articles
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
