import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { authOptions } from '@/lib/auth'

// Maksimum dosya boyutu (MB)
const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '100')
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024

// İzin verilen dosya tipleri
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    // Auth kontrolü
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string | null // 'video' veya 'image'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Dosya bulunamadı' },
        { status: 400 }
      )
    }

    // Dosya boyutu kontrolü
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `Dosya boyutu ${MAX_FILE_SIZE_MB}MB'dan büyük olamaz` },
        { status: 400 }
      )
    }

    // Dosya tipi kontrolü
    const allowedTypes = type === 'video' ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Geçersiz dosya tipi. İzin verilen tipler: ${allowedTypes.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // Upload klasörünü oluştur
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type || 'files')
    await mkdir(uploadDir, { recursive: true })

    // Benzersiz dosya adı oluştur
    const ext = path.extname(file.name)
    const filename = `${uuidv4()}${ext}`
    const filepath = path.join(uploadDir, filename)

    // Dosyayı kaydet
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // URL'yi döndür
    const url = `/uploads/${type || 'files'}/${filename}`

    return NextResponse.json({
      success: true,
      data: {
        url,
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Dosya yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}







