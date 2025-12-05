import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import prisma from '@/lib/prisma'
import { formatDate, formatDuration, parseJsonArray } from '@/lib/utils'
import { TagList } from '@/components/ui/Tag'
import FavoriteButton from '@/components/ui/FavoriteButton'
import PodcastCard from '@/components/cards/PodcastCard'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps) {
  const podcast = await prisma.podcast.findUnique({
    where: { id: params.id, published: true },
  })

  if (!podcast) {
    return { title: 'Podcast Bulunamadı' }
  }

  return {
    title: podcast.title,
    description: podcast.description,
  }
}

async function getPodcast(id: string) {
  const podcast = await prisma.podcast.findUnique({
    where: { id, published: true },
  })

  if (!podcast) return null

  // Önceki ve sonraki podcast
  const [prevPodcast, nextPodcast, relatedPodcasts] = await Promise.all([
    prisma.podcast.findFirst({
      where: {
        published: true,
        publishedAt: { lt: podcast.publishedAt },
      },
      orderBy: { publishedAt: 'desc' },
      select: { id: true, title: true },
    }),
    prisma.podcast.findFirst({
      where: {
        published: true,
        publishedAt: { gt: podcast.publishedAt },
      },
      orderBy: { publishedAt: 'asc' },
      select: { id: true, title: true },
    }),
    prisma.podcast.findMany({
      where: {
        id: { not: id },
        published: true,
        topic: podcast.topic,
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
    }),
  ])

  return { podcast, prevPodcast, nextPodcast, relatedPodcasts }
}

export default async function PodcastDetailPage({ params }: PageProps) {
  const data = await getPodcast(params.id)

  if (!data) {
    notFound()
  }

  const { podcast, prevPodcast, nextPodcast, relatedPodcasts } = data
  const tags = parseJsonArray(podcast.tags)

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-slate-900 py-6">
        <div className="container-custom">
          <Link
            href="/podcastler"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tüm Podcastler
          </Link>
        </div>
      </div>

      {/* Video Player */}
      <div className="bg-black">
        <div className="container-custom py-4">
          <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden">
            <video
              src={podcast.videoUrl}
              controls
              className="w-full h-full"
              poster={podcast.thumbnailUrl || undefined}
            >
              Tarayıcınız video etiketini desteklemiyor.
            </video>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <span className="badge badge-primary mb-3">{podcast.topic}</span>
            
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white">
                {podcast.title}
              </h1>
              <FavoriteButton
                item={{
                  id: podcast.id,
                  type: 'podcast',
                  title: podcast.title,
                }}
              />
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {formatDuration(podcast.durationMinutes)}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(podcast.publishedAt)}
              </span>
            </div>

            {/* Description */}
            <div className="prose-custom mb-8">
              {podcast.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
                  Etiketler
                </h3>
                <TagList tags={tags} size="md" />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              {prevPodcast ? (
                <Link
                  href={`/podcastler/${prevPodcast.id}`}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm line-clamp-1 max-w-[200px]">
                    {prevPodcast.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              
              {nextPodcast ? (
                <Link
                  href={`/podcastler/${nextPodcast.id}`}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <span className="text-sm line-clamp-1 max-w-[200px]">
                    {nextPodcast.title}
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>

          {/* Sidebar - Related */}
          <aside>
            {relatedPodcasts.length > 0 && (
              <div className="sticky top-24">
                <h3 className="font-medium text-slate-900 dark:text-white mb-4">
                  İlgili Podcastler
                </h3>
                <div className="space-y-4">
                  {relatedPodcasts.map((related) => (
                    <PodcastCard key={related.id} podcast={related} showFavorite={false} />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}







