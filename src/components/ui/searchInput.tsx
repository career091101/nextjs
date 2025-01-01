'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface SearchInputProps {
  defaultValue?: string
  className?: string
  placeholder?: string
}

export default function SearchInput({
  defaultValue = '',
  className = '',
  placeholder = 'Search...',
}: SearchInputProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(defaultValue)

  // 検索パラメータが変更された時に入力値を更新
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '')
  }, [searchParams])

  // 検索処理
  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    params.delete('page') // 検索時にページをリセット
    router.push(`/blog?${params.toString()}`)
  }

  // 入力値の変更処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Enterキーで検索実行
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm)
    }
  }

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={() => handleSearch(searchTerm)}
      placeholder={placeholder}
      className={`block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm ${className}`}
    />
  )
} 