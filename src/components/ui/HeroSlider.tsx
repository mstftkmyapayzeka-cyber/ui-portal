'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight, Newspaper, MapPin, Calendar } from 'lucide-react'

const AUTO_PLAY_INTERVAL = 6000

// Region gradient colors
const regionGradients: Record<string, string> = {
  'Avrupa': 'from-blue-900/90 via-indigo-900/80 to-blue-800/70',
  'Orta Doğu': 'from-amber-900/90 via-orange-900/80 to-amber-800/70',
  'Asya-Pasifik': 'from-rose-900/90 via-pink-900/80 to-rose-800/70',
  'Kuzey Amerika': 'from-cyan-900/90 via-blue-900/80 to-cyan-800/70',
  'Güney Amerika': 'from-green-900/90 via-emerald-900/80 to-green-800/70',
  'Afrika': 'from-yellow-900/90 via-amber-900/80 to-yellow-800/70',
  'Türkiye': 'from-red-900/90 via-rose-900/80 to-red-800/70',
  'Küresel': 'from-violet-900/90 via-purple-900/80 to-violet-800/70',
}

const regionIcons: Record<string, string> = {
  'Avrupa': '🇪🇺',
  'Orta Doğu': '🌍',
  'Asya-Pasifik': '🌏',
  'Kuzey Amerika': '🌎',
  'Güney Amerika': '🌎',
  'Afrika': '🌍',
  'Türkiye': '🇹🇷',
  'Küresel': '🌐',
}

interface NewsItem {
  id: string
  title: string
  description: string
  region: string
  category: string
  tags: string
  publishedAt: string
  sourceUrl?: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

interface HeroSliderProps {
  news: NewsItem[]
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function HeroSlider({ news }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  // Eğer haber yoksa fallback göster
  const slides = news.length > 0 ? news : []

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return
    setProgress(0)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return
    setProgress(0)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setProgress(0)
    setCurrentSlide(index)
  }

  // Auto-play with smooth progress indicator
  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return
    let frame: number
    let start: number | null = null

    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const percentage = Math.min((elapsed / AUTO_PLAY_INTERVAL) * 100, 100)
      setProgress(percentage)

      if (percentage >= 100) {
        nextSlide()
        return
      }

      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => {
      if (frame) cancelAnimationFrame(frame)
    }
  }, [isAutoPlaying, currentSlide, nextSlide, slides.length])

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  // Haber yoksa alternatif bir hero göster
  if (slides.length === 0) {
    return (
      <section className="relative w-full h-[480px] sm:h-[540px] lg:h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.15),transparent_60%)]" />

        <div className="relative z-20 h-full flex items-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-8 h-[2px] bg-teal-400" />
                <span className="text-teal-400 text-sm font-semibold uppercase tracking-widest">
                  Gündem
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-[1.1]">
                Uluslararası İlişkiler Portalı
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
                Dünya genelinden güncel gelişmeleri, derinlemesine analizleri ve uzman görüşlerini takip edin.
              </p>
              <Link
                href="/guncel-gelismeler"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold transition-all duration-300"
              >
                Gündemi Keşfet
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="relative w-full h-[480px] sm:h-[540px] lg:h-[600px] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides */}
      {slides.map((newsItem, index) => {
        const gradient = regionGradients[newsItem.region] || 'from-slate-900/90 via-slate-800/80 to-slate-700/70'
        const regionIcon = regionIcons[newsItem.region] || '🌐'

        return (
          <div
            key={newsItem.id}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${index === currentSlide
                ? 'opacity-100 z-10'
                : 'opacity-0 z-0'
              }`}
          >
            {/* Dynamic Background based on region */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
              </div>
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5" />
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

            {/* Content */}
            <div className="relative z-20 h-full flex items-center">
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                  {/* Region & Category Badge */}
                  <div
                    className={`flex flex-wrap items-center gap-3 mb-4 transition-all duration-700 delay-100 ${index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                      }`}
                  >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold">
                      <MapPin className="w-4 h-4 text-teal-400" />
                      <span className="text-lg mr-1">{regionIcon}</span>
                      {newsItem.region}
                    </span>
                    <span className="px-4 py-2 rounded-full bg-teal-500/20 backdrop-blur-sm border border-teal-400/30 text-teal-300 text-sm font-semibold">
                      {newsItem.category}
                    </span>
                  </div>

                  {/* News Badge */}
                  <div
                    className={`inline-flex items-center gap-2 mb-4 transition-all duration-700 delay-150 ${index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                      }`}
                  >
                    <span className="w-8 h-[2px] bg-teal-400" />
                    <Newspaper className="w-4 h-4 text-teal-400" />
                    <span className="text-teal-400 text-sm font-semibold uppercase tracking-widest">
                      Gündem
                    </span>
                  </div>

                  {/* Title */}
                  <h1
                    className={`font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-5 leading-[1.15] transition-all duration-700 delay-200 ${index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-6'
                      }`}
                  >
                    {newsItem.title}
                  </h1>

                  {/* Description */}
                  <p
                    className={`text-base sm:text-lg lg:text-xl text-slate-300 mb-6 leading-relaxed line-clamp-3 transition-all duration-700 delay-300 ${index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-6'
                      }`}
                  >
                    {newsItem.description}
                  </p>

                  {/* Date & CTA */}
                  <div
                    className={`flex flex-wrap items-center gap-4 transition-all duration-700 delay-400 ${index === currentSlide
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-6'
                      }`}
                  >
                    <Link
                      href={`/guncel-gelismeler/${newsItem.id}`}
                      className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold transition-all duration-300 shadow-lg shadow-teal-500/25"
                    >
                      Haberi Oku
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <span className="inline-flex items-center gap-2 text-slate-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      {formatDate(newsItem.publishedAt || newsItem.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300"
            aria-label="Önceki haber"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300"
            aria-label="Sonraki haber"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Slide Indicators with News Count */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                    ? 'w-8 bg-teal-400'
                    : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                aria-label={`Haber ${index + 1}`}
              />
            ))}
          </div>
          <span className="text-white/60 text-sm font-medium">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* See All News Link */}
      <Link
        href="/guncel-gelismeler"
        className="absolute bottom-8 right-6 z-30 hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all duration-300"
      >
        <Newspaper className="w-4 h-4" />
        Tüm Haberler
        <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  )
}
