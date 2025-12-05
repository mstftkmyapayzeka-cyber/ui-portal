import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, MapPin, Folder, ExternalLink, Tag, Globe } from 'lucide-react'
import { ShareButton } from '@/components/ShareButton'

interface NewsItem {
  id: string
  title: string
  description: string
  region: string
  category: string
  tags: string
  publishedAt: string
  sourceUrl?: string | null
  imageUrl?: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

async function getNewsItem(id: string): Promise<NewsItem | null> {
  const { data, error } = await supabase
    .from('NewsItem')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()

  if (error || !data) return null
  return data as NewsItem
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Region colors
const regionColors: Record<string, string> = {
  'Avrupa': 'from-blue-500 to-indigo-600',
  'Orta Doğu': 'from-amber-500 to-orange-600',
  'Asya-Pasifik': 'from-rose-500 to-pink-600',
  'Kuzey Amerika': 'from-cyan-500 to-blue-600',
  'Güney Amerika': 'from-green-500 to-emerald-600',
  'Afrika': 'from-yellow-500 to-amber-600',
  'Türkiye': 'from-red-500 to-rose-600',
  'Küresel': 'from-violet-500 to-purple-600',
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const news = await getNewsItem(id)

  if (!news) {
    notFound()
  }

  const tags = news.tags ? news.tags.split(',').map(t => t.trim()) : []
  const gradientColor = regionColors[news.region] || 'from-slate-500 to-slate-600'
  const descriptionParagraphs = news.description
    ? news.description.split(/\n\s*\n/).filter(Boolean)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Header with Image */}
      <div className={`relative bg-gradient-to-br ${gradientColor} text-white overflow-hidden`}>
        {/* Background Image or Gradient */}
        {news.imageUrl ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={news.imageUrl}
                alt={news.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
          </>
        )}

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Back Button */}
          <Link
            href="/guncel-gelismeler"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Tüm Haberler
          </Link>

          {/* Category & Region Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-bold shadow-lg">
              <MapPin className="w-4 h-4" />
              {news.region}
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-bold shadow-lg">
              <Folder className="w-4 h-4" />
              {news.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 drop-shadow-lg">
            {news.title}
          </h1>

          {/* Date */}
          <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm inline-flex px-4 py-2 rounded-full">
            <Calendar className="w-4 h-4" />
            <time dateTime={news.publishedAt}>
              {formatDate(news.publishedAt || news.createdAt)}
            </time>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="reading-shell">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
            <article className="reading-surface">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">
                  <span className="hidden sm:block h-px w-10 bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
                  Haber Okuma Salonu
                  <span className="hidden sm:block h-px w-10 bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(news.publishedAt || news.createdAt)}
                </div>
              </div>

              <div className="reading-divider my-8" />

              <div className="reading-body">
                {descriptionParagraphs.length > 0 ? (
                  descriptionParagraphs.map((paragraph, index) => (
                    <p key={index} className={index === 0 ? 'reading-dropcap' : undefined}>
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="reading-dropcap whitespace-pre-wrap">{news.description}</p>
                )}
              </div>

              {tags.length > 0 && (
                <div className="mt-10">
                  <p className="reading-label mb-3">Etiketler</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/etiket/${encodeURIComponent(tag)}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-teal-900/40 dark:hover:text-teal-300"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            <aside className="space-y-4 lg:pl-2">
              <div className="reading-meta-card">
                <p className="reading-label mb-2">Bölge & Kategori</p>
                <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>{news.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>{news.category}</span>
                  </div>
                </div>
              </div>

              <div className="reading-meta-card">
                <p className="reading-label mb-2">Yayın Tarihi</p>
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <time dateTime={news.publishedAt}>{formatDate(news.publishedAt || news.createdAt)}</time>
                </div>
              </div>

              {news.sourceUrl && (
                <div className="reading-meta-card">
                  <p className="reading-label mb-2">Kaynak</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    {(() => {
                      try {
                        return new URL(news.sourceUrl as string).hostname
                      } catch {
                        return news.sourceUrl
                      }
                    })()}
                  </p>
                  <a
                    href={news.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${gradientColor} px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:shadow-xl`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Kaynağa Git
                  </a>
                </div>
              )}
            </aside>
          </div>
        </div>

        {/* Share & Navigation */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link
            href="/guncel-gelismeler"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Tüm Haberlere Dön
          </Link>

          <ShareButton title={news.title} />
        </div>
      </div>
    </div>
  )
}
