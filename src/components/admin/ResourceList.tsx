'use client'

import AdminTable, { PublishBadge, DateCell } from './AdminTable'

interface Resource {
  id: string
  name: string
  type: string
  relatedTheory: string | null
  published: boolean
  updatedAt: Date
}

interface ResourceListProps {
  resources: Resource[]
}

export default function ResourceList({ resources }: ResourceListProps) {
  const columns = [
    { key: 'name', label: 'Ad', render: (v: unknown) => <span className="font-medium">{v as string}</span> },
    { key: 'type', label: 'Tür' },
    { key: 'relatedTheory', label: 'İlgili Teori', render: (v: unknown) => (v ? String(v) : '-') as React.ReactNode },
    { key: 'published', label: 'Durum', render: (v: unknown) => <PublishBadge published={v as boolean} /> },
    { key: 'updatedAt', label: 'Güncelleme', render: (v: unknown) => <DateCell date={v as Date} /> },
  ]

  return <AdminTable columns={columns} data={resources as unknown as Record<string, unknown>[]} editPath="/admin/kaynaklar" />
}


