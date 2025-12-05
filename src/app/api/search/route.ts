import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Global arama
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '5')

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: {
          articles: [],
          analyses: [],
          podcasts: [],
          news: [],
          modules: [],
        },
      })
    }

    // Paralel arama
    const [articles, analyses, podcasts, news, modules] = await Promise.all([
      prisma.article.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { authors: { contains: query } },
            { summary: { contains: query } },
          ],
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.analysis.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { shortSummary: { contains: query } },
            { author: { contains: query } },
          ],
        },
        take: limit,
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.podcast.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
        },
        take: limit,
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.newsItem.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
        },
        take: limit,
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.learningModule.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { shortDescription: { contains: query } },
          ],
        },
        take: limit,
        orderBy: { orderIndex: 'asc' },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        articles,
        analyses,
        podcasts,
        news,
        modules,
      },
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { success: false, error: 'Arama yapılırken hata oluştu' },
      { status: 500 }
    )
  }
}







