import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET - Tek podcast getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const podcast = await prisma.podcast.findUnique({
      where: { id: params.id },
    })

    if (!podcast) {
      return NextResponse.json(
        { success: false, error: 'Podcast bulunamadı' },
        { status: 404 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session && !podcast.published) {
      return NextResponse.json(
        { success: false, error: 'Podcast bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: podcast })
  } catch (error) {
    console.error('Podcast GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Podcast yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// PUT - Podcast güncelle
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

    const podcast = await prisma.podcast.update({
      where: { id: params.id },
      data: {
        title,
        description,
        durationMinutes: durationMinutes ? parseInt(durationMinutes) : undefined,
        topic,
        tags: tags || '[]',
        videoUrl,
        thumbnailUrl: thumbnailUrl || null,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        featured: featured ?? false,
        published: published ?? false,
      },
    })

    return NextResponse.json({ success: true, data: podcast })
  } catch (error) {
    console.error('Podcast PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Podcast güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE - Podcast sil
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

    await prisma.podcast.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: 'Podcast silindi' })
  } catch (error) {
    console.error('Podcast DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Podcast silinirken hata oluştu' },
      { status: 500 }
    )
  }
}







