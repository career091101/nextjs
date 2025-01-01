import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from '@/components/ui/button'
import type { Post } from '@/types/post'

interface PostPageProps {
  params: {
    slug: string
  }
}

// 投稿データを取得する関数
async function getPost(slug: string): Promise<Post | null> {
  // モックデータを返す
  const mockPosts: Post[] = [
    {
      id: '1',
      title: 'Next.js 13の新機能について',
      content: `
# Next.js 13の新機能について

Next.js 13では、多くの革新的な機能が導入されました。以下に主要な新機能をご紹介します。

## 1. App Router

新しいファイルシステムベースのルーターが導入され、より直感的なルーティングが可能になりました。
特徴：
- ネストされたレイアウト
- サーバーコンポーネント
- ストリーミング

## 2. Server Components

デフォルトでサーバーコンポーネントが有効になり、パフォーマンスが向上しました。
利点：
- バンドルサイズの削減
- 初期ページロードの高速化
- SEOの改善

## 3. データフェッチング

新しいデータフェッチングの方法が導入され、より効率的なデータの取得が可能になりました。
特徴：
- キャッシュとリバリデーション
- サーバーサイドでのフェッチ
- 並列データフェッチ
      `,
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
      content: `
# TypeScriptベストプラクティス

TypeScriptを効果的に使用するためのベストプラクティスをご紹介します。

## 1. 型の明示的な定義

可能な限り型を明示的に定義することで、コードの可読性と保守性が向上します。

\`\`\`typescript
// 良い例
interface User {
  id: string;
  name: string;
  email: string;
}

// 避けるべき例
const user: any = { ... }
\`\`\`

## 2. Union Types の活用

Union Typesを使用することで、より柔軟な型定義が可能になります。

\`\`\`typescript
type Status = 'pending' | 'approved' | 'rejected';

interface Task {
  id: string;
  status: Status;
}
\`\`\`

## 3. Generics の活用

Genericsを使用することで、再利用可能な型定義が可能になります。

\`\`\`typescript
function getFirstElement<T>(array: T[]): T | undefined {
  return array[0];
}
\`\`\`
      `,
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

  const post = mockPosts.find(post => post.slug === slug);
  return post || null;
}

// メタデータを動的に生成
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found | BlogVault',
      description: 'The requested post could not be found.',
    };
  }

  return {
    title: `${post.title} | BlogVault`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/blog">
          <Button variant="ghost" size="sm">
            ← ブログ一覧に戻る
          </Button>
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-600">
          <span>{format(new Date(post.created_at), 'yyyy年MM月dd日')}</span>
          <span>|</span>
          <span>{post.category}</span>
          <span>|</span>
          <span>著者: {post.author.name}</span>
        </div>
      </header>

      <div className="prose lg:prose-lg max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-2xl font-bold mb-4">この記事について</h2>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm ${
            post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {post.published ? '公開済み' : '下書き'}
          </span>
          <span className="text-gray-600">
            最終更新: {format(new Date(post.updated_at), 'yyyy年MM月dd日')}
          </span>
        </div>
      </div>
    </article>
  );
} 