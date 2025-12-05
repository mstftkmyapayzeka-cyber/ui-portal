import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET - Tüm öğrenme modüllerini listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
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
        { title: { contains: search } },
        { shortDescription: { contains: search } },
      ]
    }

    const modules = await prisma.learningModule.findMany({
      where,
      orderBy: { orderIndex: 'asc' },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json({
      success: true,
      data: { items: modules, total: modules.length },
    })
  } catch (error) {
    console.error('Modules GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Modüller yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// POST - Yeni modül ekle
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
      slug,
      shortDescription,
      learningObjectives,
      keyConcepts,
      content,
      recommendedReadings,
      quizQuestions,
      orderIndex,
      published,
    } = body

    const module = await prisma.learningModule.create({
      data: {
        title,
        slug,
        shortDescription,
        learningObjectives: learningObjectives || '[]',
        keyConcepts: keyConcepts || '[]',
        content,
        recommendedReadings: recommendedReadings || '[]',
        quizQuestions: quizQuestions || '[]',
        orderIndex: orderIndex ? parseInt(orderIndex) : 0,
        published: published || false,
      },
    })

    return NextResponse.json({ success: true, data: module }, { status: 201 })
  } catch (error) {
    console.error('Module POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Modül eklenirken hata oluştu' },
      { status: 500 }
    )
  }
}







