// Ortak tipler

export interface Article {
  id: string
  title: string
  authors: string
  journalOrBook: string | null
  year: number | null
  summary: string
  tags: string
  externalUrl: string | null
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface NewsItem {
  id: string
  title: string
  description: string
  region: string
  category: string
  tags: string
  publishedAt: Date
  relatedAnalysisId: string | null
  published: boolean
  createdAt: Date
  updatedAt: Date
  relatedAnalysis?: Analysis | null
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
  publishedAt: Date
  published: boolean
  createdAt: Date
  updatedAt: Date
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
  createdAt: Date
  updatedAt: Date
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
  publishedAt: Date
  featured: boolean
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Resource {
  id: string
  name: string
  type: string
  description: string
  relatedTheory: string | null
  externalUrl: string | null
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Concept {
  id: string
  name: string
  shortDefinition: string
  detailedExplanation: string | null
  relatedTheory: string | null
  published: boolean
  createdAt: Date
  updatedAt: Date
}

// Quiz sorusu tipi
export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
}

// Önerilen okuma tipi
export interface RecommendedReading {
  title: string
  author: string
  url?: string
}

// Favori tipi
export interface FavoriteItem {
  id: string
  type: 'article' | 'analysis' | 'podcast'
  title: string
  addedAt: string
}

// API Response tipleri
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Form tipleri
export interface ArticleFormData {
  title: string
  authors: string
  journalOrBook: string
  year: string
  summary: string
  tags: string
  externalUrl: string
  published: boolean
}

export interface NewsFormData {
  title: string
  description: string
  region: string
  category: string
  tags: string
  publishedAt: string
  relatedAnalysisId: string
  published: boolean
}

export interface AnalysisFormData {
  title: string
  shortSummary: string
  content: string
  author: string
  readingTimeMinutes: string
  categories: string
  tags: string
  publishedAt: string
  published: boolean
}

export interface LearningModuleFormData {
  title: string
  slug: string
  shortDescription: string
  learningObjectives: string
  keyConcepts: string
  content: string
  recommendedReadings: string
  quizQuestions: string
  orderIndex: string
  published: boolean
}

export interface PodcastFormData {
  title: string
  description: string
  durationMinutes: string
  topic: string
  tags: string
  videoUrl: string
  thumbnailUrl: string
  publishedAt: string
  featured: boolean
  published: boolean
}

export interface ResourceFormData {
  name: string
  type: string
  description: string
  relatedTheory: string
  externalUrl: string
  published: boolean
}

export interface ConceptFormData {
  name: string
  shortDefinition: string
  detailedExplanation: string
  relatedTheory: string
  published: boolean
}







