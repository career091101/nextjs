'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase/server'
import { z } from 'zod'
import type { Post } from '@/types'

// バリデーションスキーマ
const postSchema = z.object({
  title: z.string().min(1, '題名は必須です').max(100, '題名は100文字以内で入力してください'),
  content: z.string().min(1, '本文は必須です'),
  slug: z.string().min(1, 'スラッグは必須です').regex(/^[a-z0-9-]+$/, 'スラッグは半角英数字とハイフンのみ使用できます'),
  published: z.boolean().default(false),
})

type PostInput = z.infer<typeof postSchema>

/**
 * 投稿を作成する
 */
export async function createPost(input: PostInput): Promise<{ data: Post | null; error: string | null }> {
  try {
    // バリデーション
    const validatedData = postSchema.parse(input)

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { data: session, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return { data: null, error: '認証エラーが発生しました' }
    }

    const { data, error } = await supabase
      .from('posts')
      .insert({
        ...validatedData,
        author_id: session.session?.user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/dashboard/posts')
    return { data, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, error: error.errors[0].message }
    }
    return { data: null, error: '投稿の作成に失敗しました' }
  }
}

/**
 * 投稿を更新する
 */
export async function updatePost(id: string, input: Partial<PostInput>): Promise<{ data: Post | null; error: string | null }> {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { data: session, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return { data: null, error: '認証エラーが発生しました' }
    }

    // 所有者チェック
    const { data: existingPost } = await supabase
      .from('posts')
      .select()
      .eq('id', id)
      .single()

    if (existingPost?.author_id !== session.session?.user.id) {
      return { data: null, error: '権限がありません' }
    }

    const { data, error } = await supabase
      .from('posts')
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/dashboard/posts')
    revalidatePath(`/blog/${existingPost.slug}`)
    return { data, error: null }
  } catch (error) {
    return { data: null, error: '投稿の更新に失敗しました' }
  }
}

/**
 * 投稿を削除する
 */
export async function deletePost(id: string): Promise<{ error: string | null }> {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { data: session, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return { error: '認証エラーが発生しました' }
    }

    // 所有者チェック
    const { data: existingPost } = await supabase
      .from('posts')
      .select()
      .eq('id', id)
      .single()

    if (existingPost?.author_id !== session.session?.user.id) {
      return { error: '権限がありません' }
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/dashboard/posts')
    return { error: null }
  } catch (error) {
    return { error: '投稿の削除に失敗しました' }
  }
}

/**
 * 投稿を取得する
 */
export async function getPost(id: string): Promise<{ data: Post | null; error: string | null }> {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { data, error } = await supabase
      .from('posts')
      .select()
      .eq('id', id)
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error: '投稿の取得に失敗しました' }
  }
}