import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import PostDetail from '@/components/posts/server/postDetail'
import { getPostBySlug } from '@/lib/actions/posts'
import { ShareButtons } from '@/components/posts/client/shareButtons'
import { Comments } from '@/components/posts/server/comments'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface PageProps {
  params: {
    slug: string
  }
}

// 動的メタデータの生成
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
      titleTemplate: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    }
  }

  return {
    title: `${post.title} | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      publishedTime: post.created_at.toISOString(),
      modifiedTime: post.updated_at.toISOString(),
      authors: [post.author.name],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* 記事本文 */}
        <Suspense fallback={<LoadingSpinner />}>
          <PostDetail post={post} />
        </Suspense>

        {/* シェアボタン */}
        <div className="border-t border-b py-4 my-8">
          <h3 className="text-lg font-semibold mb-4">Share this post</h3>
          <ShareButtons 
            url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`}
            title={post.title}
          />
        </div>

        {/* コメントセクション */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Comments</h3>
          <Suspense fallback={<LoadingSpinner />}>
            <Comments postId={post.id} />
          </Suspense>
        </section>
      </div>
    </article>
  )
}

// 静的生成の最適化（オプション）
export async function generateStaticParams() {
  // 全ての公開済み記事のslugを取得
  // Note: この実装は実際のデータ取得方法に応じて調整が必要
  /*
  const posts = await getAllPublishedPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
  */
  return []
}