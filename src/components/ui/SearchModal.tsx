'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, FileText, BookOpen, Headphones, Newspaper, Library, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchResult {
  articles: Array<{ id: string; title: string; authors: string }>
  analyses: Array<{ id: string; title: string; author: string }>
  podcasts: Array<{ id: string; title: string; topic: string }>
  news: Array<{ id: string; title: string; region: string }>
  modules: Array<{ id: string; title: string; slug: string }>
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const open = isOpen
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults(null)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      if (data.success) {
        setResults(data.data)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, search])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (open) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const handleNavigate = (url: string) => {
    router.push(url)
    onClose()
    setQuery('')
    setResults(null)
  }

  if (!open) return null

  const hasResults = results && (
    results.articles.length > 0 ||
    results.analyses.length > 0 ||
    results.podcasts.length > 0 ||
    results.news.length > 0 ||
    results.modules.length > 0
  )

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-[10vh]">
        <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Makale, analiz, podcast ara..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              autoFocus
            />
            {loading && <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />}
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
            {query.length < 2 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aramaya başlamak için en az 2 karakter girin</p>
              </div>
            ) : !hasResults && !loading ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <p>&quot;{query}&quot; için sonuç bulunamadı</p>
              </div>
            ) : (
              <div className="p-2">
                {/* Articles */}
                {results?.articles && results.articles.length > 0 && (
                  <ResultSection
                    title="Makaleler"
                    icon={<FileText className="w-4 h-4" />}
                    items={results.articles.map(a => ({
                      id: a.id,
                      title: a.title,
                      subtitle: a.authors,
                      url: `/makaleler?highlight=${a.id}`,
                    }))}
                    onNavigate={handleNavigate}
                  />
                )}

                {/* Analyses */}
                {results?.analyses && results.analyses.length > 0 && (
                  <ResultSection
                    title="Analizler"
                    icon={<BookOpen className="w-4 h-4" />}
                    items={results.analyses.map(a => ({
                      id: a.id,
                      title: a.title,
                      subtitle: a.author,
                      url: `/analizler/${a.id}`,
                    }))}
                    onNavigate={handleNavigate}
                  />
                )}

                {/* Podcasts */}
                {results?.podcasts && results.podcasts.length > 0 && (
                  <ResultSection
                    title="Podcastler"
                    icon={<Headphones className="w-4 h-4" />}
                    items={results.podcasts.map(p => ({
                      id: p.id,
                      title: p.title,
                      subtitle: p.topic,
                      url: `/podcastler/${p.id}`,
                    }))}
                    onNavigate={handleNavigate}
                  />
                )}

                {/* News */}
                {results?.news && results.news.length > 0 && (
                  <ResultSection
                    title="Güncel Gelişmeler"
                    icon={<Newspaper className="w-4 h-4" />}
                    items={results.news.map(n => ({
                      id: n.id,
                      title: n.title,
                      subtitle: n.region,
                      url: `/guncel-gelismeler?highlight=${n.id}`,
                    }))}
                    onNavigate={handleNavigate}
                  />
                )}

                {/* Modules */}
                {results?.modules && results.modules.length > 0 && (
                  <ResultSection
                    title="Öğrenme Modülleri"
                    icon={<Library className="w-4 h-4" />}
                    items={results.modules.map(m => ({
                      id: m.id,
                      title: m.title,
                      subtitle: '',
                      url: `/ogren/${m.slug}`,
                    }))}
                    onNavigate={handleNavigate}
                  />
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>ESC ile kapatın</span>
            <span>↵ ile seçin</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ResultSectionProps {
  title: string
  icon: React.ReactNode
  items: Array<{ id: string; title: string; subtitle: string; url: string }>
  onNavigate: (url: string) => void
}

function ResultSection({ title, icon, items, onNavigate }: ResultSectionProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        {icon}
        {title}
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.url)}
            className={cn(
              'w-full flex items-start gap-3 px-3 py-2 rounded-lg text-left transition-colors',
              'hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 dark:text-white truncate">
                {item.title}
              </p>
              {item.subtitle && (
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {item.subtitle}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}



