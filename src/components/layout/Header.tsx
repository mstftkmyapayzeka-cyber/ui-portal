'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'
import SearchModal from '@/components/ui/SearchModal'

const navigation = [
  { name: 'Makaleler', href: '/makaleler' },
  { name: 'Analizler', href: '/analizler' },
  { name: 'Podcast\'ler', href: '/podcastler' },
  { name: 'Gündem', href: '/guncel-gelismeler' },
  { name: 'Harita', href: '/harita' },
  { name: 'Öğren', href: '/ogren' },
]

// SVG Icons
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
)

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default function Header() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 text-slate-900 dark:text-white hover:opacity-80 transition-opacity flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-teal-500/20">
              Uİ
            </div>
            <span className="text-xl font-display font-bold tracking-tight hidden sm:block">Portal</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-1">
            {/* Search button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200"
              aria-label="Ara"
            >
              <SearchIcon />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200"
              aria-label="Tema değiştir"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Favorites */}
            <Link
              href="/favoriler"
              className="hidden sm:flex p-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-500 dark:hover:text-rose-400 transition-all duration-200"
              aria-label="Favoriler"
            >
              <HeartIcon />
            </Link>

            {/* Login button */}
            <Link
              href="/admin/login"
              className="hidden sm:flex ml-2 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition-all duration-200"
            >
              Giriş
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              aria-label="Menü"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-lg">
            <nav className="flex flex-col p-4 gap-1 max-w-7xl mx-auto">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <hr className="my-2 border-slate-200 dark:border-slate-700" />
              <Link
                href="/favoriler"
                onClick={() => setIsMobileMenuOpen(false)}
                className="sm:hidden px-4 py-3 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3"
              >
                <HeartIcon />
                Favorilerim
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="sm:hidden px-4 py-3 rounded-lg text-sm font-semibold bg-teal-500 text-white text-center hover:bg-teal-600 transition-colors"
              >
                Giriş Yap
              </Link>
            </nav>
          </div>
        )}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
