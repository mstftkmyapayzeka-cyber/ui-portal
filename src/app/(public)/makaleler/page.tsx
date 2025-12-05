'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useFavorites } from '@/hooks/useFavorites'
import { FileText, Search, ChevronDown, Heart, ExternalLink, ChevronLeft, ChevronRight, BookOpen, ArrowRight } from 'lucide-react'
import InteractiveImageCard from '@/components/ui/InteractiveImageCard'

interface Article {
  id: string
  title: string
  authors: string
  journal: string | null
  year: number | null
  summary: string
  tags: string | null
  externalUrl: string | null
  imageUrl: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

// Tag color mapping
const tagColors: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
  hukuk: { bg: 'bg-teal-50', text: 'text-teal-800', darkBg: 'dark:bg-teal-500/10', darkText: 'dark:text-teal-300' },
  teknoloji: { bg: 'bg-sky-50', text: 'text-sky-800', darkBg: 'dark:bg-sky-500/10', darkText: 'dark:text-sky-300' },
  siyaset: { bg: 'bg-rose-50', text: 'text-rose-800', darkBg: 'dark:bg-rose-500/10', darkText: 'dark:text-rose-300' },
  küreselleşme: { bg: 'bg-amber-50', text: 'text-amber-800', darkBg: 'dark:bg-amber-500/10', darkText: 'dark:text-amber-300' },
  ekonomi: { bg: 'bg-lime-50', text: 'text-lime-800', darkBg: 'dark:bg-lime-500/10', darkText: 'dark:text-lime-300' },
  kriz: { bg: 'bg-red-50', text: 'text-red-800', darkBg: 'dark:bg-red-500/10', darkText: 'dark:text-red-300' },
  güvenlik: { bg: 'bg-orange-50', text: 'text-orange-800', darkBg: 'dark:bg-orange-500/10', darkText: 'dark:text-orange-300' },
  strateji: { bg: 'bg-cyan-50', text: 'text-cyan-800', darkBg: 'dark:bg-cyan-500/10', darkText: 'dark:text-cyan-300' },
  'avrupa birliği': { bg: 'bg-purple-50', text: 'text-purple-800', darkBg: 'dark:bg-purple-500/10', darkText: 'dark:text-purple-300' },
  brexit: { bg: 'bg-yellow-50', text: 'text-yellow-800', darkBg: 'dark:bg-yellow-500/10', darkText: 'dark:text-yellow-300' },
  ortadoğu: { bg: 'bg-pink-50', text: 'text-pink-800', darkBg: 'dark:bg-pink-500/10', darkText: 'dark:text-pink-300' },
  jeopolitik: { bg: 'bg-gray-100', text: 'text-gray-800', darkBg: 'dark:bg-gray-500/10', darkText: 'dark:text-gray-300' },
}

function getTagColor(tag: string) {
  const normalized = tag.toLowerCase()
  return tagColors[normalized] || {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    darkBg: 'dark:bg-slate-700',
    darkText: 'dark:text-slate-300',
  }
}

export default function MakalelerPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const { isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (yearFilter) params.set('year', yearFilter)
        params.set('page', page.toString())
        params.set('limit', '12')

        const res = await fetch(`/api/articles?${params.toString()}`)
        const data = await res.json()
        setArticles(data.articles || [])
        setTotalPages(data.totalPages || 1)
        setTotalCount(data.total || 0)
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [search, yearFilter, page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <main className="container mx-auto flex flex-1 flex-col px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start gap-4 border-b-2 border-slate-200/80 dark:border-slate-800 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
                Günün Makaleleri
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 mt-1">
                {totalCount} makale bulundu
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <form onSubmit={handleSearch} className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-grow">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 ring-0 ring-inset ring-transparent transition-all placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900/50 dark:placeholder:text-slate-500 dark:focus:bg-slate-900/50 dark:focus:ring-primary/30"
              placeholder="Başlık, yazar veya etikete göre ara..."
            />
          </div>
          <div className="relative flex-shrink-0 sm:w-48">
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value)
                setPage(1)
              }}
              className="h-12 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-left ring-0 ring-inset ring-transparent transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900/50 dark:focus:ring-primary/30"
            >
              <option value="">Tüm Yıllar</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
          </div>
        </form>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="article-card animate-pulse">
                <div className="p-6">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2 w-1/2"></div>
                  <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div>
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Makale bulunamadı
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Arama kriterlerinize uygun makale bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const tags = article.tags ? article.tags.split(',').map((t) => t.trim()) : []
              const category = tags[0] || 'Makale'
              const favoriteItem = {
                id: article.id,
                type: 'article' as const,
                title: article.title,
                addedAt: new Date().toISOString(),
              }

              return (
                <div key={article.id} className="relative group">
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(favoriteItem)}
                    className={`absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
                      isFavorite(article.id)
                        ? 'text-red-500 bg-red-500/20'
                        : 'text-white/70 hover:text-red-500 bg-black/20 hover:bg-red-500/20'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(article.id) ? 'fill-current' : ''}`} />
                  </button>

                  <InteractiveImageCard
                    href={`/makaleler/${article.id}`}
                    image={article.imageUrl}
                    title={article.title}
                    subtitle={`${article.authors} • ${article.year || new Date(article.createdAt).getFullYear()}`}
                    badge={category}
                    badgeColor="bg-teal-500"
                  >
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {article.summary}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {tags.slice(0, 3).map((tag) => {
                          const color = getTagColor(tag)
                          return (
                            <Link
                              key={tag}
                              href={`/etiket/${encodeURIComponent(tag)}`}
                              onClick={(e) => e.stopPropagation()}
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${color.bg} ${color.text} ${color.darkBg} ${color.darkText} hover:scale-105 transition-transform`}
                            >
                              {tag}
                            </Link>
                          )
                        })}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400">
                          <BookOpen className="w-3.5 h-3.5" />
                          Özeti Oku
                        </span>
                        {article.externalUrl && (
                          <a
                            href={article.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Orijinal
                          </a>
                        )}
                      </div>
                    </div>
                  </InteractiveImageCard>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-16 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed dark:text-slate-500 dark:hover:text-primary"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`flex h-11 w-11 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                    page === pageNum
                      ? 'bg-primary text-white'
                      : 'text-slate-500 hover:bg-primary/10 hover:text-primary dark:text-slate-400 dark:hover:text-primary'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            {totalPages > 5 && page < totalPages - 2 && (
              <>
                <span className="flex h-11 w-11 items-center justify-center text-sm font-semibold text-slate-400 dark:text-slate-500">
                  ...
                </span>
                <button
                  onClick={() => setPage(totalPages)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-sm font-semibold text-slate-500 transition-colors hover:bg-primary/10 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed dark:text-slate-500 dark:hover:text-primary"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </nav>
        )}
      </main>
    </div>
  )
}
