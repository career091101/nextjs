'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { User, AuthError } from '@supabase/supabase-js'

// 認証コンテキストの型定義
interface AuthContextType {
  user: User | null
  loading: boolean
  error: AuthError | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
}

// 認証コンテキストの作成
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// カスタムフックの作成
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 初期認証状態の確認
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        setUser(session?.user ?? null)
      } catch (e) {
        setError(e as AuthError)
      } finally {
        setLoading(false)
      }
    }

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    checkUser()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  // サインイン処理
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (e) {
      setError(e as AuthError)
      throw e
    } finally {
      setLoading(false)
    }
  }

  // サインアップ処理
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })
      if (error) throw error
    } catch (e) {
      setError(e as AuthError)
      throw e
    } finally {
      setLoading(false)
    }
  }

  // サインアウト処理
  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (e) {
      setError(e as AuthError)
      throw e
    } finally {
      setLoading(false)
    }
  }

  // ユーザー情報更新処理
  const updateUser = async (updates: Partial<User>) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.updateUser(updates)
      if (error) throw error
    } catch (e) {
      setError(e as AuthError)
      throw e
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
// _app.tsx または layout.tsx で
<AuthProvider>
  <App />
</AuthProvider>

// 任意のコンポーネントで
const MyComponent = () => {
  const { user, signIn, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {user ? (
        <p>Welcome, {user.email}</p>
      ) : (
        <button onClick={() => signIn('email', 'password')}>
          Sign In
        </button>
      )}
    </div>
  )
}