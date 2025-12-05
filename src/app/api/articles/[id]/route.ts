import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET - Tek makale getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: params.id },
    })

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Makale bulunamadı' },
        { status: 404 }
      )
    }

    // Admin değilse ve yayınlanmamışsa gösterme
    const session = await getServerSession(authOptions)
    if (!session && !article.published) {
      return NextResponse.json(
        { success: false, error: 'Makale bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: article })
  } catch (error) {
    console.error('Article GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Makale yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// PUT - Makale güncelle (sadece admin)
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
    const { title, authors, journalOrBook, year, summary, tags, externalUrl, published } = body

    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        title,
        authors,
        journalOrBook: journalOrBook || null,
        year: year ? parseInt(year) : null,
        summary,
        tags: tags || '[]',
        externalUrl: externalUrl || null,
        published: published ?? false,
      },
    })

    return NextResponse.json({ success: true, data: article })
  } catch (error) {
    console.error('Article PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Makale güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE - Makale sil (sadece admin)
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

    await prisma.article.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: 'Makale silindi' })
  } catch (error) {
    console.error('Article DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Makale silinirken hata oluştu' },
      { status: 500 }
    )
  }
}







