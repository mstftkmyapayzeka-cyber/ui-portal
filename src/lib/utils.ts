import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind class birleştirme
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// JSON string'i parse et (etiketler için)
export function parseJsonArray(jsonString: string | null | undefined): string[] {
  if (!jsonString) return []
  try {
    const parsed = JSON.parse(jsonString)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Array'i JSON string'e çevir
export function stringifyArray(arr: string[]): string {
  return JSON.stringify(arr)
}

// Tarih formatlama
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Kısa tarih formatlama
export function formatShortDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// Zaman farkı (örn: "2 saat önce")
export function timeAgo(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Az önce'
  if (diffMins < 60) return `${diffMins} dakika önce`
  if (diffHours < 24) return `${diffHours} saat önce`
  if (diffDays < 7) return `${diffDays} gün önce`
  return formatDate(date)
}

// Dakikayı saat:dakika formatına çevir
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins} dk`
  return `${hours} sa ${mins} dk`
}

// Metin kısaltma
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// Slug oluştur
export function createSlug(text: string): string {
  const turkishChars: { [key: string]: string } = {
    ç: 'c',
    ğ: 'g',
    ı: 'i',
    ö: 'o',
    ş: 's',
    ü: 'u',
    Ç: 'C',
    Ğ: 'G',
    İ: 'I',
    Ö: 'O',
    Ş: 'S',
    Ü: 'U',
  }

  return text
    .toLowerCase()
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (char) => turkishChars[char] || char)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Bölge listesi
export const REGIONS = [
  'Avrupa',
  'Orta Doğu',
  'Asya-Pasifik',
  'Kuzey Amerika',
  'Latin Amerika',
  'Afrika',
  'Küresel',
] as const

// Haber kategorileri
export const NEWS_CATEGORIES = [
  'Güvenlik',
  'Ekonomi',
  'Diplomasi',
  'İnsan Hakları',
  'Çevre',
  'Teknoloji',
  'Enerji',
  'Göç',
] as const

// Analiz kategorileri
export const ANALYSIS_CATEGORIES = [
  'Güvenlik Çalışmaları',
  'Uluslararası Örgütler',
  'Bölgesel Politikalar',
  'Uluslararası Ekonomi',
  'Diplomasi Tarihi',
  'Dış Politika Analizi',
  'Uluslararası Hukuk',
  'Küreselleşme',
] as const

// Kaynak türleri
export const RESOURCE_TYPES = [
  'Kitap',
  'Akademik Makale',
  'Düşünür',
  'Çevrimiçi Araç',
  'Veri Kaynağı',
  'Dergi',
  'Think Tank',
  'Diğer',
] as const

// Bugün mü kontrolü
export function isToday(date: Date | string): boolean {
  const d = new Date(date)
  const today = new Date()
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

// Son 24 saat içinde mi kontrolü
export function isWithinLast24Hours(date: Date | string): boolean {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  return diffMs <= 24 * 60 * 60 * 1000
}







