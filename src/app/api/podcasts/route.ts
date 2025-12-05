import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET - Tüm podcastleri listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const topic = searchParams.get('topic')
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

    if (featured === 'true') where.featured = true
    if (topic) where.topic = topic

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(pageSize)
    const take = limit ? parseInt(limit) : parseInt(pageSize)

    const [podcasts, total] = await Promise.all([
      prisma.podcast.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: limit ? 0 : skip,
        take,
      }),
      prisma.podcast.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        items: podcasts,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(total / parseInt(pageSize)),
      },
    })
  } catch (error) {
    console.error('Podcasts GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Podcastler yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// POST - Yeni podcast ekle
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
    const {
      title,
      description,
      durationMinutes,
      topic,
      tags,
      videoUrl,
      thumbnailUrl,
      publishedAt,
      featured,
      published,
    } = body

    const podcast = await prisma.podcast.create({
      data: {
        title,
        description,
        durationMinutes: durationMinutes ? parseInt(durationMinutes) : 0,
        topic,
        tags: tags || '[]',
        videoUrl,
        thumbnailUrl: thumbnailUrl || null,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        featured: featured || false,
        published: published || false,
      },
    })

    return NextResponse.json({ success: true, data: podcast }, { status: 201 })
  } catch (error) {
    console.error('Podcast POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Podcast eklenirken hata oluştu' },
      { status: 500 }
    )
  }
}







