import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/layout/server/header'
import Footer from '@/components/layout/server/footer'
import { Providers } from './providers'
import './globals.css'

// フォントの設定
const inter = Inter({ subsets: ['latin'] })

// メタデータの設定
export const metadata: Metadata = {
  title: 'BlogVault - Your Modern Blog Platform',
  description: 'A modern blogging platform built with Next.js and FastAPI',
  keywords: ['blog', 'nextjs', 'fastapi', 'modern web'],
  authors: [{ name: 'BlogVault Team' }],
  robots: 'index, follow',
  manifest: '/site.webmanifest',
}

// ビューポートの設定
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

// レイアウトのプロパティ型定義
interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        {/* プロバイダーを一時的にバイパス */}
        {/* <Providers> */}
          {/* 全体のレイアウト構造 */}
          <div className="min-h-screen flex flex-col">
            {/* ヘッダーコンポーネント */}
            <Header />
            
            {/* メインコンテンツ */}
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            
            {/* フッターコンポーネント */}
            <Footer />
          </div>
        {/* </Providers> */}
      </body>
    </html>
  )
}

// キャッシュとリバリデーション設定
export const revalidate = 3600 // 1時間ごとにリバリデーション

// 動的レンダリング設定
export const dynamic = 'force-dynamic'

// セキュリティヘッダー設定
export const headers = {
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}