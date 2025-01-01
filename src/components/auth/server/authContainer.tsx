// /root/babel_generated/20241103_1243_20241103_1240_blogvault_official_nextjs_fastapi/frontend/components/auth/server/authContainer.tsx

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { type ReactNode } from 'react';
import { type Database } from '@/types/supabase';

interface AuthContainerProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRole?: string[];
}

export default function AuthContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  // 認証チェックを一時的に削除
  return <>{children}</>;
}

export async function checkAuthState() {
  return true;
  /* 一時的にコメントアウト
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
  */
}

export async function checkUserRole() {
  return true;
  /* 一時的にコメントアウト
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return false;

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  return userProfile && requiredRole.includes(userProfile.role);
  */
}

export async function getSessionUser() {
  return {
    id: 'mock-user-id',
    email: 'mock@example.com',
    role: 'admin'
  };
  /* 一時的にコメントアウト
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
  */
}