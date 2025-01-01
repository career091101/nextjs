import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'お問い合わせ完了 | BlogVault',
  description: 'お問い合わせありがとうございます。',
}

export default function ContactSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">お問い合わせありがとうございます</h1>
      
      <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <p className="text-gray-600 mb-4">
          お問い合わせを受け付けました。
          通常2-3営業日以内にご返信させていただきます。
        </p>
        <p className="text-gray-600">
          自動返信メールを送信しましたので、ご確認ください。
          メールが届かない場合は、お手数ですが再度お問い合わせください。
        </p>
      </div>

      <div className="space-x-4">
        <Link href="/">
          <Button variant="outline">
            ホームに戻る
          </Button>
        </Link>
        <Link href="/blog">
          <Button>
            ブログを読む
          </Button>
        </Link>
      </div>
    </div>
  )
} 