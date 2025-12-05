'use client'

import AdminTable, { PublishBadge, DateCell } from './AdminTable'

interface Analysis {
  id: string
  title: string
  author: string
  readingTimeMinutes: number
  published: boolean
  updatedAt: Date
}

interface AnalysisListProps {
  analyses: Analysis[]
}

export default function AnalysisList({ analyses }: AnalysisListProps) {
  const columns = [
    { key: 'title', label: 'Başlık', render: (v: unknown) => <span className="font-medium">{v as string}</span> },
    { key: 'author', label: 'Yazar' },
    { key: 'readingTimeMinutes', label: 'Süre', render: (v: unknown) => `${v} dk` },
    { key: 'published', label: 'Durum', render: (v: unknown) => <PublishBadge published={v as boolean} /> },
    { key: 'updatedAt', label: 'Güncelleme', render: (v: unknown) => <DateCell date={v as Date} /> },
  ]

  return <AdminTable columns={columns} data={analyses as unknown as Record<string, unknown>[]} editPath="/admin/analizler" />
}


