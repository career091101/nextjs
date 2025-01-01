'use client'

import { useState } from 'react'
import { AuthForm } from '@/components/auth/client/authForm'
import { signUp } from '@/lib/actions/auth'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/toast'

// パスワード要件のスキーマ
const passwordSchema = z
  .string()
  .min(8, 'パスワードは8文字以上である必要があります')
  .regex(/[A-Z]/, '大文字を含める必要があります')
  .regex(/[a-z]/, '小文字を含める必要があります')
  .regex(/[0-9]/, '数字を含める必要があります')
  .regex(/[^A-Za-z0-9]/, '特殊文字を含める必要があります')

// サインアップフォームのスキーマ
const signUpSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: passwordSchema,
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: '利用規約に同意する必要があります',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
})

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: z.infer<typeof signUpSchema>) => {
    try {
      setIsLoading(true)
      
      // パスワード要件の検証
      const passwordValidation = passwordSchema.safeParse(formData.password)
      if (!passwordValidation.success) {
        toast({
          title: 'エラー',
          description: passwordValidation.error.errors[0].message,
          variant: 'destructive',
        })
        return
      }

      // サインアップ処理
      const result = await signUp({
        email: formData.email,
        password: formData.password,
      })

      if (result.error) {
        toast({
          title: 'サインアップエラー',
          description: result.error.message,
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'サインアップ成功',
        description: '確認メールを送信しました。メールを確認してください。',
      })

      // ログインページへリダイレクト
      router.push('/login')
    } catch (error) {
      console.error('SignUp error:', error)
      toast({
        title: 'エラー',
        description: 'サインアップ中にエラーが発生しました',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formFields = [
    {
      name: 'email',
      label: 'メールアドレス',
      type: 'email',
      required: true,
    },
    {
      name: 'password',
      label: 'パスワード',
      type: 'password',
      required: true,
      helperText: 'パスワードは8文字以上で、大文字、小文字、数字、特殊文字を含める必要があります',
    },
    {
      name: 'confirmPassword',
      label: 'パスワード（確認）',
      type: 'password',
      required: true,
    },
    {
      name: 'agreeToTerms',
      label: '利用規約に同意する',
      type: 'checkbox',
      required: true,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">アカウント作成</h1>
        <AuthForm
          fields={formFields}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitText="サインアップ"
          validationSchema={signUpSchema}
        />
      </div>
    </div>
  )
}