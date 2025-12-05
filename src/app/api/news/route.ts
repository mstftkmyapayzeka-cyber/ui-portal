import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET - Tüm haberleri listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const region = searchParams.get('region')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page') || '1'
    const pageSize = searchParams.get('pageSize') || '10'

    const where: Record<string, unknown> = {}

    const session = await getServerSession(authOptions)
    if (!session) {
      where.published = true
    } else if (published !== null) {
      where.published = published === 'true'
    }

    if (region) where.region = region
    if (category) where.category = category

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(pageSize)
    const take = limit ? parseInt(limit) : parseInt(pageSize)

    const [news, total] = await Promise.all([
      prisma.newsItem.findMany({
        where,
        include: { relatedAnalysis: true },
        orderBy: { publishedAt: 'desc' },
        skip: limit ? 0 : skip,
        take,
      }),
      prisma.newsItem.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        items: news,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(total / parseInt(pageSize)),
      },
    })
  } catch (error) {
    console.error('News GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Haberler yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// POST - Yeni haber ekle
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, region, category, tags, publishedAt, relatedAnalysisId, published } = body

    const news = await prisma.newsItem.create({
      data: {
        title,
        description,
        region,
        category,
        tags: tags || '[]',
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        relatedAnalysisId: relatedAnalysisId || null,
        published: published || false,
      },
    })

    return NextResponse.json({ success: true, data: news }, { status: 201 })
  } catch (error) {
    console.error('News POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Haber eklenirken hata oluştu' },
      { status: 500 }
    )
  }
}







