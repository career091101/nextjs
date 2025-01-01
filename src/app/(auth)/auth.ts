'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  try {
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) throw error;

    revalidatePath('/', 'layout');
    redirect('/dashboard'); //ログインしたらダッシュボードへ
  } catch (error) {
    // エラーの種類に応じて適切な処理を行う
    console.error('ログインエラー:', error);
    throw error;
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  try {
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const { error } = await supabase.auth.signUp(data);
    if (error) throw error;

    revalidatePath('/', 'layout');
    redirect('/'); // 一旦トップへ
  } catch (error) {
    // エラーの種類に応じて適切な処理を行う
    console.error('サインアップエラー:', error);
    throw error;
  }
}

export async function logout() {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    revalidatePath('/', 'layout');
    redirect('/'); // ログアウト後はトップページへ
  } catch (error) {
    // エラーの種類に応じて適切な処理を行う
    console.error('ログアウトエラー:', error);
    throw error;
  }
} 