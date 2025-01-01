import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Welcome to BlogVault',
  description: 'Discover a world of insightful articles and knowledge sharing.',
}

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-5xl font-bold mb-6">Welcome to BlogVault</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Your modern platform for discovering and sharing knowledge through engaging blog posts.
      </p>
      
      <div className="flex gap-4">
        <Link
          href="/blog"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Read Blog Posts
        </Link>
        <Link
          href="/about"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Learn More
        </Link>
      </div>
    </div>
  )
} 