import { Suspense } from 'react'
import type { Post } from '@/types/post'
import { format } from 'date-fns'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// 投稿のソートオプション
type SortOption = 'latest' | 'oldest' | 'title'

// フィルターオプション
type FilterOption = 'all' | 'published' | 'draft'

interface PostListProps {
  initialPosts: Post[]
  sortBy?: SortOption
  filter?: FilterOption
}

async function getPosts(sortBy: SortOption = 'latest', filter: FilterOption = 'all'): Promise<{ posts: Post[] }> {
  // モックデータを返す
  const mockPosts: Post[] = [
    {
      id: '1',
      title: 'Next.js 13の新機能について',
      content: 'Next.js 13では様々な新機能が追加されました...',
      excerpt: 'Next.js 13の主要な新機能と改善点について解説します。',
      slug: 'nextjs-13-new-features',
      published: true,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
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
      created_at: '2024-01-02T00:00:00.000Z',
      updated_at: '2024-01-02T00:00:00.000Z',
      category: 'Programming',
      author: {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com'
      }
    }
  ];

  return {
    posts: mockPosts
  };
}

export default async function PostList({
  initialPosts,
  sortBy = 'latest',
  filter = 'all',
}: PostListProps) {
  // サーバーサイドでのデータ取得
  const { posts } = await getPosts(sortBy, filter)

  // ソート関数
  const sortPosts = (posts: Post[], sortBy: SortOption) => {
    switch (sortBy) {
      case 'latest':
        return [...posts].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      case 'oldest':
        return [...posts].sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      case 'title':
        return [...posts].sort((a, b) => a.title.localeCompare(b.title))
      default:
        return posts
    }
  }

  // フィルター関数
  const filterPosts = (posts: Post[], filter: FilterOption) => {
    switch (filter) {
      case 'published':
        return posts.filter(post => post.published)
      case 'draft':
        return posts.filter(post => !post.published)
      default:
        return posts
    }
  }

  // ソートとフィルターを適用
  const processedPosts = filterPosts(sortPosts(posts, sortBy), filter)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Posts</h2>
        <div className="flex gap-4">
          <Select defaultValue={sortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue={filter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Suspense fallback={<div>Loading posts...</div>}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {processedPosts.map((post) => (
            <Card key={post.id} className="p-4">
              <h3 className="text-xl font-semibold mb-2">
                <Link href={`/posts/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {format(new Date(post.created_at), 'MMM dd, yyyy')}
              </p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-sm ${
                  post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
                <Link href={`/posts/${post.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Suspense>
    </div>
  )
}