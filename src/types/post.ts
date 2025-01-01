export interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  published: boolean
  created_at: string
  updated_at: string
  category: string
  author: {
    id: string
    name: string
    email: string
  }
} 