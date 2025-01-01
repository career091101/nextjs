'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PostForm from '@/components/posts/client/postForm'
import { getPost, updatePost, createPostVersion } from '@/lib/actions/posts'
import { Post } from '@/types/post'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'

interface EditPostPageProps {
  params: {
    id: string
  }
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [post, setPost] = useState<Post | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 記事データの取得
  useEffect(() => {
    async function loadPost() {
      try {
        const postData = await getPost(params.id)
        setPost(postData)
      } catch (error) {
        toast({
          title: 'エラー',
          description: '記事の読み込みに失敗しました',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadPost()
  }, [params.id, toast])

  // 下書き保存の処理
  const handleDraftSave = async (formData: Partial<Post>) => {
    try {
      setIsSaving(true)
      await updatePost(params.id, { ...formData, published: false })
      // バージョン履歴の作成
      await createPostVersion(params.id, formData)
      toast({
        title: '保存完了',
        description: '下書きを保存しました',
      })
    } catch (error) {
      toast({
        title: 'エラー',
        description: '保存に失敗しました',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 公開保存の処理
  const handlePublish = async (formData: Partial<Post>) => {
    try {
      setIsSaving(true)
      await updatePost(params.id, { ...formData, published: true })
      // バージョン履歴の作成
      await createPostVersion(params.id, formData)
      toast({
        title: '公開完了',
        description: '記事を公開しました',
      })
      router.push('/dashboard/posts')
    } catch (error) {
      toast({
        title: 'エラー',
        description: '公開に失敗しました',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="p-4">Loading...</div>
  }

  if (!post) {
    return <div className="p-4">記事が見つかりません</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">記事の編集</h1>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/posts')}
        >
          キャンセル
        </Button>
      </div>

      <PostForm
        initialData={post}
        onDraftSave={handleDraftSave}
        onPublish={handlePublish}
        isSubmitting={isSaving}
      />

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">バージョン履歴</h2>
        {/* バージョン履歴の表示コンポーネントをここに追加 */}
      </div>
    </div>
  )
}