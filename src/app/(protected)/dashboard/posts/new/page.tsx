'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PostForm } from '@/components/posts/client/postForm'
import { createPost } from '@/lib/actions/posts'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import type { Post } from '@/types'

export default function NewPostPage() {
  const router = useRouter()
  const [isPreview, setIsPreview] = useState(false)
  const [formData, setFormData] = useState<Partial<Post>>({
    title: '',
    content: '',
    published: false,
  })

  // プレビューの切り替え
  const togglePreview = useCallback(() => {
    setIsPreview(!isPreview)
  }, [isPreview])

  // 投稿の保存
  const handleSubmit = async (data: Partial<Post>) => {
    try {
      const response = await createPost(data)
      toast({
        title: '投稿を作成しました',
        variant: 'success',
      })
      router.push(`/dashboard/posts/${response.id}`)
    } catch (error) {
      toast({
        title: '投稿の作成に失敗しました',
        description: error instanceof Error ? error.message : '予期せぬエラーが発生しました',
        variant: 'error',
      })
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">新規投稿</h1>
        <Button
          onClick={togglePreview}
          variant="outline"
        >
          {isPreview ? '編集に戻る' : 'プレビュー'}
        </Button>
      </div>

      <Card className="p-6">
        {isPreview ? (
          <div className="prose max-w-none">
            <h1>{formData.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: formData.content || '' }} />
          </div>
        ) : (
          <PostForm
            initialData={formData}
            onSubmit={handleSubmit}
            onChange={setFormData}
            submitLabel="投稿を作成"
          />
        )}
      </Card>
    </div>
  )
}