import prisma from '@/lib/prisma'
import PodcastCard from '@/components/cards/PodcastCard'
import { Headphones, Star } from 'lucide-react'

export const metadata = {
  title: 'Podcastler',
  description: 'Uluslararası ilişkiler podcast ve video içerikleri',
}

async function getPodcasts() {
  const [featuredPodcast, podcasts] = await Promise.all([
    prisma.podcast.findFirst({
      where: { published: true, featured: true },
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.podcast.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    }),
  ])

  return { featuredPodcast, podcasts }
}

export default async function PodcastsPage() {
  const { featuredPodcast, podcasts } = await getPodcasts()

  // Öne çıkan podcast listeden çıkar
  const regularPodcasts = featuredPodcast
    ? podcasts.filter((p) => p.id !== featuredPodcast.id)
    : podcasts

  return (
    <div className="container-custom py-8 md:py-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-3">
          <Headphones className="w-8 h-8 text-teal-600" />
          Podcastler
        </h1>
        <p className="section-subtitle">
          Video ve ses formatında uluslararası ilişkiler içerikleri
        </p>
      </div>

      {/* Featured Podcast */}
      {featuredPodcast && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-medium text-slate-900 dark:text-white">
              Öne Çıkan
            </h2>
          </div>
          <PodcastCard podcast={featuredPodcast} featured />
        </section>
      )}

      {/* All Podcasts */}
      <section>
        <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6">
          Tüm Podcastler
        </h2>

        {regularPodcasts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regularPodcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        ) : podcasts.length === 0 ? (
          <div className="card p-12 text-center">
            <Headphones className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-2">
              Henüz Podcast Yok
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Podcast içerikleri yakında eklenecek.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  )
}







