'use client'

import AdminTable, { PublishBadge, DateCell, TruncatedText } from './AdminTable'

interface Concept {
  id: string
  name: string
  shortDefinition: string
  relatedTheory: string | null
  published: boolean
  updatedAt: Date
}

interface ConceptListProps {
  concepts: Concept[]
}

export default function ConceptList({ concepts }: ConceptListProps) {
  const columns = [
    { key: 'name', label: 'Kavram', render: (v: unknown) => <span className="font-medium">{v as string}</span> },
    { key: 'shortDefinition', label: 'Tanım', render: (v: unknown) => <TruncatedText text={v as string} maxLength={60} /> },
    { key: 'relatedTheory', label: 'İlgili Teori', render: (v: unknown) => (v ? String(v) : '-') as React.ReactNode },
    { key: 'published', label: 'Durum', render: (v: unknown) => <PublishBadge published={v as boolean} /> },
    { key: 'updatedAt', label: 'Güncelleme', render: (v: unknown) => <DateCell date={v as Date} /> },
  ]

  return <AdminTable columns={columns} data={concepts as unknown as Record<string, unknown>[]} editPath="/admin/kavramlar" />
}


