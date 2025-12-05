import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET - Tek kavram getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const concept = await prisma.concept.findUnique({
      where: { id: params.id },
    })

    if (!concept) {
      return NextResponse.json(
        { success: false, error: 'Kavram bulunamadı' },
        { status: 404 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session && !concept.published) {
      return NextResponse.json(
        { success: false, error: 'Kavram bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: concept })
  } catch (error) {
    console.error('Concept GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Kavram yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// PUT - Kavram güncelle
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
    const { name, shortDefinition, detailedExplanation, relatedTheory, published } = body

    const concept = await prisma.concept.update({
      where: { id: params.id },
      data: {
        name,
        shortDefinition,
        detailedExplanation: detailedExplanation || null,
        relatedTheory: relatedTheory || null,
        published: published ?? false,
      },
    })

    return NextResponse.json({ success: true, data: concept })
  } catch (error) {
    console.error('Concept PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Kavram güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE - Kavram sil
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

    await prisma.concept.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: 'Kavram silindi' })
  } catch (error) {
    console.error('Concept DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Kavram silinirken hata oluştu' },
      { status: 500 }
    )
  }
}







