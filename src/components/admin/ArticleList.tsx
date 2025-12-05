'use client'

import React from 'react'
import AdminTable, { PublishBadge, DateCell, TruncatedText } from './AdminTable'

interface Article {
  id: string
  title: string
  authors: string
  journalOrBook: string | null
  year: number | null
  summary: string
  tags: string
  externalUrl: string | null
  published: boolean
  createdAt: Date
  updatedAt: Date
}

interface ArticleListProps {
  articles: Article[]
}

export default function ArticleList({ articles }: ArticleListProps) {
  const columns = [
    {
      key: 'title',
      label: 'Başlık',
      render: (value: unknown) => (
        <span className="font-medium">{value as string}</span>
      ),
    },
    {
      key: 'authors',
      label: 'Yazarlar',
      render: (value: unknown) => <TruncatedText text={value as string} maxLength={30} />,
    },
    {
      key: 'year',
      label: 'Yıl',
      render: (value: unknown) => (value ? String(value) : '-') as React.ReactNode,
    },
    {
      key: 'published',
      label: 'Durum',
      render: (value: unknown) => <PublishBadge published={value as boolean} />,
    },
    {
      key: 'updatedAt',
      label: 'Güncelleme',
      render: (value: unknown) => <DateCell date={value as Date} />,
    },
  ]

  return (
    <AdminTable
      columns={columns}
      data={articles as unknown as Record<string, unknown>[]}
      editPath="/admin/makaleler"
    />
  )
}


