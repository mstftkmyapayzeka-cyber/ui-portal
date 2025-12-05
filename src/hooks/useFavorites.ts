'use client'

import { useState, useEffect, useCallback } from 'react'

export interface FavoriteItem {
  id: string
  type: 'article' | 'analysis' | 'podcast' | 'module'
  title: string
  addedAt: string
}

const STORAGE_KEY = 'ui-portal-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load favorites from localStorage
  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }, [])

  // Save favorites to localStorage
  const saveFavorites = useCallback((newFavorites: FavoriteItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites))
      setFavorites(newFavorites)
    } catch (error) {
      console.error('Error saving favorites:', error)
    }
  }, [])

  // Check if item is favorited (can check by id only or id + type)
  const isFavorite = useCallback(
    (id: string, type?: FavoriteItem['type']) => {
      if (type) {
        return favorites.some((f) => f.id === id && f.type === type)
      }
      return favorites.some((f) => f.id === id)
    },
    [favorites]
  )

  // Add to favorites
  const addFavorite = useCallback(
    (item: Omit<FavoriteItem, 'addedAt'>) => {
      if (isFavorite(item.id, item.type)) return

      const newFavorite: FavoriteItem = {
        ...item,
        addedAt: new Date().toISOString(),
      }
      saveFavorites([newFavorite, ...favorites])
    },
    [favorites, isFavorite, saveFavorites]
  )

  // Remove from favorites
  const removeFavorite = useCallback(
    (id: string, type?: FavoriteItem['type']) => {
      let newFavorites: FavoriteItem[]
      if (type) {
        newFavorites = favorites.filter((f) => !(f.id === id && f.type === type))
      } else {
        newFavorites = favorites.filter((f) => f.id !== id)
      }
      saveFavorites(newFavorites)
    },
    [favorites, saveFavorites]
  )

  // Toggle favorite
  const toggleFavorite = useCallback(
    (item: Omit<FavoriteItem, 'addedAt'> | FavoriteItem) => {
      if (isFavorite(item.id, item.type)) {
        removeFavorite(item.id, item.type)
      } else {
        addFavorite(item)
      }
    },
    [addFavorite, removeFavorite, isFavorite]
  )

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    saveFavorites([])
  }, [saveFavorites])

  // Get favorites by type
  const getFavoritesByType = useCallback(
    (type: FavoriteItem['type']) => {
      return favorites.filter((f) => f.type === type)
    },
    [favorites]
  )

  return {
    favorites,
    mounted,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    getFavoritesByType,
  }
}
