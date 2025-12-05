import Link from 'next/link'
import { supabase, NewsItem } from '@/lib/supabase'
import { Newspaper, MapPin, Filter, Calendar, ExternalLink, ArrowRight } from 'lucide-react'
import InteractiveImageCard from '@/components/ui/InteractiveImageCard'

export const metadata = {
  title: 'Güncel Gelişmeler',
  description: 'Dünya genelinden güncel uluslararası ilişkiler haberleri ve gelişmeleri',
}

const REGIONS = ['Avrupa', 'Orta Doğu', 'Asya-Pasifik', 'Kuzey Amerika', 'Güney Amerika', 'Afrika', 'Türkiye', 'Küresel']
const NEWS_CATEGORIES = ['Güvenlik', 'Ekonomi', 'Diplomasi', 'Siyaset', 'Enerji', 'Teknoloji', 'İklim', 'Göç']

interface PageProps {
  searchParams: Promise<{ region?: string; category?: string }>
}

async function getNews(searchParams: { region?: string; category?: string }) {
  let query = supabase
    .from('NewsItem')
    .select('*')
    .eq('published', true)
    .order('publishedAt', { ascending: false })

  if (searchParams.region) {
    query = query.eq('region', searchParams.region)
  }

  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching news:', error)
    return []
  }

  return (data || []) as NewsItem[]
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Region colors
const regionColors: Record<string, { bg: string; text: string; darkBg: string }> = {
  'Avrupa': { bg: 'bg-blue-100', text: 'text-blue-700', darkBg: 'dark:bg-blue-900/30 dark:text-blue-300' },
  'Orta Doğu': { bg: 'bg-amber-100', text: 'text-amber-700', darkBg: 'dark:bg-amber-900/30 dark:text-amber-300' },
  'Asya-Pasifik': { bg: 'bg-rose-100', text: 'text-rose-700', darkBg: 'dark:bg-rose-900/30 dark:text-rose-300' },
  'Kuzey Amerika': { bg: 'bg-cyan-100', text: 'text-cyan-700', darkBg: 'dark:bg-cyan-900/30 dark:text-cyan-300' },
  'Güney Amerika': { bg: 'bg-green-100', text: 'text-green-700', darkBg: 'dark:bg-green-900/30 dark:text-green-300' },
  'Afrika': { bg: 'bg-yellow-100', text: 'text-yellow-700', darkBg: 'dark:bg-yellow-900/30 dark:text-yellow-300' },
  'Türkiye': { bg: 'bg-red-100', text: 'text-red-700', darkBg: 'dark:bg-red-900/30 dark:text-red-300' },
  'Küresel': { bg: 'bg-violet-100', text: 'text-violet-700', darkBg: 'dark:bg-violet-900/30 dark:text-violet-300' },
}

export default async function NewsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const news = await getNews(params)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Newspaper className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold">
                Güncel Gelişmeler
              </h1>
              <p className="text-emerald-100 mt-1">
                Dünya genelinden uluslararası ilişkiler haberleri
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                <MapPin className="w-4 h-4" />
                Bölge
              </label>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/guncel-gelismeler"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    !params.region 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Tümü
                </Link>
                {REGIONS.map((region) => (
                  <Link
                    key={region}
                    href={`/guncel-gelismeler?region=${encodeURIComponent(region)}${params.category ? `&category=${params.category}` : ''}`}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      params.region === region 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {region}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                <Filter className="w-4 h-4" />
                Kategori
              </label>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/guncel-gelismeler${params.region ? `?region=${params.region}` : ''}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    !params.category 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Tümü
                </Link>
                {NEWS_CATEGORIES.map((category) => (
                  <Link
                    key={category}
                    href={`/guncel-gelismeler?category=${encodeURIComponent(category)}${params.region ? `&region=${params.region}` : ''}`}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      params.category === category 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* News Grid */}
        {news.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => {
              // Badge colors based on region
              const badgeColors: Record<string, string> = {
                'Avrupa': 'bg-blue-500',
                'Orta Doğu': 'bg-amber-500',
                'Asya-Pasifik': 'bg-rose-500',
                'Kuzey Amerika': 'bg-cyan-500',
                'Güney Amerika': 'bg-green-500',
                'Afrika': 'bg-yellow-500',
                'Türkiye': 'bg-red-500',
                'Küresel': 'bg-violet-500',
              }
              
              return (
                <InteractiveImageCard
                  key={item.id}
                  href={`/guncel-gelismeler/${item.id}`}
                  image={item.imageUrl}
                  title={item.title}
                  subtitle={formatDate(item.publishedAt || item.createdAt)}
                  badge={item.region}
                  badgeColor={badgeColors[item.region] || 'bg-slate-500'}
                >
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400">
                        <ArrowRight className="w-3.5 h-3.5" />
                        Devamını Oku
                      </span>
                      {item.sourceUrl && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs">
                          <ExternalLink className="w-3 h-3" />
                          Kaynak
                        </span>
                      )}
                    </div>
                  </div>
                </InteractiveImageCard>
              )
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
            <Newspaper className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">
              Haber Bulunamadı
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {params.region || params.category
                ? 'Seçili filtrelere uygun haber bulunamadı.'
                : 'Henüz haber eklenmemiş.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
