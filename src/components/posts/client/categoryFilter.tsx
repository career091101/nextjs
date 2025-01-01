'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select } from '@/components/ui/select'

interface CategoryFilterProps {
  selectedCategory: string
  className?: string
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Programming', label: 'Programming' },
  { value: 'Web Development', label: 'Web Development' },
  { value: 'Design', label: 'Design' },
]

export default function CategoryFilter({
  selectedCategory,
  className,
}: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    params.delete('page') // Reset page when changing category
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <Select
      value={selectedCategory}
      onValueChange={handleCategoryChange}
      className={className}
    >
      {categories.map((category) => (
        <option key={category.value} value={category.value}>
          {category.label}
        </option>
      ))}
    </Select>
  )
} 