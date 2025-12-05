'use client'

import AdminTable, { PublishBadge, DateCell } from './AdminTable'

interface Module {
  id: string
  orderIndex: number
  title: string
  slug: string
  published: boolean
  updatedAt: Date
}

interface ModuleListProps {
  modules: Module[]
}

export default function ModuleList({ modules }: ModuleListProps) {
  const columns = [
    { key: 'orderIndex', label: '#' },
    { key: 'title', label: 'Başlık', render: (v: unknown) => <span className="font-medium">{v as string}</span> },
    { key: 'slug', label: 'Slug' },
    { key: 'published', label: 'Durum', render: (v: unknown) => <PublishBadge published={v as boolean} /> },
    { key: 'updatedAt', label: 'Güncelleme', render: (v: unknown) => <DateCell date={v as Date} /> },
  ]

  return <AdminTable columns={columns} data={modules as unknown as Record<string, unknown>[]} editPath="/admin/moduller" />
}


