import { Metadata } from 'next'
import { Suspense } from 'react'
import PostList from '@/components/posts/server/postList'
import { SearchParams } from '@/lib/types'
import CategoryFilter from '@/components/posts/client/categoryFilter'
import SearchInput from '@/components/ui/searchInput'
import { getPosts } from '@/lib/actions/posts'

export const metadata: Metadata = {
  title: 'Blog | BlogVault',
  description: 'Explore our latest articles and insights on technology and development.',
  openGraph: {
    title: 'Blog | BlogVault',
    description: 'Explore our latest articles and insights on technology and development.',
    type: 'website',
    url: '/blog',
  },
}

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

interface BlogPageProps {
  searchParams: SearchParams
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = Number(searchParams.page) || 1
  const category = searchParams.category || 'all'
  const search = searchParams.search || ''
  const limit = 9 // Posts per page

  // Get initial posts data
  /* コメントアウト: 実際のデータ取得
  const { posts, total } = await getPosts({
    page,
    limit,
    category: category === 'all' ? undefined : category,
    search,
  })
  */

  // モックデータ
  const posts = [
    {
      id: '1',
      title: 'Next.js 13の新機能について',
      content: 'Next.js 13では様々な新機能が追加されました...',
      excerpt: 'Next.js 13の主要な新機能と改善点について解説します。',
      slug: 'nextjs-13-new-features',
      published: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      category: 'Technology',
      author: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com'
      }
    },
    {
      id: '2',
      title: 'TypeScriptベストプラクティス',
      content: 'TypeScriptを効果的に使用するためのベストプラクティス...',
      excerpt: '実践的なTypeScriptの使い方とベストプラクティスを紹介。',
      slug: 'typescript-best-practices',
      published: true,
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
      category: 'Programming',
      author: {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com'
      }
    }
  ];
  const total = 2;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <div className="w-full sm:w-auto sm:flex sm:space-x-4">
          <Suspense fallback={<div>Loading categories...</div>}>
            <CategoryFilter
              selectedCategory={category}
              className="w-full sm:w-48"
            />
          </Suspense>
          
          <Suspense fallback={<div>Loading search...</div>}>
            <SearchInput
              defaultValue={search}
              className="w-full sm:w-64 mt-4 sm:mt-0"
              placeholder="Search articles..."
            />
          </Suspense>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        }
      >
        <PostList
          posts={posts}
          total={total}
          currentPage={page}
          limit={limit}
          baseUrl="/blog"
          searchParams={searchParams}
        />
      </Suspense>
    </main>
  )
}

// Error boundary
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-red-600">Something went wrong!</h1>
      <p className="mt-2">{error.message}</p>
    </div>
  )
}