'use client'

import { signOut } from 'next-auth/react'
import { User, LogOut, Moon, Sun, Menu } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

interface AdminHeaderProps {
  user: {
    name?: string | null
    email?: string | null
  }
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 lg:px-8 flex items-center justify-between">
      {/* Mobile menu button */}
      <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
        <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      </button>

      {/* Page title - can be dynamic */}
      <div className="hidden lg:block">
        <h1 className="text-lg font-medium text-slate-900 dark:text-white">
          Yönetici Paneli
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* User info */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {user.name || 'Admin'}
            </p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
            <User className="w-5 h-5 text-teal-600" />
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
            title="Çıkış Yap"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}







