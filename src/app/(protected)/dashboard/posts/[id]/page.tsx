// frontend/app/(protected)/dashboard/posts/[id]/page.tsx

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PostDetail from '@/components/posts/server/postDetail'
import { getPostById } from '@/lib/actions/posts'
import { Post } from '@/types'

interface PostPageProps {
  params: {
    id: string
  }
}

// 動的メタデータの生成
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  try {
    const post = await getPostById(params.id)

    if (!post) {
      return {
        title: 'Post Not Found',
      }
    }

    return {
      title: `${post.title} | Dashboard`,
      description: post.content.substring(0, 160),
      openGraph: {
        title: post.title,
        description: post.content.substring(0, 160),
        type: 'article',
        publishedTime: post.created_at.toISOString(),
        modifiedTime: post.updated_at.toISOString(),
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Post Detail | Dashboard',
    }
  }
}

export default async function PostPage({ params }: PostPageProps) {
  let post: Post | null

  try {
    post = await getPostById(params.id)
  } catch (error) {
    console.error('Error fetching post:', error)
    throw error
  }

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <PostDetail 
          post={post}
          className="bg-white shadow-lg rounded-lg p-6"
        />
      </div>
    </div>
  )
}

// エラーハンドリング用のコンポーネント
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-2 text-gray-600">
          {error.message || 'An error occurred while loading the post.'}
        </p>
      </div>
    </div>
  )
}

// ローディング状態のコンポーネント
export function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}