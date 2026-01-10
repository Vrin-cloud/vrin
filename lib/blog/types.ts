export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: {
    name: string
    role: string
    avatar?: string
    linkedin?: string
  }
  category: 'technical' | 'research' | 'product' | 'company'
  tags: string[]
  readingTime: string
  featured?: boolean
  image?: string
  content: string
}

export interface BlogCategory {
  id: string
  name: string
  description: string
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { id: 'technical', name: 'Technical Deep Dives', description: 'Architecture, implementation details, and engineering insights' },
  { id: 'research', name: 'Research & Benchmarks', description: 'Performance analysis, comparisons, and academic findings' },
  { id: 'product', name: 'Product Updates', description: 'New features, improvements, and roadmap' },
  { id: 'company', name: 'Company News', description: 'Team updates, partnerships, and announcements' },
]
