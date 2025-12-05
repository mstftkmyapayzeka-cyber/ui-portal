import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET - Tek haber getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const news = await prisma.newsItem.findUnique({
      where: { id: params.id },
      include: { relatedAnalysis: true },
    })

    if (!news) {
      return NextResponse.json(
        { success: false, error: 'Haber bulunamadı' },
        { status: 404 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session && !news.published) {
      return NextResponse.json(
        { success: false, error: 'Haber bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: news })
  } catch (error) {
    console.error('News GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Haber yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// PUT - Haber güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const news = await prisma.newsItem.update({
      where: { id: params.id },
      data: {
        title,
        description,
        region,
        category,
        tags: tags || '[]',
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        relatedAnalysisId: relatedAnalysisId || null,
        published: published ?? false,
      },
    })

    return NextResponse.json({ success: true, data: news })
  } catch (error) {
    console.error('News PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Haber güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE - Haber sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    await prisma.newsItem.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: 'Haber silindi' })
  } catch (error) {
    console.error('News DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Haber silinirken hata oluştu' },
      { status: 500 }
    )
  }
}







