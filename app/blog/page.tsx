"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { getAllPosts, getFeaturedPosts } from "@/lib/blog/posts"
import { BLOG_CATEGORIES } from "@/lib/blog/types"
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react"

export default function BlogPage() {
  const allPosts = getAllPosts()
  const featuredPosts = getFeaturedPosts()

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedBackground />
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#FFFDFD] dark:bg-[#201E1E]">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Badge variant="outline" className="mb-6 px-4 py-2 text-xs font-medium tracking-widest uppercase bg-[#083C5E]/10 dark:bg-[#8DAA9D]/10 border-[#083C5E]/20 dark:border-[#8DAA9D]/20 text-[#083C5E] dark:text-[#8DAA9D]">
              VRIN Blog
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight mb-6 text-[#201E1E] dark:text-[#FFFDFD]">
              Engineering & Research
            </h1>
            <p className="text-lg md:text-xl text-[#201E1E]/60 dark:text-[#FFFDFD]/60 font-light max-w-2xl mx-auto">
              Deep dives into hybrid RAG architecture, benchmark results, and the technology powering enterprise AI memory.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPosts.length > 0 && (
        <section className="py-12 bg-[#FFFDFD] dark:bg-[#201E1E]">
          <div className="container max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link href={`/blog/${featuredPosts[0].slug}`}>
                <Card className="group overflow-hidden border border-[#201E1E]/10 dark:border-[#FFFDFD]/10 bg-gradient-to-br from-[#083C5E]/5 to-[#8DAA9D]/5 dark:from-[#083C5E]/20 dark:to-[#8DAA9D]/10 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 md:p-12">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4 text-[#083C5E] dark:text-[#8DAA9D]" />
                      <span className="text-sm font-medium text-[#083C5E] dark:text-[#8DAA9D]">Featured</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-[#201E1E] dark:text-[#FFFDFD] group-hover:text-[#083C5E] dark:group-hover:text-[#8DAA9D] transition-colors">
                      {featuredPosts[0].title}
                    </h2>
                    <p className="text-[#201E1E]/60 dark:text-[#FFFDFD]/60 text-lg mb-6 max-w-3xl">
                      {featuredPosts[0].description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#201E1E]/50 dark:text-[#FFFDFD]/50">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(featuredPosts[0].date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{featuredPosts[0].readingTime}</span>
                      </div>
                      <div className="flex items-center gap-2 ml-auto text-[#083C5E] dark:text-[#8DAA9D] font-medium group-hover:gap-3 transition-all">
                        <span>Read article</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 bg-[#FFFDFD] dark:bg-[#201E1E]">
        <div className="container max-w-6xl">
          <h2 className="text-2xl font-light mb-8 text-[#201E1E] dark:text-[#FFFDFD]">
            All Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card className="group h-full overflow-hidden border border-[#201E1E]/10 dark:border-[#FFFDFD]/10 hover:border-[#083C5E]/30 dark:hover:border-[#8DAA9D]/30 bg-[#FFFDFD] dark:bg-[#201E1E] hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 2).map(tag => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs bg-[#083C5E]/10 dark:bg-[#8DAA9D]/10 text-[#083C5E] dark:text-[#8DAA9D] border-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="text-lg font-medium mb-3 text-[#201E1E] dark:text-[#FFFDFD] group-hover:text-[#083C5E] dark:group-hover:text-[#8DAA9D] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60 mb-4 line-clamp-3 flex-grow">
                        {post.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[#201E1E]/50 dark:text-[#FFFDFD]/50 pt-4 border-t border-[#201E1E]/5 dark:border-[#FFFDFD]/5">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.readingTime}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-[#201E1E]/5 dark:bg-[#FFFDFD]/5">
        <div className="container max-w-6xl">
          <h2 className="text-2xl font-light mb-8 text-[#201E1E] dark:text-[#FFFDFD]">
            Topics
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {BLOG_CATEGORIES.map((category) => (
              <Card
                key={category.id}
                className="border border-[#201E1E]/10 dark:border-[#FFFDFD]/10 bg-[#FFFDFD] dark:bg-[#201E1E]"
              >
                <CardContent className="p-5">
                  <h3 className="font-medium mb-2 text-[#201E1E] dark:text-[#FFFDFD]">
                    {category.name}
                  </h3>
                  <p className="text-sm text-[#201E1E]/60 dark:text-[#FFFDFD]/60">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
