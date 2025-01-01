// /root/babel_generated/20241103_1243_20241103_1240_blogvault_official_nextjs_fastapi/frontend/app/(protected)/dashboard/posts/page.tsx

import { Suspense } from 'react'
import { PostList } from '@/components/posts/server/postList'
import { getPosts } from '@/lib/actions/posts'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// 検索パラメータの型定義
interface SearchParams {
  page?: string
  search?: string
  status?: string
}

// ページコンポーネントのProps型定義
interface PostsPageProps {
  searchParams: SearchParams
}

// 1ページあたりの投稿数
const POSTS_PER_PAGE = 10

export default async function PostsPage({ searchParams }: PostsPageProps) {
  // 検索パラメータの取得
  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ''
  const status = searchParams.status || 'all'

  // 投稿データの取得
  const { posts, totalPages } = await getPosts({
    page,
    search,
    status,
    limit: POSTS_PER_PAGE,
  })

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link href="/dashboard/posts/new">
          <Button>Create New Post</Button>
        </Link>
      </div>

      <Card className="p-6">
        {/* フィルタリングセクション */}
        <div className="flex gap-4 mb-6">
          <Input
            type="search"
            placeholder="Search posts..."
            defaultValue={search}
            className="max-w-sm"
            onChange={(e) => {
              // URLパラメータを更新
              const params = new URLSearchParams(window.location.search)
              params.set('search', e.target.value)
              params.set('page', '1')
              window.location.search = params.toString()
            }}
          />
          <select
            defaultValue={status}
            className="border rounded-md px-3 py-2"
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search)
              params.set('status', e.target.value)
              params.set('page', '1')
              window.location.search = params.toString()
            }}
          >
            <option value="all">All Posts</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* 投稿一覧 */}
        <Suspense fallback={<div>Loading posts...</div>}>
          <PostList posts={posts} />
        </Suspense>

        {/* ページネーション */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Link
              key={pageNum}
              href={{
                pathname: '/dashboard/posts',
                query: {
                  ...searchParams,
                  page: pageNum,
                },
              }}
            >
              <Button
                variant={page === pageNum ? 'default' : 'outline'}
                size="sm"
              >
                {pageNum}
              </Button>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}

// メタデータの設定
export const metadata = {
  title: 'Posts | Dashboard',
  description: 'Manage your blog posts',
}