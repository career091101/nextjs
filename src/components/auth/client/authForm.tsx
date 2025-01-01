'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'

// フォームの型定義
interface AuthFormProps {
  mode: 'login' | 'signup'
  onSubmit: (email: string, password: string, name?: string) => Promise<void>
}

// バリデーションスキーマ
const authSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上である必要があります')
    .max(100, 'パスワードは100文字以下である必要があります'),
  name: z.string().min(2, '名前は2文字以上である必要があります').optional(),
})

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // エラーをクリア
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const validateForm = () => {
    try {
      const dataToValidate = mode === 'signup' 
        ? formData 
        : { email: formData.email, password: formData.password }
      authSchema.parse(dataToValidate)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setIsLoading(true)
      await onSubmit(
        formData.email,
        formData.password,
        mode === 'signup' ? formData.name : undefined
      )
      toast({
        title: mode === 'login' ? 'ログイン成功' : 'アカウント作成成功',
        description: mode === 'login' 
          ? 'ダッシュボードにリダイレクトします' 
          : 'アカウントが作成されました',
        variant: 'success',
      })
      router.push('/dashboard')
    } catch (error) {
      toast({
        title: 'エラーが発生しました',
        description: error instanceof Error ? error.message : '認証に失敗しました',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'signup' && (
        <div className="space-y-2">
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="名前"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            aria-describedby="name-error"
          />
          {errors.name && (
            <p className="text-sm text-red-500" id="name-error">
              {errors.name}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="メールアドレス"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          aria-describedby="email-error"
        />
        {errors.email && (
          <p className="text-sm text-red-500" id="email-error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="パスワード"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          aria-describedby="password-error"
        />
        {errors.password && (
          <p className="text-sm text-red-500" id="password-error">
            {errors.password}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          '処理中...'
        ) : mode === 'login' ? (
          'ログイン'
        ) : (
          'アカウント作成'
        )}
      </Button>
    </form>
  )
}