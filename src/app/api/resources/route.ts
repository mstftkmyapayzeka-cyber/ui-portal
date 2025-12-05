import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET - Tüm kaynakları listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const type = searchParams.get('type')
    const relatedTheory = searchParams.get('relatedTheory')
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

    if (type) where.type = type
    if (relatedTheory) where.relatedTheory = { contains: relatedTheory }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(pageSize)
    const take = limit ? parseInt(limit) : parseInt(pageSize)

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: limit ? 0 : skip,
        take,
      }),
      prisma.resource.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        items: resources,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(total / parseInt(pageSize)),
      },
    })
  } catch (error) {
    console.error('Resources GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Kaynaklar yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// POST - Yeni kaynak ekle
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
    const { name, type, description, relatedTheory, externalUrl, published } = body

    const resource = await prisma.resource.create({
      data: {
        name,
        type,
        description,
        relatedTheory: relatedTheory || null,
        externalUrl: externalUrl || null,
        published: published || false,
      },
    })

    return NextResponse.json({ success: true, data: resource }, { status: 201 })
  } catch (error) {
    console.error('Resource POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Kaynak eklenirken hata oluştu' },
      { status: 500 }
    )
  }
}







