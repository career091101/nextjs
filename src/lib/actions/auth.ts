'use strict';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Database } from '@/types/supabase';

// バリデーションスキーマ
const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上である必要があります'),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, '名前は2文字以上である必要があります'),
});

// 型定義
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

/**
 * ログインアクション
 * @param formData - ログインフォームデータ
 * @returns 認証結果とエラーメッセージ（存在する場合）
 */
export async function login(formData: LoginFormData) {
  try {
    const validated = loginSchema.parse(formData);
    const supabase = createClientComponentClient<Database>();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath('/dashboard');
    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    return {
      success: false,
      error: '予期せぬエラーが発生しました',
    };
  }
}

/**
 * サインアップアクション
 * @param formData - サインアップフォームデータ
 * @returns 登録結果とエラーメッセージ（存在する場合）
 */
export async function signup(formData: SignupFormData) {
  try {
    const validated = signupSchema.parse(formData);
    const supabase = createClientComponentClient<Database>();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          name: validated.name,
        },
      },
    });

    if (authError) {
      return {
        success: false,
        error: authError.message,
      };
    }

    // ユーザープロフィールの作成
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            name: validated.name,
            email: validated.email,
          },
        ]);

      if (profileError) {
        return {
          success: false,
          error: profileError.message,
        };
      }
    }

    revalidatePath('/auth/login');
    return {
      success: true,
      data: authData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    return {
      success: false,
      error: '予期せぬエラーが発生しました',
    };
  }
}

/**
 * ログアウトアクション
 * @returns ログアウト結果とエラーメッセージ（存在する場合）
 */
export async function logout() {
  try {
    const supabase = createClientComponentClient<Database>();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath('/');
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: '予期せぬエラーが発生しました',
    };
  }
}

/**
 * セッション取得アクション
 * @returns 現在のセッション情報
 */
export async function getSession() {
  try {
    const supabase = createClientComponentClient<Database>();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      session,
    };
  } catch (error) {
    return {
      success: false,
      error: '予期せぬエラーが発生しました',
    };
  }
}