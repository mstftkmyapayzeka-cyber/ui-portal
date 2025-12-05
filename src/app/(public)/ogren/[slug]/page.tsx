import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Target, Key, BookOpen, ExternalLink, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import prisma from '@/lib/prisma'
import { parseJsonArray } from '@/lib/utils'
import type { QuizQuestion, RecommendedReading } from '@/types'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps) {
  const module = await prisma.learningModule.findUnique({
    where: { slug: params.slug, published: true },
  })

  if (!module) {
    return { title: 'Modül Bulunamadı' }
  }

  return {
    title: `${module.title} | Uİ Öğren`,
    description: module.shortDescription,
  }
}

async function getModule(slug: string) {
  const module = await prisma.learningModule.findUnique({
    where: { slug, published: true },
  })

  if (!module) return null

  // Önceki ve sonraki modül
  const [prevModule, nextModule] = await Promise.all([
    prisma.learningModule.findFirst({
      where: {
        published: true,
        orderIndex: { lt: module.orderIndex },
      },
      orderBy: { orderIndex: 'desc' },
      select: { slug: true, title: true },
    }),
    prisma.learningModule.findFirst({
      where: {
        published: true,
        orderIndex: { gt: module.orderIndex },
      },
      orderBy: { orderIndex: 'asc' },
      select: { slug: true, title: true },
    }),
  ])

  return { module, prevModule, nextModule }
}

export default async function ModuleDetailPage({ params }: PageProps) {
  const data = await getModule(params.slug)

  if (!data) {
    notFound()
  }

  const { module, prevModule, nextModule } = data
  
  const objectives = parseJsonArray(module.learningObjectives)
  const concepts = parseJsonArray(module.keyConcepts)
  
  let readings: RecommendedReading[] = []
  let quizQuestions: QuizQuestion[] = []
  
  try {
    readings = JSON.parse(module.recommendedReadings)
  } catch {
    readings = []
  }
  
  try {
    quizQuestions = JSON.parse(module.quizQuestions)
  } catch {
    quizQuestions = []
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-12">
        <div className="container-custom">
          <Link
            href="/ogren"
            className="inline-flex items-center gap-2 text-teal-200 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tüm Modüller
          </Link>

          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            {module.title}
          </h1>

          <p className="text-xl text-teal-100 max-w-3xl">
            {module.shortDescription}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Learning Objectives */}
            {objectives.length > 0 && (
              <section className="mb-10">
                <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                  <Target className="w-5 h-5 text-teal-600" />
                  Öğrenme Hedefleri
                </h2>
                <ul className="space-y-3">
                  {objectives.map((objective, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-slate-700 dark:text-slate-300"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-sm font-medium text-teal-600">
                        {index + 1}
                      </span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Key Concepts */}
            {concepts.length > 0 && (
              <section className="mb-10">
                <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                  <Key className="w-5 h-5 text-teal-600" />
                  Temel Kavramlar
                </h2>
                <div className="flex flex-wrap gap-2">
                  {concepts.map((concept) => (
                    <span
                      key={concept}
                      className="badge badge-primary"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Main Content */}
            <section className="mb-10">
              <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                <BookOpen className="w-5 h-5 text-teal-600" />
                İçerik
              </h2>
              <div className="reading-shell mt-4">
                <div className="reading-surface">
                  <div className="reading-body">
                    {module.content.split('\n\n').map((paragraph, index) => {
                      // Başlık kontrolü (## ile başlayan)
                      if (paragraph.startsWith('## ')) {
                        return (
                          <h3 key={index} className="text-xl font-serif font-bold mt-8 mb-4">
                            {paragraph.replace('## ', '')}
                          </h3>
                        )
                      }
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h4 key={index} className="text-lg font-serif font-bold mt-6 mb-3">
                            {paragraph.replace('### ', '')}
                          </h4>
                        )
                      }
                      return <p key={index} className={index === 0 ? 'reading-dropcap' : undefined}>{paragraph}</p>
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Quiz */}
            {quizQuestions.length > 0 && (
              <section className="mb-10">
                <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                  <HelpCircle className="w-5 h-5 text-teal-600" />
                  Mini Quiz
                </h2>
                <div className="space-y-6">
                  {quizQuestions.map((q, qIndex) => (
                    <div key={qIndex} className="card p-5">
                      <p className="font-medium text-slate-900 dark:text-white mb-4">
                        {qIndex + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((option, oIndex) => (
                          <div
                            key={oIndex}
                            className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm"
                          >
                            <span className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-medium">
                              {String.fromCharCode(65 + oIndex)}
                            </span>
                            {option}
                          </div>
                        ))}
                      </div>
                      <details className="mt-4">
                        <summary className="text-sm text-teal-600 dark:text-teal-400 cursor-pointer hover:underline">
                          Cevabı Göster
                        </summary>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          Doğru cevap: {String.fromCharCode(65 + q.correctIndex)} - {q.options[q.correctIndex]}
                        </p>
                      </details>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-700">
              {prevModule ? (
                <Link
                  href={`/ogren/${prevModule.slug}`}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm">
                    <span className="block text-xs text-slate-400">Önceki</span>
                    {prevModule.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              
              {nextModule ? (
                <Link
                  href={`/ogren/${nextModule.slug}`}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-right"
                >
                  <span className="text-sm">
                    <span className="block text-xs text-slate-400">Sonraki</span>
                    {nextModule.title}
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-24 space-y-6">
              {/* Recommended Readings */}
              {readings.length > 0 && (
                <div className="card p-5">
                  <h3 className="font-medium text-slate-900 dark:text-white mb-4">
                    Önerilen Okumalar
                  </h3>
                  <ul className="space-y-3">
                    {readings.map((reading, index) => (
                      <li key={index}>
                        {reading.url ? (
                          <a
                            href={reading.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block hover:bg-slate-50 dark:hover:bg-slate-800 -mx-2 px-2 py-1 rounded transition-colors"
                          >
                            <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-1">
                              {reading.title}
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </p>
                            <p className="text-xs text-slate-500">{reading.author}</p>
                          </a>
                        ) : (
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {reading.title}
                            </p>
                            <p className="text-xs text-slate-500">{reading.author}</p>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Back to modules */}
              <Link
                href="/ogren"
                className="btn-secondary w-full justify-center"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Tüm Modüller
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}







