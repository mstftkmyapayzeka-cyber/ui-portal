import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Tüm makaleleri listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const year = searchParams.get('year')
    const limit = searchParams.get('limit')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '12')

    let query = supabase
      .from('Article')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .order('createdAt', { ascending: false })

    // Arama filtresi
    if (search) {
      query = query.or(`title.ilike.%${search}%,authors.ilike.%${search}%,tags.ilike.%${search}%`)
    }

    // Yıl filtresi
    if (year) {
      query = query.eq('year', parseInt(year))
    }

    // Pagination
    const from = (page - 1) * pageSize
    const to = from + (limit ? parseInt(limit) : pageSize) - 1
    
    if (!limit) {
      query = query.range(from, to)
    } else {
      query = query.limit(parseInt(limit))
    }

    const { data: articles, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Makaleler yüklenirken hata oluştu' },
        { status: 500 }
      )
    }

    const total = count || 0
    const totalPages = Math.ceil(total / pageSize)

    return NextResponse.json({
      articles: articles || [],
      total,
      page,
      pageSize,
      totalPages,
    })
  } catch (error) {
    console.error('Articles GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Makaleler yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// POST - Yeni makale ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, authors, journalOrBook, year, summary, tags, externalUrl, published } = body

    const { data: article, error } = await supabase
      .from('Article')
      .insert({
        id: crypto.randomUUID(),
        title,
        authors,
        journalOrBook: journalOrBook || null,
        year: year ? parseInt(year) : null,
        summary,
        tags: tags || '',
        externalUrl: externalUrl || null,
        published: published || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Makale eklenirken hata oluştu' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: article }, { status: 201 })
  } catch (error) {
    console.error('Article POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Makale eklenirken hata oluştu' },
      { status: 500 }
    )
  }
}
