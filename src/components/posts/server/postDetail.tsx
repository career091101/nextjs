import { format } from 'date-fns';
import { Post, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, Trash2, Share2 } from 'lucide-react';

interface PostDetailProps {
  post: Post;
  author: User;
  isAuthor: boolean;
}

export default async function PostDetail({ post, author, isAuthor }: PostDetailProps) {
  // 記事のメタデータを整形
  const formattedDate = format(new Date(post.created_at), 'MMMM dd, yyyy');
  const lastUpdated = format(new Date(post.updated_at), 'MMMM dd, yyyy');

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* 記事ヘッダー */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            {author.avatar_url && (
              <img
                src={author.avatar_url}
                alt={author.name}
                className="w-10 h-10 rounded-full"
              />
            )}
            <span className="font-medium">{author.name}</span>
          </div>
          <span>・</span>
          <time dateTime={post.created_at}>{formattedDate}</time>
          {post.updated_at !== post.created_at && (
            <span className="text-sm">(Updated: {lastUpdated})</span>
          )}
        </div>
      </div>

      {/* アクションボタン */}
      {isAuthor && (
        <div className="flex gap-4 mb-8">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            asChild
          >
            <a href={`/protected/posts/${post.id}/edit`}>
              <Edit className="w-4 h-4" />
              Edit
            </a>
          </Button>
          <Button
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      )}

      {/* 記事本文 */}
      <Card className="p-8 mb-8">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </Card>

      {/* シェアボタン */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
          }}
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      {/* メタデータ */}
      <footer className="mt-8 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {post.published ? (
            <span className="text-green-600">Published</span>
          ) : (
            <span className="text-yellow-600">Draft</span>
          )}
          <span className="mx-2">•</span>
          <span>ID: {post.id}</span>
          {post.slug && (
            <>
              <span className="mx-2">•</span>
              <span>Slug: {post.slug}</span>
            </>
          )}
        </div>
      </footer>
    </article>
  );
}

// 型ガード関数
function isValidPost(post: any): post is Post {
  return (
    post &&
    typeof post.id === 'string' &&
    typeof post.title === 'string' &&
    typeof post.content === 'string'
  );
}