'use client'

import { ExternalLink, Book, FileText, User, Wrench, Database, BookOpen } from 'lucide-react'
import { Resource } from '@/types'

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Kitap': Book,
  'Akademik Makale': FileText,
  'Düşünür': User,
  'Çevrimiçi Araç': Wrench,
  'Veri Kaynağı': Database,
  'Dergi': BookOpen,
  'Think Tank': BookOpen,
}

interface ResourceCardProps {
  resource: Resource
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const Icon = typeIcons[resource.type] || Book

  return (
    <article className="card card-hover p-5">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-serif font-semibold text-slate-900 dark:text-white break-words leading-[1.3]">
              {resource.externalUrl ? (
                <a
                  href={resource.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors break-words"
                >
                  {resource.name}
                </a>
              ) : (
                <span className="break-words">{resource.name}</span>
              )}
            </h3>
            {resource.externalUrl && (
              <a
                href={resource.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-secondary">{resource.type}</span>
            {resource.relatedTheory && (
              <span className="badge badge-primary">{resource.relatedTheory}</span>
            )}
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 break-words">
            {resource.description}
          </p>
        </div>
      </div>
    </article>
  )
}



