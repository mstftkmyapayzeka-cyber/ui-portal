'use client'

import { useFavorites, FavoriteItem } from '@/hooks/useFavorites'
import { Heart } from 'lucide-react'

interface FavoriteButtonClientProps {
  item: {
    id: string
    type: 'article' | 'analysis' | 'podcast' | 'module'
    title: string
  }
  className?: string
}

export default function FavoriteButtonClient({ item, className }: FavoriteButtonClientProps) {
  const { isFavorite, toggleFavorite } = useFavorites()

  const favoriteItem: FavoriteItem = {
    ...item,
    addedAt: new Date().toISOString(),
  }

  const handleClick = () => {
    toggleFavorite(favoriteItem)
  }

  const favorite = isFavorite(item.id)

  return (
    <button
      onClick={handleClick}
      className={className}
    >
      <Heart className={`w-4 h-4 ${favorite ? 'fill-current text-red-500' : ''}`} />
      <span>{favorite ? 'Favorilerde' : 'Favori'}</span>
    </button>
  )
}
