import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // バリデーション
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: '必須項目が入力されていません。' },
        { status: 400 }
      )
    }

    // Supabaseにデータを保存
    const { error } = await supabase
      .from('contacts')
      .insert([
        {
          name,
          email,
          subject,
          message,
          status: 'new',
        },
      ])

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'データの保存に失敗しました。' },
        { status: 500 }
      )
    }

    // TODO: 自動返信メールの送信処理を追加

    return NextResponse.json(
      { message: 'お問い合わせを受け付けました。' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました。' },
      { status: 500 }
    )
  }
} 