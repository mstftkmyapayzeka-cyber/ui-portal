'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface TagProps {
  tag: string
  clickable?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export default function Tag({ tag, clickable = true, size = 'sm', className }: TagProps) {
  const baseClasses = cn(
    'inline-flex items-center rounded-full font-medium transition-colors',
    size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
    'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    clickable && 'hover:bg-teal-100 dark:hover:bg-teal-900/50 hover:text-teal-700 dark:hover:text-teal-300 cursor-pointer',
    className
  )

  if (clickable) {
    return (
      <Link href={`/etiket/${encodeURIComponent(tag)}`} className={baseClasses}>
        {tag}
      </Link>
    )
  }

  return <span className={baseClasses}>{tag}</span>
}

interface TagListProps {
  tags: string[]
  clickable?: boolean
  size?: 'sm' | 'md'
  limit?: number
  className?: string
}

export function TagList({ tags, clickable = true, size = 'sm', limit, className }: TagListProps) {
  const displayTags = limit ? tags.slice(0, limit) : tags
  const remainingCount = limit && tags.length > limit ? tags.length - limit : 0

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {displayTags.map((tag) => (
        <Tag key={tag} tag={tag} clickable={clickable} size={size} />
      ))}
      {remainingCount > 0 && (
        <span className={cn(
          'inline-flex items-center rounded-full font-medium',
          size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
          'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
        )}>
          +{remainingCount}
        </span>
      )}
    </div>
  )
}







