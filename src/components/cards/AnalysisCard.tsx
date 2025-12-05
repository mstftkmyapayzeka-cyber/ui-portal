'use client'

import Link from 'next/link'
import { Clock, User, Calendar, ArrowRight } from 'lucide-react'
import { Analysis } from '@/types'
import { parseJsonArray, formatDate, formatDuration } from '@/lib/utils'
import { TagList } from '@/components/ui/Tag'
import FavoriteButton from '@/components/ui/FavoriteButton'

interface AnalysisCardProps {
  analysis: Analysis
  showFavorite?: boolean
  compact?: boolean
}

export default function AnalysisCard({ analysis, showFavorite = true, compact = false }: AnalysisCardProps) {
  const tags = parseJsonArray(analysis.tags)
  const categories = parseJsonArray(analysis.categories)

  if (compact) {
    return (
      <Link href={`/analizler/${analysis.id}`} className="block">
        <article className="card card-hover p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-serif font-semibold text-slate-900 dark:text-white line-clamp-2 mb-1">
                {analysis.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>{analysis.author}</span>
                <span>·</span>
                <span>{formatDuration(analysis.readingTimeMinutes)}</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 mt-1" />
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/analizler/${analysis.id}`} className="block h-full">
      <article className="card card-hover p-5 flex flex-col h-full">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-3">
            <span className="badge badge-primary">{categories[0]}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-serif text-lg font-semibold text-slate-900 dark:text-white line-clamp-2 leading-[1.3] hover:text-teal-600 dark:hover:text-teal-400 transition-colors break-words">
            {analysis.title}
          </h3>
          {showFavorite && (
            <FavoriteButton
              item={{
                id: analysis.id,
                type: 'analysis',
                title: analysis.title,
              }}
              size="sm"
            />
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400 mb-3">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {analysis.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {formatDuration(analysis.readingTimeMinutes)}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(analysis.publishedAt)}
          </span>
        </div>

        {/* Summary */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-grow break-words">
          {analysis.shortSummary}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-4">
            <TagList tags={tags} limit={4} />
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 dark:text-teal-400">
            Devamını Oku
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </article>
    </Link>
  )
}



