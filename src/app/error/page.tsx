'use client';

import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="text-center">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">エラーが発生しました</h1>
        <p className="mt-6 text-base leading-7 text-gray-600">申し訳ありません。問題が発生しました。</p>
        <div className="mt-10">
          <Link
            href="/"
            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
} 