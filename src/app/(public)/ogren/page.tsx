import Link from 'next/link'
import { BookOpen, CheckCircle, ArrowRight } from 'lucide-react'
import prisma from '@/lib/prisma'
import { parseJsonArray } from '@/lib/utils'

export const metadata = {
  title: 'Uluslararası İlişkiler Öğren',
  description: 'Uluslararası ilişkiler teorileri, kavramları ve temel konularını öğrenin',
}

async function getModules() {
  const modules = await prisma.learningModule.findMany({
    where: { published: true },
    orderBy: { orderIndex: 'asc' },
  })

  return modules
}

export default async function LearnPage() {
  const modules = await getModules()

  return (
    <div className="container-custom py-8 md:py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8 text-teal-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">
          Uluslararası İlişkiler Öğren
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Temel teorilerden güncel kavramlara, kapsamlı öğrenme modülleriyle 
          uluslararası ilişkiler dünyasını keşfedin.
        </p>
      </div>

      {/* Modules Grid */}
      {modules.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => {
            const objectives = parseJsonArray(module.learningObjectives)
            const concepts = parseJsonArray(module.keyConcepts)

            return (
              <Link
                key={module.id}
                href={`/ogren/${module.slug}`}
                className="card card-hover p-6 flex flex-col"
              >
                {/* Module Number */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center font-bold text-teal-600 dark:text-teal-400">
                    {index + 1}
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Modül {index + 1}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-serif text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {module.title}
                </h2>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-grow">
                  {module.shortDescription}
                </p>

                {/* Key Concepts Preview */}
                {concepts.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Temel Kavramlar:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {concepts.slice(0, 3).map((concept) => (
                        <span
                          key={concept}
                          className="badge badge-secondary text-xs"
                        >
                          {concept}
                        </span>
                      ))}
                      {concepts.length > 3 && (
                        <span className="badge bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs">
                          +{concepts.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Objectives Count */}
                {objectives.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    {objectives.length} öğrenme hedefi
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="card p-12 text-center max-w-lg mx-auto">
          <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-2">
            Henüz Modül Yok
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Öğrenme modülleri yakında eklenecek. Temel Uİ teorileri, kavramları ve 
            daha fazlası burada olacak.
          </p>
        </div>
      )}

      {/* Info Section */}
      {modules.length > 0 && (
        <section className="mt-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">
              Nasıl Öğrenilir?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Her modül, teorik bilgi, temel kavramlar, önerilen okumalar ve 
              mini quiz soruları içerir. Kendi hızınızda ilerleyin.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-teal-600">1</span>
                </div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                  Modülü Seçin
                </h3>
                <p className="text-sm text-slate-500">
                  İlgi alanınıza göre bir modülle başlayın
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-teal-600">2</span>
                </div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                  İçeriği Okuyun
                </h3>
                <p className="text-sm text-slate-500">
                  Kavramları ve teorileri anlayın
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-teal-600">3</span>
                </div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                  Test Edin
                </h3>
                <p className="text-sm text-slate-500">
                  Mini quiz ile bilginizi pekiştirin
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}







