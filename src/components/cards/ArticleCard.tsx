'use client'

import Link from 'next/link'
import { ExternalLink, Calendar, User } from 'lucide-react'
import { Article } from '@/types'
import { parseJsonArray, truncateText } from '@/lib/utils'
import { TagList } from '@/components/ui/Tag'
import FavoriteButton from '@/components/ui/FavoriteButton'

interface ArticleCardProps {
  article: Article
  showFavorite?: boolean
}

export default function ArticleCard({ article, showFavorite = true }: ArticleCardProps) {
  const tags = parseJsonArray(article.tags)

  return (
    <article className="card card-hover p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg font-semibold text-slate-900 dark:text-white line-clamp-2 leading-[1.3] break-words">
            {article.externalUrl ? (
              <a
                href={article.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors break-words"
              >
                {article.title}
              </a>
            ) : (
              <span className="break-words">{article.title}</span>
            )}
          </h3>
        </div>
        {showFavorite && (
          <FavoriteButton
            item={{
              id: article.id,
              type: 'article',
              title: article.title,
            }}
            size="sm"
          />
        )}
      </div>

      {/* Authors & Meta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400 mb-3">
        <span className="flex items-center gap-1.5">
          <User className="w-4 h-4" />
          {truncateText(article.authors, 40)}
        </span>
        {article.year && (
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {article.year}
          </span>
        )}
      </div>

      {/* Journal/Book */}
      {article.journalOrBook && (
        <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-3">
          {article.journalOrBook}
        </p>
      )}

      {/* Summary */}
      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-grow break-words">
        {article.summary}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-4">
          <TagList tags={tags} limit={4} />
        </div>
      )}

      {/* Actions */}
      {article.externalUrl && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
          <a
            href={article.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
          >
            Makaleye Git
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </article>
  )
}



