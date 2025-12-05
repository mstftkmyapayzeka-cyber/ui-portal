import Link from 'next/link'
import prisma from '@/lib/prisma'
import ResourceCard from '@/components/cards/ResourceCard'
import { Library, Filter } from 'lucide-react'
import { RESOURCE_TYPES } from '@/lib/utils'

export const metadata = {
  title: 'Kaynaklar ve Araçlar',
  description: 'Uluslararası ilişkiler için faydalı kitaplar, makaleler, araçlar ve düşünürler',
}

interface PageProps {
  searchParams: { type?: string }
}

async function getResources(type?: string) {
  const where: Record<string, unknown> = { published: true }

  if (type) {
    where.type = type
  }

  const resources = await prisma.resource.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })

  // Türlere göre sayılar
  const typeCounts = await prisma.resource.groupBy({
    by: ['type'],
    where: { published: true },
    _count: true,
  })

  const typeCountMap: Record<string, number> = {}
  typeCounts.forEach((t) => {
    typeCountMap[t.type] = t._count
  })

  return { resources, typeCountMap }
}

export default async function ResourcesPage({ searchParams }: PageProps) {
  const { resources, typeCountMap } = await getResources(searchParams.type)

  return (
    <div className="container-custom py-8 md:py-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-3">
          <Library className="w-8 h-8 text-teal-600" />
          Kaynaklar & Araçlar
        </h1>
        <p className="section-subtitle">
          Uluslararası ilişkiler için faydalı kaynaklar
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Filters */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="card p-4 sticky top-24">
            <h3 className="font-medium text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4" />
              Tür
            </h3>
            <nav className="space-y-1">
              <Link
                href="/kaynaklar"
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  !searchParams.type
                    ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Tümü</span>
                <span className="text-xs text-slate-400">{resources.length}</span>
              </Link>
              {RESOURCE_TYPES.map((type) => (
                <Link
                  key={type}
                  href={`/kaynaklar?type=${encodeURIComponent(type)}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    searchParams.type === type
                      ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{type}</span>
                  {typeCountMap[type] > 0 && (
                    <span className="text-xs text-slate-400">{typeCountMap[type]}</span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {searchParams.type && (
            <div className="mb-6">
              <span className="badge badge-primary">{searchParams.type}</span>
              <Link
                href="/kaynaklar"
                className="ml-3 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Filtreyi Temizle
              </Link>
            </div>
          )}

          {resources.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Library className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-2">
                Kaynak Bulunamadı
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {searchParams.type
                  ? 'Bu türde henüz kaynak yok.'
                  : 'Henüz kaynak eklenmemiş.'}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}







