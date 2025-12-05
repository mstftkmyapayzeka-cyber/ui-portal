import { supabase, Article } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, User, BookOpen, ExternalLink, Tag, Clock } from 'lucide-react'

async function getArticle(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('Article')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()

  if (error || !data) return null
  return data as Article
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = await getArticle(id)

  if (!article) {
    notFound()
  }

  const tags = article.tags ? article.tags.split(',').map(t => t.trim()) : []
  const readingTime = Math.ceil(article.summary.split(' ').length / 200) + 2
  const summaryParagraphs = article.summary
    ? article.summary.split(/\n\s*\n/).filter(Boolean)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Header with Image */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white overflow-hidden">
        {/* Background Image */}
        {article.imageUrl ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
          </>
        ) : (
          <>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          </>
        )}

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Back Button */}
          <Link 
            href="/makaleler"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Tüm Makaleler
          </Link>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/etiket/${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-sm font-medium backdrop-blur-sm transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 drop-shadow-lg">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-slate-200">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <User className="w-4 h-4" />
              <span className="font-medium">{article.authors}</span>
            </div>
            {article.year && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Calendar className="w-4 h-4" />
                <span>{article.year}</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4" />
              <span>{readingTime} dk okuma</span>
            </div>
          </div>

          {article.journalOrBook && (
            <p className="mt-6 text-teal-300 font-medium bg-teal-500/20 backdrop-blur-sm inline-flex items-center px-4 py-2 rounded-lg">
              <BookOpen className="w-4 h-4 mr-2" />
              {article.journalOrBook}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="reading-shell">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article className="reading-surface">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-teal-700/80 dark:text-teal-200">
                  <span className="hidden sm:block h-px w-10 bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
                  Sessiz Okuma Salonu
                  <span className="hidden sm:block h-px w-10 bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime} dk • Odaklanmış okuma</span>
                </div>
              </div>

              <div className="reading-divider my-8" />

              <div className="reading-body">
                {summaryParagraphs.length > 0 ? (
                  summaryParagraphs.map((paragraph, index) => (
                    <p key={index} className={index === 0 ? 'reading-dropcap' : undefined}>
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="reading-dropcap whitespace-pre-wrap">{article.summary}</p>
                )}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                  <p className="reading-label mb-2">Okuma Notu</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Metni akademik bir makale gibi ele alın; ana argümanı, yöntem ve bulguları ayrı ayrı not edin.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                  <p className="reading-label mb-2">Kaynakça Bilgisi</p>
                  <div className="text-sm text-slate-700 dark:text-slate-200 space-y-1">
                    {article.journalOrBook && <p>{article.journalOrBook}</p>}
                    {article.year && <p>{article.year} yayımlanma yılı</p>}
                    <p className="text-slate-500 dark:text-slate-400">Yazar: {article.authors}</p>
                  </div>
                </div>
              </div>
            </article>

            <aside className="space-y-4 lg:pl-2">
              <div className="reading-meta-card">
                <p className="reading-label mb-2">Künye</p>
                <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span className="font-semibold">{article.authors}</span>
                  </div>
                  {article.year && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>{article.year}</span>
                    </div>
                  )}
                  {article.journalOrBook && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span className="line-clamp-2">{article.journalOrBook}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="reading-meta-card">
                <p className="reading-label mb-3">Etiketler</p>
                {tags.length > 0 ? (
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
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Etiket eklenmemiş</p>
                )}
              </div>

              <div className="reading-meta-card">
                <p className="reading-label mb-2">Okuma Zamanı</p>
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>{readingTime} dakika</span>
                </div>
              </div>

              {article.externalUrl && (
                <a
                  href={article.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all duration-300 hover:from-teal-600 hover:to-emerald-600 hover:shadow-teal-500/40"
                >
                  <ExternalLink className="w-4 h-4" />
                  Orijinal Makale
                </a>
              )}
            </aside>
          </div>
        </div>

        {/* Related Info */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-4">Daha fazla akademik içerik keşfedin</p>
          <Link
            href="/makaleler"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-300"
          >
            <BookOpen className="w-4 h-4" />
            Tüm Makaleleri Gör
          </Link>
        </div>
      </div>
    </div>
  )
}
