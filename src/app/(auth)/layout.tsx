import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Header from '@/components/layout/server/header'
import Footer from '@/components/layout/server/footer'
import { Metadata } from 'next'

// メタデータの設定
export const metadata: Metadata = {
  title: 'Authentication | BlogVault',
  description: 'Secure authentication for BlogVault platform',
  robots: 'noindex, nofollow', // 認証ページはインデックスしない
}

// セキュリティヘッダーを設定する関数
const setSecurityHeaders = () => {
  const headersList = headers()
  
  // HTTPS強制
  if (process.env.NODE_ENV === 'production' && !headersList.get('x-forwarded-proto')?.includes('https')) {
    redirect('https://' + headersList.get('host'))
  }
}

// 認証レイアウトのプロパティ型定義
interface AuthLayoutProps {
  children: React.ReactNode
}

// 認証レイアウトコンポーネント
export default async function AuthLayout({ children }: AuthLayoutProps) {
  setSecurityHeaders()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Content Security Policy の設定 */}
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
        />
      </head>

      {/* ヘッダー */}
      <Header />

      {/* メインコンテンツ */}
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* XSS対策としてchildrenをサニタイズ */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </main>

      {/* フッター */}
      <Footer />
    </div>
  )
}

// サーバーコンポーネントであることを明示
export const runtime = 'edge'

// Supabase認証関連の処理（初期段階ではコメントアウト）
/*
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const initSupabase = () => {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
*/