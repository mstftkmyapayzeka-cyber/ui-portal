'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Newspaper, 
  TrendingUp, 
  BookOpen, 
  Headphones, 
  Library, 
  Lightbulb,
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Makaleler', href: '/admin/makaleler', icon: FileText },
  { name: 'Haberler', href: '/admin/haberler', icon: Newspaper },
  { name: 'Analizler', href: '/admin/analizler', icon: TrendingUp },
  { name: 'Öğrenme Modülleri', href: '/admin/moduller', icon: BookOpen },
  { name: 'Podcastler', href: '/admin/podcastler', icon: Headphones },
  { name: 'Kaynaklar', href: '/admin/kaynaklar', icon: Library },
  { name: 'Kavramlar', href: '/admin/kavramlar', icon: Lightbulb },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      <div className="lg:hidden fixed inset-0 bg-black/50 z-40 hidden" />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-50 transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          'hidden lg:block'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="font-serif font-bold text-slate-900 dark:text-white">
                Uİ Admin
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = 
              item.href === '/admin' 
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700',
                  collapsed && 'justify-center'
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors"
            >
              <Globe className="w-4 h-4" />
              Siteye Git
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}







