'use client'

import { useState, useRef, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  LogOut, 
  Settings, 
  User as UserIcon,
  ChevronDown 
} from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface UserMenuProps {
  user: User | null
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // メニューの外側をクリックした時に閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.refresh()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (!user) return null

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center gap-2 rounded-full p-2 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user.user_metadata.avatar_url ? (
          <Image
            src={user.user_metadata.avatar_url}
            alt="User avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-gray-500" />
          </div>
        )}
        <span className="text-sm font-medium">
          {user.user_metadata.name || user.email}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            <Link
              href="/dashboard/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <UserIcon className="w-4 h-4 mr-2" />
              プロフィール
            </Link>
            
            <Link
              href="/dashboard/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 mr-2" />
              設定
            </Link>

            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </button>
          </div>
        </div>
      )}
    </div>
  )
}