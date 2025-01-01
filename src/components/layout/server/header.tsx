// frontend/components/layout/server/header.tsx
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

// ナビゲーションリンクの型定義
type NavLink = {
  href: string
  label: string
}

// メインナビゲーションリンク
const mainNavLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* ロゴ */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">BlogVault</span>
          </Link>

          {/* メインナビゲーション */}
          <nav className="hidden md:flex gap-6">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 右側のコンテンツ */}
        <div className="flex items-center gap-4">
          {/* 検索バー */}
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="pl-8 md:w-[200px] lg:w-[300px]"
            />
          </div>

          {/* 認証ボタン */}
          <div className="flex gap-3">
            <Link
              href="/auth/signup"
              className="hidden md:inline-flex rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              新規登録
            </Link>
            <Link
              href="/auth"
              className="rounded-md px-3 py-2 text-sm font-semibold text-blue-600 ring-1 ring-blue-300 hover:bg-blue-50 transition-colors"
            >
              ログイン
            </Link>
          </div>
        </div>
      </div>

      {/* モバイル用検索バー */}
      <div className="container py-2 md:hidden">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts..."
            className="pl-8 w-full"
          />
        </div>
      </div>
    </header>
  )
}