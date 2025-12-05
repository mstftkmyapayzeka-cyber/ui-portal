'use client'

import AdminTable, { PublishBadge, DateCell } from './AdminTable'

interface News {
  id: string
  title: string
  region: string
  category: string
  published: boolean
  updatedAt: Date
}

interface NewsListProps {
  news: News[]
}

export default function NewsList({ news }: NewsListProps) {
  const columns = [
    { key: 'title', label: 'Başlık', render: (v: unknown) => <span className="font-medium truncate max-w-xs block">{v as string}</span> },
    { key: 'region', label: 'Bölge' },
    { key: 'category', label: 'Kategori' },
    { key: 'published', label: 'Durum', render: (v: unknown) => <PublishBadge published={v as boolean} /> },
    { key: 'updatedAt', label: 'Güncelleme', render: (v: unknown) => <DateCell date={v as Date} /> },
  ]

  return <AdminTable columns={columns} data={news as unknown as Record<string, unknown>[]} editPath="/admin/haberler" />
}


