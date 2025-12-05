import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET - Tek kaynak getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
    })

    if (!resource) {
      return NextResponse.json(
        { success: false, error: 'Kaynak bulunamadı' },
        { status: 404 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session && !resource.published) {
      return NextResponse.json(
        { success: false, error: 'Kaynak bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: resource })
  } catch (error) {
    console.error('Resource GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Kaynak yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// PUT - Kaynak güncelle
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
    const { name, type, description, relatedTheory, externalUrl, published } = body

    const resource = await prisma.resource.update({
      where: { id: params.id },
      data: {
        name,
        type,
        description,
        relatedTheory: relatedTheory || null,
        externalUrl: externalUrl || null,
        published: published ?? false,
      },
    })

    return NextResponse.json({ success: true, data: resource })
  } catch (error) {
    console.error('Resource PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Kaynak güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE - Kaynak sil
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

    await prisma.resource.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: 'Kaynak silindi' })
  } catch (error) {
    console.error('Resource DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Kaynak silinirken hata oluştu' },
      { status: 500 }
    )
  }
}







