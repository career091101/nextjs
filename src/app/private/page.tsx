import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/auth');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">プライベートページ</h1>
        <p className="mt-4 text-lg text-gray-600">
          ようこそ、<span className="font-semibold">{data.user.email}</span> さん
        </p>
      </div>
    </div>
  );
} 