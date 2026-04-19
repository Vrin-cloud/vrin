'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getAllPosts, getFeaturedPosts } from '@/lib/blog/posts'
import { BLOG_CATEGORIES } from '@/lib/blog/types'
import { Calendar, Clock, ArrowUpRight, Sparkles } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

function formatDate(iso: string, long = false) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: long ? 'long' : 'short',
    day: 'numeric',
    year: long ? 'numeric' : undefined,
  })
}

export default function BlogPage() {
  const allPosts = getAllPosts()
  const featuredPosts = getFeaturedPosts()
  const featured = featuredPosts[0]

  return (
    <div className="flex flex-col bg-vrin-paper">
      <Header />

      {/* Hero */}
      <section className="relative pt-36 md:pt-44 pb-16 md:pb-20 overflow-hidden vignette-paper">
        <div className="absolute inset-0 grid-faint opacity-60 pointer-events-none" />
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <span className="eyebrow text-vrin-blue">The Vrin blog</span>
            <span className="hairline flex-1" />
            <span className="hidden md:inline text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45">
              engineering · research · field notes
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="font-display text-[clamp(2.75rem,6.5vw,5.75rem)] leading-[0.98] tracking-[-0.035em] text-vrin-charcoal max-w-5xl"
          >
            Engineering &{' '}
            <span className="serif-italic text-vrin-blue">research.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mt-8 max-w-2xl text-lg md:text-xl text-vrin-charcoal/65 leading-relaxed"
          >
            Deep dives into knowledge reasoning architecture, benchmark results,
            and the technology powering enterprise AI.
          </motion.p>
        </div>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="relative bg-vrin-paper py-10 md:py-16 overflow-hidden">
          <div className="absolute inset-0 grain pointer-events-none" />
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
            >
              <Link
                href={`/blog/${featured.slug}`}
                className="group block rounded-[2rem] md:rounded-[2.5rem] border border-vrin-charcoal/10 bg-vrin-cream/70 hover:border-vrin-charcoal/25 overflow-hidden transition-all duration-500"
              >
                <div className="p-8 md:p-14">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-4 h-4 text-vrin-blue" />
                    <span className="eyebrow text-vrin-blue">Featured</span>
                    <span className="hairline flex-1" />
                    <span className="text-[10px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/40 hidden md:inline">
                      {featured.tags?.slice(0, 2).join(' · ')}
                    </span>
                  </div>

                  <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.02] tracking-[-0.025em] text-vrin-charcoal group-hover:text-vrin-blue transition-colors max-w-4xl">
                    {featured.title}
                  </h2>

                  <p className="mt-6 max-w-3xl text-base md:text-lg text-vrin-charcoal/65 leading-relaxed">
                    {featured.description}
                  </p>

                  <div className="mt-10 flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-vrin-charcoal/10">
                    <div className="flex items-center gap-5 text-xs font-mono text-vrin-charcoal/55">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(featured.date, true)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {featured.readingTime}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-vrin-blue group-hover:text-vrin-charcoal transition-colors">
                      Read article
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* All posts */}
      <section className="relative bg-vrin-paper py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-12 max-w-6xl mx-auto">
            <span className="eyebrow text-vrin-blue">All articles</span>
            <span className="hairline flex-1" />
            <span className="text-[11px] font-mono tracking-[0.14em] uppercase text-vrin-charcoal/45">
              {allPosts.length} posts
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {allPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: (index % 6) * 0.06, ease }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group relative flex flex-col h-full p-7 rounded-3xl border border-vrin-charcoal/10 bg-vrin-cream/60 hover:border-vrin-charcoal/25 hover:-translate-y-0.5 transition-all duration-500"
                >
                  <div className="flex flex-wrap gap-2 mb-5">
                    {post.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono tracking-[0.14em] uppercase px-2.5 py-1 rounded-full border border-vrin-charcoal/12 bg-vrin-paper/60 text-vrin-charcoal/65"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-display text-xl md:text-2xl leading-[1.15] text-vrin-charcoal group-hover:text-vrin-blue transition-colors mb-3">
                    {post.title}
                  </h3>

                  <p className="text-sm text-vrin-charcoal/65 leading-relaxed line-clamp-3 flex-grow">
                    {post.description}
                  </p>

                  <div className="mt-6 pt-5 border-t border-vrin-charcoal/10 flex items-center justify-between text-[11px] font-mono text-vrin-charcoal/50">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {post.readingTime}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="relative bg-vrin-paper py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 grain pointer-events-none" />

        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-12 max-w-6xl mx-auto">
            <span className="eyebrow text-vrin-blue">Topics</span>
            <span className="hairline flex-1" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {BLOG_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="p-6 rounded-3xl border border-vrin-charcoal/10 bg-vrin-cream/60"
              >
                <h3 className="font-display text-lg leading-[1.15] text-vrin-charcoal mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-vrin-charcoal/65 leading-relaxed">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
