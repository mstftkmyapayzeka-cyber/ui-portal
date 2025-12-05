import Link from 'next/link'
import dynamic from 'next/dynamic'
import { supabase, Article, Analysis, Podcast, NewsItem, Concept } from '@/lib/supabase'
import HeroSlider from '@/components/ui/HeroSlider'
import { BookOpen, BarChart3, Mic, Newspaper, ArrowRight, Play, Lightbulb, Globe, TrendingUp, ExternalLink } from 'lucide-react'
import InteractiveImageCard from '@/components/ui/InteractiveImageCard'

// Dynamic import for client-side only globe component
const GlobePreview = dynamic(
  () => import('@/components/globe/GlobePreview'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-64 lg:h-80 bg-slate-900 rounded-3xl animate-pulse flex items-center justify-center">
        <Globe className="w-12 h-12 text-slate-700" />
      </div>
    )
  }
)

// Quick access cards data
const quickAccessCards = [
  {
    icon: BookOpen,
    title: 'Makaleler',
    description: 'Akademik araştırmalar ve derinlemesine analizler',
    href: '/makaleler',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: BarChart3,
    title: 'Analizler',
    description: 'Uzman değerlendirmeleri ve köşe yazıları',
    href: '/analizler',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: Mic,
    title: "Podcast'ler",
    description: 'Sesli ve görsel içerikler',
    href: '/podcastler',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: Newspaper,
    title: 'Gündem',
    description: 'Güncel uluslararası gelişmeler',
    href: '/guncel-gelismeler',
    gradient: 'from-teal-500 to-emerald-600',
  },
]

async function getHomeData() {
  const [articlesRes, analysesRes, podcastsRes, newsRes, conceptsRes] = await Promise.all([
    supabase
      .from('Article')
      .select('*')
      .eq('published', true)
      .order('createdAt', { ascending: false })
      .limit(4),
    supabase
      .from('Analysis')
      .select('*')
      .eq('published', true)
      .order('createdAt', { ascending: false })
      .limit(3),
    supabase
      .from('Podcast')
      .select('*')
      .eq('published', true)
      .order('createdAt', { ascending: false })
      .limit(1),
    supabase
      .from('NewsItem')
      .select('*')
      .eq('published', true)
      .order('publishedAt', { ascending: false })
      .limit(5),
    supabase
      .from('Concept')
      .select('*')
      .eq('published', true),
  ])

  const articles = (articlesRes.data || []) as Article[]
  const analyses = (analysesRes.data || []) as Analysis[]
  const podcasts = (podcastsRes.data || []) as Podcast[]
  const news = (newsRes.data || []) as NewsItem[]
  const concepts = (conceptsRes.data || []) as Concept[]

  // Random concept
  const concept = concepts.length > 0 ? concepts[Math.floor(Math.random() * concepts.length)] : null

  return { articles, analyses, podcasts, news, concept }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  const { articles, analyses, podcasts, news, concept } = await getHomeData()

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-950">
      {/* Hero Slider - Gündem Haberleri */}
      <HeroSlider news={news} />

      {/* Quick Access Cards */}
      <section className="relative z-10 -mt-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickAccessCards.map((card) => {
              const Icon = card.icon
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group relative p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Icon with gradient background */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>

                  <h3 className="text-slate-900 dark:text-white text-sm sm:text-base font-bold mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed hidden sm:block">
                    {card.description}
                  </p>

                  {/* Arrow */}
                  <ArrowRight className="absolute top-4 right-4 sm:top-6 sm:right-6 w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-500 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        {/* Concept of the Day */}
        {concept && (
          <section className="mb-12 lg:mb-16">
            <div className="relative p-6 sm:p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/30 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-200/30 dark:bg-amber-700/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 block">
                    Bugünün Kavramı
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                    {concept.name}
                  </h3>
                  <p className="text-amber-900/70 dark:text-amber-100/70 text-sm sm:text-base leading-relaxed mb-4">
                    {concept.shortDefinition}
                  </p>
                  {concept.detailedExplanation && (
                    <Link
                      href={`/ogren/${concept.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-sm hover:gap-3 transition-all duration-300"
                    >
                      Devamını Oku
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12 lg:space-y-16">

            {/* Latest Articles */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-teal-500 rounded-full" />
                  <h2 className="text-slate-900 dark:text-white text-xl sm:text-2xl font-display font-bold">
                    Yeni Makaleler
                  </h2>
                </div>
                <Link
                  href="/makaleler"
                  className="text-teal-600 dark:text-teal-400 font-semibold text-sm hover:underline flex items-center gap-1"
                >
                  Tümü
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {articles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {articles.map((article: Article) => {
                      const tags = article.tags ? article.tags.split(',').map(t => t.trim()) : []
                      const category = tags[0] || 'Makale'
                      return (
                        <InteractiveImageCard
                          key={article.id}
                          href={`/makaleler/${article.id}`}
                          image={article.imageUrl}
                          title={article.title}
                          subtitle={`${article.authors} • ${article.year || new Date(article.createdAt).getFullYear()}`}
                          badge={category}
                          badgeColor="bg-teal-500"
                        >
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400">
                              <BookOpen className="w-3.5 h-3.5" />
                              Özeti Oku
                            </span>
                            {article.externalUrl && (
                              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                                <ExternalLink className="w-3 h-3" />
                                Orijinal
                              </span>
                            )}
                          </div>
                        </InteractiveImageCard>
                      )
                    })}
                  </div>
                ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Henüz makale eklenmemiş.</p>
                </div>
              )}
            </section>

            {/* Latest Analyses */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-violet-500 rounded-full" />
                  <h2 className="text-slate-900 dark:text-white text-xl sm:text-2xl font-display font-bold">
                    Son Analizler
                  </h2>
                </div>
                <Link
                  href="/analizler"
                  className="text-teal-600 dark:text-teal-400 font-semibold text-sm hover:underline flex items-center gap-1"
                >
                  Tümü
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {analyses.length > 0 ? (
                <div className="space-y-4">
                  {analyses.map((analysis: Analysis) => {
                    const categories = analysis.categories ? analysis.categories.split(',').map(c => c.trim()) : []
                    const firstCategory = categories[0] || 'Analiz'
                    return (
                      <article
                        key={analysis.id}
                        className="group flex gap-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 hover:shadow-lg hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-300"
                      >
                        <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="inline-block px-2.5 py-1 mb-2 rounded-md bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-semibold">
                            {firstCategory}
                          </span>
                          <h3 className="text-slate-900 dark:text-white font-bold mb-1 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors leading-snug">
                            <Link href={`/analizler/${analysis.id}`}>
                              {analysis.title}
                            </Link>
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">
                            {analysis.author}
                          </p>
                        </div>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <BarChart3 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Henüz analiz eklenmemiş.</p>
                </div>
              )}
            </section>

            {/* Latest Podcasts */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-rose-500 rounded-full" />
                  <h2 className="text-slate-900 dark:text-white text-xl sm:text-2xl font-display font-bold">
                    Son Podcast
                  </h2>
                </div>
                <Link
                  href="/podcastler"
                  className="text-teal-600 dark:text-teal-400 font-semibold text-sm hover:underline flex items-center gap-1"
                >
                  Tümü
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {podcasts.length > 0 ? (
                <div className="space-y-4">
                  {podcasts.map((podcast: Podcast) => (
                    <article
                      key={podcast.id}
                      className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row">
                        {/* Thumbnail */}
                        <div className="sm:w-48 flex-shrink-0 relative">
                          <div
                            className="w-full aspect-video sm:aspect-square sm:h-full bg-cover bg-center bg-gradient-to-br from-rose-500 to-pink-600"
                            style={{
                              backgroundImage: podcast.thumbnailUrl
                                ? `url('${podcast.thumbnailUrl}')`
                                : undefined,
                            }}
                          >
                            {!podcast.thumbnailUrl && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Mic className="w-12 h-12 text-white/60" />
                              </div>
                            )}
                          </div>
                          {/* Play button overlay */}
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl">
                              <Play className="w-6 h-6 text-rose-500 ml-1" />
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-5 sm:p-6">
                          <span className="inline-block px-2.5 py-1 mb-3 rounded-md bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                            {podcast.topic}
                          </span>
                          <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                            <Link href={`/podcastler/${podcast.id}`}>
                              {podcast.title}
                            </Link>
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                            {podcast.description}
                          </p>
                          <Link
                            href={`/podcastler/${podcast.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition-colors"
                          >
                            <Play className="w-4 h-4" />
                            Dinle
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <Mic className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Henüz podcast eklenmemiş.</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* News Section */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                  <h2 className="text-slate-900 dark:text-white text-lg font-display font-bold">
                    Gündemden
                  </h2>
                </div>

                {news.length > 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {news.map((item: NewsItem, index: number) => (
                      <div
                        key={item.id}
                        className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${index !== news.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''
                          }`}
                      >
                        <Link href={`/guncel-gelismeler/${item.id}`} className="group">
                          <h4 className="text-slate-800 dark:text-slate-200 font-semibold leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-1.5 text-sm line-clamp-2">
                            {item.title}
                          </h4>
                        </Link>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {formatDate(item.publishedAt || item.createdAt)}
                          </p>
                          {item.sourceUrl && (
                            <a
                              href={item.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Kaynak
                            </a>
                          )}
                        </div>
                      </div>
                    ))}

                    <Link
                      href="/guncel-gelismeler"
                      className="block p-3 text-center text-teal-600 dark:text-teal-400 font-semibold text-sm hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors border-t border-slate-100 dark:border-slate-800"
                    >
                      Tüm Haberler →
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <Newspaper className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Henüz haber eklenmemiş.</p>
                  </div>
                )}
              </div>

              {/* Learn More CTA */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 text-white">
                <Globe className="w-10 h-10 text-teal-400 mb-4" />
                <h3 className="font-display text-lg font-bold mb-2">
                  Kavramları Keşfet
                </h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  Uluslararası ilişkilerin temel kavramlarını öğren.
                </p>
                <Link
                  href="/ogren"
                  className="inline-flex items-center gap-2 text-teal-400 font-semibold text-sm hover:text-teal-300 transition-colors"
                >
                  Öğrenmeye Başla
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Globe Preview Section */}
        <section className="mt-16 lg:mt-24">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mb-3">
              Dünyayı Keşfedin
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              İnteraktif 3D haritamız ile dünya genelindeki haberleri ve analizleri bölgelere göre keşfedin
            </p>
          </div>
          <GlobePreview totalNews={news.length} totalRegions={7} />
        </section>
      </div>

      {/* CTA Section */}
      <section className="w-full py-16 lg:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.15),transparent_60%)]" />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500 text-white mb-6">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Anlayışınızı Derinleştirin
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
            Akademisyenler, öğrenciler ve meraklılardan oluşan topluluğumuza katılın.
          </p>
          <Link
            href="/ogren"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold transition-all duration-300"
          >
            Öğrenmeye Başla
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
