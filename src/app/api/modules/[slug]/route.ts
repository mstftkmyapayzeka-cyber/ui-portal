import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET - Tek modül getir (slug ile)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Önce slug ile dene, bulamazsa id ile dene
    let module = await prisma.learningModule.findUnique({
      where: { slug: params.slug },
    })

    if (!module) {
      module = await prisma.learningModule.findUnique({
        where: { id: params.slug },
      })
    }

    if (!module) {
      return NextResponse.json(
        { success: false, error: 'Modül bulunamadı' },
        { status: 404 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session && !module.published) {
      return NextResponse.json(
        { success: false, error: 'Modül bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: module })
  } catch (error) {
    console.error('Module GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Modül yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// PUT - Modül güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
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

    // Önce slug ile dene, bulamazsa id ile dene
    let existingModule = await prisma.learningModule.findUnique({
      where: { slug: params.slug },
    })

    if (!existingModule) {
      existingModule = await prisma.learningModule.findUnique({
        where: { id: params.slug },
      })
    }

    if (!existingModule) {
      return NextResponse.json(
        { success: false, error: 'Modül bulunamadı' },
        { status: 404 }
      )
    }

    const module = await prisma.learningModule.update({
      where: { id: existingModule.id },
      data: {
        title,
        slug,
        shortDescription,
        learningObjectives: learningObjectives || '[]',
        keyConcepts: keyConcepts || '[]',
        content,
        recommendedReadings: recommendedReadings || '[]',
        quizQuestions: quizQuestions || '[]',
        orderIndex: orderIndex ? parseInt(orderIndex) : undefined,
        published: published ?? false,
      },
    })

    return NextResponse.json({ success: true, data: module })
  } catch (error) {
    console.error('Module PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Modül güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE - Modül sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    // Önce slug ile dene, bulamazsa id ile dene
    let existingModule = await prisma.learningModule.findUnique({
      where: { slug: params.slug },
    })

    if (!existingModule) {
      existingModule = await prisma.learningModule.findUnique({
        where: { id: params.slug },
      })
    }

    if (!existingModule) {
      return NextResponse.json(
        { success: false, error: 'Modül bulunamadı' },
        { status: 404 }
      )
    }

    await prisma.learningModule.delete({
      where: { id: existingModule.id },
    })

    return NextResponse.json({ success: true, message: 'Modül silindi' })
  } catch (error) {
    console.error('Module DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Modül silinirken hata oluştu' },
      { status: 500 }
    )
  }
}







