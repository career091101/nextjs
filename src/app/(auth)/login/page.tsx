'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthForm } from '@/components/auth/client/authForm'
import { login } from '@/lib/actions/auth'
import { toast } from '@/components/ui/toast'

// ログインページのメインコンポーネント
export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // ログイン処理のハンドラー
  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true)
      
      // ログインアクションの実行
      const result = await login(data)
      
      if (result.error) {
        toast({
          title: 'エラー',
          description: result.error,
          variant: 'destructive'
        })
        return
      }

      // ログイン成功時の処理
      toast({
        title: 'ログイン成功',
        description: 'ダッシュボードにリダイレクトします',
      })
      
      router.push('/dashboard')
      router.refresh()
      
    } catch (error) {
      toast({
        title: 'エラー',
        description: 'ログイン中にエラーが発生しました',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            アカウントにログイン
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            または{' '}
            <Link
              href="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              新規登録はこちら
            </Link>
          </p>
        </div>

        <AuthForm
          mode="login"
          onSubmit={handleLogin}
          isLoading={isLoading}
          submitText="ログイン"
        />

        <div className="text-center text-sm">
          <Link
            href="/forgot-password"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            パスワードをお忘れの方
          </Link>
        </div>
      </div>
    </div>
  )
}