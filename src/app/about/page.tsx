import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About | BlogVault',
  description: 'Learn more about BlogVault and our mission.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">About BlogVault</h1>
      
      <section className="prose lg:prose-lg">
        <p className="text-xl text-gray-600 mb-8">
          BlogVaultは、技術とクリエイティビティが交差する場所です。
          私たちは、知識の共有とコミュニティの成長を促進することを目指しています。
        </p>

        <h2 className="text-2xl font-semibold mb-4">私たちのミッション</h2>
        <p className="mb-6">
          高品質な技術コンテンツを提供し、開発者コミュニティの成長を支援することです。
          私たちは以下の価値観を大切にしています：
        </p>
        
        <ul className="space-y-4 mb-8">
          <li>
            <strong>品質：</strong> すべてのコンテンツは、正確性と実用性を重視しています。
          </li>
          <li>
            <strong>アクセシビリティ：</strong> 知識は誰もが利用できるべきです。
          </li>
          <li>
            <strong>コミュニティ：</strong> 相互学習と成長を促進します。
          </li>
          <li>
            <strong>革新：</strong> 常に最新の技術トレンドをキャッチアップします。
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">技術スタック</h2>
        <p className="mb-6">
          BlogVaultは最新のWeb技術を活用して構築されています：
        </p>
        
        <ul className="space-y-2 mb-8">
          <li>Next.js 14 - フロントエンド フレームワーク</li>
          <li>TypeScript - 型安全な開発</li>
          <li>Tailwind CSS - モダンなUIデザイン</li>
          <li>Prisma - データベース管理</li>
        </ul>

        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-semibold">お問い合わせ</h2>
          <p>
            ご質問やフィードバックがありましたら、お気軽にご連絡ください。
          </p>
          <div className="flex gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              お問い合わせ
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              ブログを読む
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 