'use client'

import AdminTable, { PublishBadge, DateCell } from './AdminTable'

interface Podcast {
  id: string
  title: string
  topic: string
  durationMinutes: number
  featured: boolean
  published: boolean
  updatedAt: Date
}

interface PodcastListProps {
  podcasts: Podcast[]
}

export default function PodcastList({ podcasts }: PodcastListProps) {
  const columns = [
    { key: 'title', label: 'Başlık', render: (v: unknown) => <span className="font-medium">{v as string}</span> },
    { key: 'topic', label: 'Konu' },
    { key: 'durationMinutes', label: 'Süre', render: (v: unknown) => `${v} dk` },
    { key: 'featured', label: 'Öne Çıkan', render: (v: unknown) => v ? '⭐' : '-' },
    { key: 'published', label: 'Durum', render: (v: unknown) => <PublishBadge published={v as boolean} /> },
    { key: 'updatedAt', label: 'Güncelleme', render: (v: unknown) => <DateCell date={v as Date} /> },
  ]

  return <AdminTable columns={columns} data={podcasts as unknown as Record<string, unknown>[]} editPath="/admin/podcastler" />
}


