import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Article {
  id: string
  title: string
  authors: string
  journalOrBook: string | null
  year: number | null
  summary: string
  tags: string
  externalUrl: string | null
  imageUrl: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface Analysis {
  id: string
  title: string
  shortSummary: string
  content: string
  author: string
  readingTimeMinutes: number
  categories: string
  tags: string
  imageUrl: string | null
  publishedAt: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface NewsItem {
  id: string
  title: string
  description: string
  region: string
  category: string
  tags: string
  publishedAt: string
  relatedAnalysisId: string | null
  sourceUrl: string | null
  imageUrl: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface Podcast {
  id: string
  title: string
  description: string
  durationMinutes: number
  topic: string
  tags: string
  videoUrl: string
  thumbnailUrl: string | null
  publishedAt: string
  featured: boolean
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface Concept {
  id: string
  name: string
  shortDefinition: string
  detailedExplanation: string | null
  relatedTheory: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface Resource {
  id: string
  name: string
  type: string
  description: string
  relatedTheory: string | null
  externalUrl: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface LearningModule {
  id: string
  title: string
  slug: string
  shortDescription: string
  learningObjectives: string
  keyConcepts: string
  content: string
  recommendedReadings: string
  quizQuestions: string
  orderIndex: number
  published: boolean
  createdAt: string
  updatedAt: string
}

