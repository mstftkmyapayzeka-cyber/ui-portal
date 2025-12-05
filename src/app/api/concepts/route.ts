import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET - Tüm kavramları listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const random = searchParams.get('random')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')

    const where: Record<string, unknown> = {}

    const session = await getServerSession(authOptions)
    if (!session) {
      where.published = true
    } else if (published !== null) {
      where.published = published === 'true'
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { shortDefinition: { contains: search } },
      ]
    }

    // Rastgele bir kavram için
    if (random === 'true') {
      const count = await prisma.concept.count({ where })
      if (count === 0) {
        return NextResponse.json({
          success: true,
          data: { item: null },
        })
      }
      const skip = Math.floor(Math.random() * count)
      const concept = await prisma.concept.findFirst({
        where,
        skip,
      })
      return NextResponse.json({
        success: true,
        data: { item: concept },
      })
    }

    const concepts = await prisma.concept.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json({
      success: true,
      data: { items: concepts, total: concepts.length },
    })
  } catch (error) {
    console.error('Concepts GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Kavramlar yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// POST - Yeni kavram ekle
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
    const { name, shortDefinition, detailedExplanation, relatedTheory, published } = body

    const concept = await prisma.concept.create({
      data: {
        name,
        shortDefinition,
        detailedExplanation: detailedExplanation || null,
        relatedTheory: relatedTheory || null,
        published: published || false,
      },
    })

    return NextResponse.json({ success: true, data: concept }, { status: 201 })
  } catch (error) {
    console.error('Concept POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Kavram eklenirken hata oluştu' },
      { status: 500 }
    )
  }
}







