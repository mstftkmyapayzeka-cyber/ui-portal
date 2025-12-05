'use client'

import Link from 'next/link'
import { MapPin, Tag as TagIcon, Calendar, ArrowRight } from 'lucide-react'
import { NewsItem } from '@/types'
import { parseJsonArray, formatDate, timeAgo } from '@/lib/utils'
import { TagList } from '@/components/ui/Tag'

interface NewsCardProps {
  news: NewsItem
  compact?: boolean
}

export default function NewsCard({ news, compact = false }: NewsCardProps) {
  const tags = parseJsonArray(news.tags)

  if (compact) {
    return (
      <article className="flex items-start gap-4 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-secondary text-xs">{news.region}</span>
            <span className="text-xs text-slate-400">{timeAgo(news.publishedAt)}</span>
          </div>
          <h4 className="font-medium text-slate-900 dark:text-white line-clamp-2 text-sm break-words leading-[1.3]">
            {news.title}
          </h4>
        </div>
      </article>
    )
  }

  return (
    <article className="card card-hover p-5 flex flex-col h-full">
      {/* Header badges */}
      <div className="flex items-center gap-2 mb-3">
        <span className="badge badge-primary flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {news.region}
        </span>
        <span className="badge badge-secondary flex items-center gap-1">
          <TagIcon className="w-3 h-3" />
          {news.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-lg font-semibold text-slate-900 dark:text-white line-clamp-2 leading-[1.3] mb-3 break-words">
        {news.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-grow break-words">
        {news.description}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-4">
          <TagList tags={tags} limit={3} />
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Calendar className="w-4 h-4" />
          {formatDate(news.publishedAt)}
        </span>
        
        {news.relatedAnalysis && (
          <Link
            href={`/analizler/${news.relatedAnalysisId}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
          >
            İlgili Analiz
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </article>
  )
}



