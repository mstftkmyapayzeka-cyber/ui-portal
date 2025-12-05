import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET - Dashboard istatistikleri
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Paralel sayım sorguları
    const [
      totalArticles,
      totalNews,
      totalAnalyses,
      totalModules,
      totalPodcasts,
      totalResources,
      totalConcepts,
      todayCreated,
      todayUpdated,
      recentArticles,
      recentAnalyses,
      recentPodcasts,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.newsItem.count(),
      prisma.analysis.count(),
      prisma.learningModule.count(),
      prisma.podcast.count(),
      prisma.resource.count(),
      prisma.concept.count(),
      // Bugün oluşturulanlar
      Promise.all([
        prisma.article.count({ where: { createdAt: { gte: today } } }),
        prisma.newsItem.count({ where: { createdAt: { gte: today } } }),
        prisma.analysis.count({ where: { createdAt: { gte: today } } }),
        prisma.podcast.count({ where: { createdAt: { gte: today } } }),
      ]).then((counts) => counts.reduce((a, b) => a + b, 0)),
      // Bugün güncellenenler
      Promise.all([
        prisma.article.count({ where: { updatedAt: { gte: today }, createdAt: { lt: today } } }),
        prisma.newsItem.count({ where: { updatedAt: { gte: today }, createdAt: { lt: today } } }),
        prisma.analysis.count({ where: { updatedAt: { gte: today }, createdAt: { lt: today } } }),
        prisma.podcast.count({ where: { updatedAt: { gte: today }, createdAt: { lt: today } } }),
      ]).then((counts) => counts.reduce((a, b) => a + b, 0)),
      // Son eklenen içerikler
      prisma.article.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
      prisma.analysis.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
      prisma.podcast.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          articles: totalArticles,
          news: totalNews,
          analyses: totalAnalyses,
          modules: totalModules,
          podcasts: totalPodcasts,
          resources: totalResources,
          concepts: totalConcepts,
        },
        today: {
          created: todayCreated,
          updated: todayUpdated,
        },
        recent: {
          articles: recentArticles,
          analyses: recentAnalyses,
          podcasts: recentPodcasts,
        },
      },
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { success: false, error: 'İstatistikler yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}







