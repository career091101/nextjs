import { Metadata } from 'next'
import ContactForm from '@/components/contact/contactForm'

export const metadata: Metadata = {
  title: 'お問い合わせ | BlogVault',
  description: 'BlogVaultへのお問い合わせはこちらから。',
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">お問い合わせ</h1>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <p className="text-gray-600 mb-8">
          ご質問、ご要望、その他お問い合わせは以下のフォームよりお願いいたします。
          通常2-3営業日以内にご返信させていただきます。
        </p>

        <ContactForm />
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <h2 className="font-semibold mb-2">その他のお問い合わせ方法</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            メール：
            <a
              href="mailto:support@blogvault.com"
              className="text-indigo-600 hover:text-indigo-500"
            >
              support@blogvault.com
            </a>
          </li>
          <li>
            Twitter：
            <a
              href="https://twitter.com/blogvault"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500"
            >
              @blogvault
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
} 