'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, FileText, TrendingUp, Headphones, Trash2 } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { FavoriteItem } from '@/types'
import { formatDate } from '@/lib/utils'

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites, getFavoritesByType, mounted } = useFavorites()
  const [activeTab, setActiveTab] = useState<'all' | 'article' | 'analysis' | 'podcast'>('all')

  const filteredFavorites = activeTab === 'all' 
    ? favorites 
    : getFavoritesByType(activeTab)

  const typeIcons: Record<'article' | 'analysis' | 'podcast' | 'module', typeof FileText> = {
    article: FileText,
    analysis: TrendingUp,
    podcast: Headphones,
    module: FileText, // Fallback icon for module
  }

  const typeLabels: Record<'article' | 'analysis' | 'podcast' | 'module', string> = {
    article: 'Makale',
    analysis: 'Analiz',
    podcast: 'Podcast',
    module: 'Modül',
  }

  const typeLinks: Record<'article' | 'analysis' | 'podcast' | 'module', string> = {
    article: '/makaleler',
    analysis: '/analizler',
    podcast: '/podcastler',
    module: '/ogren',
  }

  if (!mounted) {
    return (
      <div className="container-custom py-8 md:py-12">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
          <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8 md:py-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" />
            Favorilerim
          </h1>
          <p className="section-subtitle">
            Kaydettiğiniz içerikler ({favorites.length} öğe)
          </p>
        </div>
        
        {favorites.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Tüm favorileri silmek istediğinize emin misiniz?')) {
                clearFavorites()
              }
            }}
            className="btn-ghost text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Tümünü Temizle
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-teal-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Tümü ({favorites.length})
        </button>
        <button
          onClick={() => setActiveTab('article')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'article'
              ? 'bg-teal-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          Makaleler ({getFavoritesByType('article').length})
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'analysis'
              ? 'bg-teal-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Analizler ({getFavoritesByType('analysis').length})
        </button>
        <button
          onClick={() => setActiveTab('podcast')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'podcast'
              ? 'bg-teal-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Headphones className="w-4 h-4" />
          Podcastler ({getFavoritesByType('podcast').length})
        </button>
      </div>

      {/* Favorites List */}
      {filteredFavorites.length > 0 ? (
        <div className="space-y-3">
          {filteredFavorites.map((item) => {
            const Icon = typeIcons[item.type]
            const link = item.type === 'article' 
              ? `${typeLinks[item.type]}?highlight=${item.id}`
              : `${typeLinks[item.type]}/${item.id}`

            return (
              <div
                key={`${item.type}-${item.id}`}
                className="card p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link
                    href={link}
                    className="font-medium text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="badge badge-secondary text-xs">
                      {typeLabels[item.type]}
                    </span>
                    <span>·</span>
                    <span>{formatDate(item.addedAt)}</span>
                  </div>
                </div>

                <button
                  onClick={() => removeFavorite(item.id, item.type)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  aria-label="Favorilerden çıkar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Heart className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-2">
            {activeTab === 'all' ? 'Henüz Favori Yok' : 'Bu kategoride favori yok'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {activeTab === 'all'
              ? 'Makale, analiz ve podcastlerde kalp ikonuna tıklayarak favori ekleyebilirsiniz.'
              : 'Diğer kategorilere göz atın veya yeni içerikler keşfedin.'}
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/makaleler" className="btn-secondary">
              Makalelere Git
            </Link>
            <Link href="/analizler" className="btn-secondary">
              Analizlere Git
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}



