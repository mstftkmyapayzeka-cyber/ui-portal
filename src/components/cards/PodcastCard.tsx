'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Play, Clock, Calendar, Star } from 'lucide-react'
import { Podcast } from '@/types'
import { parseJsonArray, formatDate, formatDuration } from '@/lib/utils'
import { TagList } from '@/components/ui/Tag'
import FavoriteButton from '@/components/ui/FavoriteButton'

interface PodcastCardProps {
  podcast: Podcast
  showFavorite?: boolean
  featured?: boolean
}

export default function PodcastCard({ podcast, showFavorite = true, featured = false }: PodcastCardProps) {
  const tags = parseJsonArray(podcast.tags)

  if (featured) {
    return (
      <Link href={`/podcastler/${podcast.id}`} className="block">
        <article className="card overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Thumbnail */}
            <div className="relative w-full md:w-80 h-48 md:h-auto bg-slate-200 dark:bg-slate-700 flex-shrink-0">
              {podcast.thumbnailUrl ? (
                <Image
                  src={podcast.thumbnailUrl}
                  alt={podcast.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="badge bg-amber-500 text-white flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Öne Çıkan
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="badge badge-primary mb-2">{podcast.topic}</span>
                  <h3 className="font-serif text-xl font-semibold text-slate-900 dark:text-white break-words leading-[1.3]">
                    {podcast.title}
                  </h3>
                </div>
                {showFavorite && (
                  <FavoriteButton
                    item={{
                      id: podcast.id,
                      type: 'podcast',
                      title: podcast.title,
                    }}
                  />
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {formatDuration(podcast.durationMinutes)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(podcast.publishedAt)}
                </span>
              </div>

              <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 break-words">
                {podcast.description}
              </p>

              {tags.length > 0 && <TagList tags={tags} limit={5} />}
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/podcastler/${podcast.id}`} className="block h-full">
      <article className="card card-hover overflow-hidden flex flex-col h-full">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-slate-200 dark:bg-slate-700">
          {podcast.thumbnailUrl ? (
            <Image
              src={podcast.thumbnailUrl}
              alt={podcast.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-teal-600 flex items-center justify-center">
                <Play className="w-7 h-7 text-white ml-1" />
              </div>
            </div>
          )}
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2">
            <span className="badge bg-black/70 text-white">
              {formatDuration(podcast.durationMinutes)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="badge badge-primary text-xs">{podcast.topic}</span>
            {showFavorite && (
              <FavoriteButton
                item={{
                  id: podcast.id,
                  type: 'podcast',
                  title: podcast.title,
                }}
                size="sm"
              />
            )}
          </div>

          <h3 className="font-serif font-semibold text-slate-900 dark:text-white line-clamp-2 mb-2 break-words leading-[1.3]">
            {podcast.title}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 flex-grow break-words">
            {podcast.description}
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(podcast.publishedAt)}
          </div>
        </div>
      </article>
    </Link>
  )
}



