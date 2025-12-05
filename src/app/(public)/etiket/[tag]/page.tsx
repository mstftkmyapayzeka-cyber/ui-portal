import Link from 'next/link'
import { Tag, ArrowLeft } from 'lucide-react'
import prisma from '@/lib/prisma'
import ArticleCard from '@/components/cards/ArticleCard'
import AnalysisCard from '@/components/cards/AnalysisCard'
import PodcastCard from '@/components/cards/PodcastCard'
import NewsCard from '@/components/cards/NewsCard'

interface PageProps {
  params: { tag: string }
}

export async function generateMetadata({ params }: PageProps) {
  const tag = decodeURIComponent(params.tag)
  return {
    title: `"${tag}" Etiketi`,
    description: `${tag} etiketine sahip tüm içerikler`,
  }
}

async function getTaggedContent(tag: string) {
  const searchPattern = `"${tag}"`

  const [articles, analyses, podcasts, news] = await Promise.all([
    prisma.article.findMany({
      where: {
        published: true,
        tags: { contains: tag },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.analysis.findMany({
      where: {
        published: true,
        tags: { contains: tag },
      },
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.podcast.findMany({
      where: {
        published: true,
        tags: { contains: tag },
      },
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.newsItem.findMany({
      where: {
        published: true,
        tags: { contains: tag },
      },
      orderBy: { publishedAt: 'desc' },
    }),
  ])

  return { articles, analyses, podcasts, news }
}

export default async function TagPage({ params }: PageProps) {
  const tag = decodeURIComponent(params.tag)
  const { articles, analyses, podcasts, news } = await getTaggedContent(tag)

  const totalCount = articles.length + analyses.length + podcasts.length + news.length

  return (
    <div className="container-custom py-8 md:py-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfa
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
            <Tag className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white">
              &quot;{tag}&quot;
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {totalCount} içerik bulundu
            </p>
          </div>
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="card p-12 text-center">
          <Tag className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-2">
            İçerik Bulunamadı
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Bu etikete sahip içerik bulunamadı.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Articles */}
          {articles.length > 0 && (
            <section>
              <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                Makaleler
                <span className="badge badge-secondary">{articles.length}</span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          )}

          {/* Analyses */}
          {analyses.length > 0 && (
            <section>
              <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                Analizler
                <span className="badge badge-secondary">{analyses.length}</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {analyses.map((analysis) => (
                  <AnalysisCard key={analysis.id} analysis={analysis} />
                ))}
              </div>
            </section>
          )}

          {/* Podcasts */}
          {podcasts.length > 0 && (
            <section>
              <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                Podcastler
                <span className="badge badge-secondary">{podcasts.length}</span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {podcasts.map((podcast) => (
                  <PodcastCard key={podcast.id} podcast={podcast} />
                ))}
              </div>
            </section>
          )}

          {/* News */}
          {news.length > 0 && (
            <section>
              <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                Güncel Gelişmeler
                <span className="badge badge-secondary">{news.length}</span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}







