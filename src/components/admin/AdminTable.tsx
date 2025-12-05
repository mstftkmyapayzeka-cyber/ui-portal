'use client'

import Link from 'next/link'
import { Edit, Trash2, Eye, EyeOff, MoreHorizontal } from 'lucide-react'
import { formatShortDate } from '@/lib/utils'
import { useState } from 'react'

interface Column {
  key: string
  label: string
  render?: (value: unknown, item: Record<string, unknown>) => React.ReactNode
}

interface AdminTableProps {
  columns: Column[]
  data: Record<string, unknown>[]
  editPath: string
  onDelete?: (id: string) => void
  loading?: boolean
}

export default function AdminTable({
  columns,
  data,
  editPath,
  onDelete,
  loading = false,
}: AdminTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Bu öğeyi silmek istediğinize emin misiniz?')) {
      onDelete?.(id)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="animate-pulse p-8">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
        <p className="text-slate-500 dark:text-slate-400">Henüz veri yok.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {data.map((item) => (
              <tr
                key={item.id as string}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                    {col.render
                      ? col.render(item[col.key], item)
                      : (item[col.key] as React.ReactNode)}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`${editPath}/${item.id}`}
                      className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                      title="Düzenle"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => handleDelete(item.id as string)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Yayın durumu badge'i
export function PublishBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
        published
          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
      }`}
    >
      {published ? (
        <>
          <Eye className="w-3 h-3" />
          Yayında
        </>
      ) : (
        <>
          <EyeOff className="w-3 h-3" />
          Taslak
        </>
      )}
    </span>
  )
}

// Tarih gösterimi
export function DateCell({ date }: { date: Date | string }) {
  return (
    <span className="text-slate-500 dark:text-slate-400">
      {formatShortDate(date)}
    </span>
  )
}

// Truncated text
export function TruncatedText({ text, maxLength = 50 }: { text: string; maxLength?: number }) {
  if (text.length <= maxLength) return <span>{text}</span>
  return (
    <span title={text}>
      {text.substring(0, maxLength)}...
    </span>
  )
}







