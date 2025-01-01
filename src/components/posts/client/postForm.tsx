'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import { Upload, Eye, Save } from 'lucide-react'
import { z } from 'zod'

// 投稿データのバリデーションスキーマ
const postSchema = z.object({
  title: z.string().min(1, '題名は必須です').max(100, '題名は100文字以内で入力してください'),
  content: z.string().min(1, '本文は必須です'),
  slug: z.string().min(1, 'スラッグは必須です').regex(/^[a-z0-9-]+$/, 'スラッグは半角英数字とハイフンのみ使用可能です'),
  published: z.boolean(),
})

type PostFormData = z.infer<typeof postSchema>

interface PostFormProps {
  initialData?: PostFormData
  isEditing?: boolean
}

export default function PostForm({ initialData, isEditing = false }: PostFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<PostFormData>(initialData || {
    title: '',
    content: '',
    slug: '',
    published: false,
  })
  const [isPreview, setIsPreview] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // フォームの入力ハンドラ
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 画像アップロードハンドラ
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    setIsUploading(true)
    try {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('画像のアップロードに失敗しました')

      const { url } = await response.json()
      // エディタに画像のMarkdownを挿入
      setFormData((prev) => ({
        ...prev,
        content: `${prev.content}\n![${file.name}](${url})`
      }))

      toast({
        title: '成功',
        description: '画像をアップロードしました',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'エラー',
        description: '画像のアップロードに失敗しました',
        variant: 'error',
      })
    } finally {
      setIsUploading(false)
    }
  }, [])

  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      // バリデーション
      postSchema.parse(formData)

      const endpoint = isEditing 
        ? `/api/posts/${initialData?.id}` 
        : '/api/posts'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('投稿の保存に失敗しました')

      toast({
        title: '成功',
        description: '投稿を保存しました',
        variant: 'success',
      })

      router.push('/protected/posts')
      router.refresh()
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'バリデーションエラー',
          description: error.errors[0].message,
          variant: 'error',
        })
      } else {
        toast({
          title: 'エラー',
          description: '投稿の保存に失敗しました',
          variant: 'error',
        })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsPreview(!isPreview)}
        >
          <Eye className="w-4 h-4 mr-2" />
          {isPreview ? 'エディタ' : 'プレビュー'}
        </Button>
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          保存
        </Button>
      </div>

      {!isPreview ? (
        <div className="space-y-4">
          <Input
            name="title"
            placeholder="題名"
            value={formData.title}
            onChange={handleChange}
          />
          <Input
            name="slug"
            placeholder="スラッグ (例: my-first-post)"
            value={formData.slug}
            onChange={handleChange}
          />
          <div className="relative">
            <Textarea
              name="content"
              placeholder="本文 (Markdown形式で入力)"
              value={formData.content}
              onChange={handleChange}
              rows={15}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute bottom-2 right-2"
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              画像アップロード
            </Button>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>
      ) : (
        <Card className="p-6">
          <article className="prose max-w-none">
            <h1>{formData.title}</h1>
            {/* ここにMarkdownプレビューを実装 */}
            <div dangerouslySetInnerHTML={{ __html: formData.content }} />
          </article>
        </Card>
      )}
    </form>
  )
}