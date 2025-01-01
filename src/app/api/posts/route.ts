import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

// 投稿のバリデーションスキーマ
const postSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(100, "タイトルは100文字以内です"),
  content: z.string().min(1, "内容は必須です"),
  slug: z.string().min(1, "スラッグは必須です").regex(/^[a-z0-9-]+$/, "スラッグは小文字、数字、ハイフンのみ使用可能です"),
  published: z.boolean().default(false),
});

/**
 * GET: 投稿一覧を取得
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // 投稿一覧を取得
    const { data: posts, error, count } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: '投稿の取得に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });

  } catch (error) {
    console.error('Error in GET /api/posts:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * POST: 新規投稿を作成
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // セッションチェック
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // リクエストボディのパース
    const body = await request.json();

    // バリデーション
    const validationResult = postSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'バリデーションエラー', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const postData = {
      ...validationResult.data,
      author_id: session.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 投稿の作成
    const { data: post, error } = await supabase
      .from('posts')
      .insert([postData])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // ユニーク制約違反
        return NextResponse.json(
          { error: 'このスラッグは既に使用されています' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: '投稿の作成に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(post, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/posts:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}