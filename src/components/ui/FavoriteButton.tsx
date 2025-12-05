'use client'

import { Heart } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { FavoriteItem } from '@/types'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  item: Omit<FavoriteItem, 'addedAt'>
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showLabel?: boolean
}

export default function FavoriteButton({
  item,
  size = 'md',
  className,
  showLabel = false,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, mounted } = useFavorites()
  const favorited = mounted && isFavorite(item.id, item.type)

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(item)
      }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg transition-all duration-200',
        sizeClasses[size],
        favorited
          ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
          : 'text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700',
        className
      )}
      aria-label={favorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
    >
      <Heart
        className={cn(
          iconSizes[size],
          favorited && 'fill-current'
        )}
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {favorited ? 'Favorilerde' : 'Favorile'}
        </span>
      )}
    </button>
  )
}







