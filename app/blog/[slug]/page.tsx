"use client"

import { useParams, notFound } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
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
import { Calendar, Clock, Share2, Twitter, Linkedin, Link as LinkIcon } from "lucide-react"

// Extract h2 headings from markdown content for table of contents
function extractHeadings(content: string): { id: string; text: string }[] {
  const headingRegex = /^## (.+)$/gm
  const headings: { id: string; text: string }[] = []
  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].replace(/\*\*/g, '').replace(/`/g, '').trim()
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    headings.push({ id, text })
  }
  return headings
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params?.slug as string
  const post = getPostBySlug(slug)
  const [activeHeading, setActiveHeading] = useState<string>('')
  const [showSidebars, setShowSidebars] = useState(true)

  const headings = post ? extractHeadings(post.content) : []

  // Track which heading is currently in view
  useEffect(() => {
    if (headings.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )
    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  // Hide sidebars when footer comes into view
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer')
      if (!footer) return
      const rect = footer.getBoundingClientRect()
      // Hide when footer top enters the viewport
      setShowSidebars(rect.top > window.innerHeight)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

      {/* Article Header — Center-aligned */}
      <article className="pt-32 pb-8 bg-[#FFFFFF] dark:bg-[#201E1E]">
        <div className="container max-w-[720px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Date + Category */}
            <div className="flex items-center justify-center gap-3 text-sm text-[#201E1E]/50 dark:text-[#FFFFFF]/50 mb-6">
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span className="text-[#201E1E]/20 dark:text-[#FFFFFF]/20">|</span>
              <span className="capitalize">{post.category}</span>
            </div>

            {/* Title — center */}
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-medium tracking-tight mb-6 text-[#201E1E] dark:text-[#FFFFFF] leading-[1.1]">
              {post.title}
            </h1>

            {/* Description — center */}
            <p className="text-lg text-[#201E1E]/60 dark:text-[#FFFFFF]/60 max-w-2xl mx-auto mb-8">
              {post.description}
            </p>

            {/* Author — center */}
            <div className="flex items-center justify-center gap-3 pb-8 border-b border-[#201E1E]/10 dark:border-[#FFFFFF]/10">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#083C5E]/20 dark:bg-[#8DAA9D]/20 flex items-center justify-center text-[#083C5E] dark:text-[#8DAA9D] font-medium text-sm">
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <div className="text-sm">
                {post.author.linkedin ? (
                  <a href={post.author.linkedin} target="_blank" rel="noopener noreferrer" className="font-medium text-[#201E1E] dark:text-[#FFFFFF] hover:text-[#083C5E] dark:hover:text-[#8DAA9D] transition-colors">
                    {post.author.name}
                  </a>
                ) : (
                  <span className="font-medium text-[#201E1E] dark:text-[#FFFFFF]">{post.author.name}</span>
                )}
                <span className="text-[#201E1E]/40 dark:text-[#FFFFFF]/40 mx-2">·</span>
                <span className="text-[#201E1E]/50 dark:text-[#FFFFFF]/50">{post.readingTime}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </article>

      {/* Article Content with Left Sidebar (Recent) + Right Sidebar (TOC) */}
      <section id="article-content" className="py-12 bg-[#FFFFFF] dark:bg-[#201E1E]">
        {/* Left sidebar — All Posts link + Recent posts, pinned to left edge */}
        <div className={`hidden lg:block fixed left-8 top-32 w-48 z-10 transition-opacity duration-300 ${showSidebars ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <Link
            href="/blog"
            className="text-sm font-medium text-[#201E1E] dark:text-[#FFFFFF] hover:text-[#083C5E] dark:hover:text-[#8DAA9D] transition-colors mb-6 block"
          >
            ← All Posts
          </Link>
          <div className="mb-4">
            <p className="text-xs font-medium uppercase tracking-widest text-[#201E1E]/40 dark:text-[#FFFFFF]/40 mb-3">Recent</p>
            <ul className="space-y-3">
              {getAllPosts()
                .filter(p => p.slug !== slug)
                .slice(0, 5)
                .map(recentPost => (
                  <li key={recentPost.slug}>
                    <Link
                      href={`/blog/${recentPost.slug}`}
                      className={`block text-[13px] leading-snug transition-colors duration-200 ${
                        recentPost.slug === slug
                          ? 'text-[#201E1E] dark:text-[#FFFFFF] font-medium'
                          : 'text-[#201E1E]/40 dark:text-[#FFFFFF]/40 hover:text-[#201E1E]/70 dark:hover:text-[#FFFFFF]/70'
                      }`}
                    >
                      {recentPost.title.length > 50 ? recentPost.title.slice(0, 50) + '...' : recentPost.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Right sidebar — TOC, pinned to right edge */}
        {headings.length > 2 && (
          <div className={`hidden lg:block fixed right-8 top-32 w-48 z-10 transition-opacity duration-300 ${showSidebars ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <nav>
              <ul className="space-y-3 border-l border-[#201E1E]/10 dark:border-[#FFFFFF]/10">
                {headings.map(({ id, text }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className={`block pl-4 text-[13px] leading-snug transition-colors duration-200 ${
                        activeHeading === id
                          ? 'text-[#201E1E] dark:text-[#FFFFFF] border-l-2 border-[#083C5E] dark:border-[#8DAA9D] -ml-px font-medium'
                          : 'text-[#201E1E]/35 dark:text-[#FFFFFF]/35 hover:text-[#201E1E]/60 dark:hover:text-[#FFFFFF]/60'
                      }`}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}

        <div id="article-prose" className="max-w-[860px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose dark:prose-invert max-w-none text-[17px]
              prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[#201E1E] dark:prose-headings:text-[#FFFFFF]
              prose-h2:text-[1.75rem] prose-h2:leading-[1.3] prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-[1.375rem] prose-h3:leading-[1.35] prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-[#201E1E]/80 dark:prose-p:text-[#FFFFFF]/80 prose-p:leading-[1.6]
              prose-a:text-[#083C5E] dark:prose-a:text-[#8DAA9D] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[#201E1E] dark:prose-strong:text-[#FFFFFF] prose-strong:font-semibold
              prose-code:text-[#083C5E] dark:prose-code:text-[#8DAA9D] prose-code:bg-[#083C5E]/10 dark:prose-code:bg-[#8DAA9D]/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.9em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-[#201E1E]/10 dark:prose-pre:border-[#FFFFFF]/10 prose-pre:rounded-xl
              prose-blockquote:border-l-[#083C5E] dark:prose-blockquote:border-l-[#8DAA9D] prose-blockquote:text-[#201E1E]/70 dark:prose-blockquote:text-[#FFFFFF]/70 prose-blockquote:not-italic
              prose-ul:text-[#201E1E]/80 dark:prose-ul:text-[#FFFFFF]/80 prose-ul:leading-[1.6]
              prose-ol:text-[#201E1E]/80 dark:prose-ol:text-[#FFFFFF]/80 prose-ol:leading-[1.6]
              prose-li:marker:text-[#083C5E] dark:prose-li:marker:text-[#8DAA9D]
              prose-table:border-collapse prose-table:text-[15px]
              prose-th:bg-[#083C5E]/10 dark:prose-th:bg-[#8DAA9D]/10 prose-th:text-[#201E1E] dark:prose-th:text-[#FFFFFF] prose-th:font-medium prose-th:px-4 prose-th:py-2.5 prose-th:border prose-th:border-[#201E1E]/20 dark:prose-th:border-[#FFFFFF]/20
              prose-td:px-4 prose-td:py-2.5 prose-td:border prose-td:border-[#201E1E]/10 dark:prose-td:border-[#FFFFFF]/10
              prose-hr:border-[#201E1E]/10 dark:prose-hr:border-[#FFFFFF]/10
            "
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h2({ node, children, ...props }) {
                  const text = String(children).replace(/\*\*/g, '').replace(/`/g, '').trim()
                  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                  return <h2 id={id} {...props}>{children}</h2>
                },
                p({ node, children, ...props }) {
                  // If a paragraph contains only an image, render as div to avoid
                  // invalid <p><figure>...</figure></p> nesting
                  const hasImage = node?.children?.some(
                    (child: any) => child.type === 'element' && child.tagName === 'img'
                  )
                  if (hasImage) {
                    return <div {...props}>{children}</div>
                  }
                  return <p {...props}>{children}</p>
                },
                img({ node, src, alt, ...props }) {
                  return (
                    <figure className="my-10">
                      <img
                        src={src}
                        alt={alt || ''}
                        className="w-full h-auto rounded-xl"
                        loading="lazy"
                        {...props}
                      />
                      {alt && (
                        <figcaption className="mt-3 text-center text-sm text-[#201E1E]/50 dark:text-[#FFFFFF]/50">
                          {alt}
                        </figcaption>
                      )}
                    </figure>
                  )
                },
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  // Check if it's inline code: no language AND no newlines
                  const codeString = String(children)
                  const hasNewlines = codeString.includes('\n')
                  const isInlineCode = !match && !className && !hasNewlines

                  if (isInlineCode) {
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
                        padding: '1rem',
                      }}
                    >
                      {codeString.replace(/\n$/, '')}
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
            className="mt-16 pt-8 border-t border-[#201E1E]/10 dark:border-[#FFFFFF]/10"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#201E1E]/60 dark:text-[#FFFFFF]/60" />
                <span className="text-sm text-[#201E1E]/60 dark:text-[#FFFFFF]/60">Share this article</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareTwitter}
                  className="border-[#201E1E]/20 dark:border-[#FFFFFF]/20"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareLinkedIn}
                  className="border-[#201E1E]/20 dark:border-[#FFFFFF]/20"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyLink}
                  className="border-[#201E1E]/20 dark:border-[#FFFFFF]/20"
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
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#083C5E]/20 dark:bg-[#8DAA9D]/20 flex items-center justify-center text-xl text-[#083C5E] dark:text-[#8DAA9D] font-medium flex-shrink-0">
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <div>
                {post.author.linkedin ? (
                  <a href={post.author.linkedin} target="_blank" rel="noopener noreferrer" className="font-medium text-lg text-[#201E1E] dark:text-[#FFFFFF] hover:text-[#083C5E] dark:hover:text-[#8DAA9D] transition-colors">
                    {post.author.name}
                  </a>
                ) : (
                  <p className="font-medium text-lg text-[#201E1E] dark:text-[#FFFFFF]">{post.author.name}</p>
                )}
                <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFFFF]/60 mb-3">{post.author.role}</p>
                <p className="text-[#201E1E]/70 dark:text-[#FFFFFF]/70">
                  Building knowledge reasoning infrastructure for enterprise AI at VRIN. We believe in transparent research and open benchmarks.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
