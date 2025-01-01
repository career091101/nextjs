// /root/babel_generated/20241103_1243_20241103_1240_blogvault_official_nextjs_fastapi/frontend/app/(protected)/layout.tsx

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import AuthContainer from '@/components/auth/server/authContainer';
import Header from '@/components/layout/server/header';
import { createServerClient } from '@supabase/ssr';

// セキュリティヘッダーを設定する関数
const setSecurityHeaders = async () => {
  /* 一時的にコメントアウト
  const headersList = headers();
  
  // HTTPS強制
  if (process.env.NODE_ENV === 'production' && !headersList.get('x-forwarded-proto')?.includes('https')) {
    redirect(`${process.env.NEXT_PUBLIC_SITE_URL}`);
  }
  */
};

export const metadata = {
  title: 'Protected Area | BlogVault',
  description: 'Secure area for authenticated users',
  robots: 'noindex, nofollow',
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 認証チェックを一時的に削除
  return <>{children}</>;
}