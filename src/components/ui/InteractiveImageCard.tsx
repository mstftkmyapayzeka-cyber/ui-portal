'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface InteractiveImageCardProps {
  href: string
  image?: string | null
  title: string
  subtitle?: string
  badge?: string
  badgeColor?: string
  children?: React.ReactNode
  className?: string
  aspectRatio?: 'video' | 'square' | 'portrait'
}

export default function InteractiveImageCard({
  href,
  image,
  title,
  subtitle,
  badge,
  badgeColor = 'bg-teal-500',
  children,
  className = '',
  aspectRatio = 'video',
}: InteractiveImageCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePosition({ x, y })
  }

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
  }

  // Default placeholder gradient based on title
  const getDefaultGradient = () => {
    const gradients = [
      'from-teal-500 to-emerald-600',
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-red-600',
      'from-cyan-500 to-blue-600',
    ]
    const index = title.length % gradients.length
    return gradients[index]
  }

  return (
    <Link href={href}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 cursor-pointer ${className}`}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * -8}deg) rotateY(${(mousePosition.x - 0.5) * 8}deg) scale(1.02)`
            : 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* Image Container */}
        <div className={`relative ${aspectClasses[aspectRatio]} overflow-hidden`}>
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${getDefaultGradient()}`}>
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white/20 font-display text-6xl font-bold">
                  {title.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Shine Effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
            }}
          />

          {/* Badge */}
          {badge && (
            <div className="absolute top-4 left-4 z-10">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-white ${badgeColor} shadow-lg`}>
                {badge}
              </span>
            </div>
          )}

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <h3 className="text-white font-display text-lg sm:text-xl font-bold leading-snug mb-1.5 line-clamp-2 group-hover:text-teal-200 transition-colors">
              {title}
            </h3>
            {subtitle && (
              <p className="text-white/70 text-sm">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Optional Children Content */}
        {children && (
          <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            {children}
          </div>
        )}

        {/* Border Glow Effect */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: isHovered
              ? `inset 0 0 0 1px rgba(20, 184, 166, 0.5), 0 0 40px rgba(20, 184, 166, 0.2)`
              : 'none',
          }}
        />
      </div>
    </Link>
  )
}



