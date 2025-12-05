'use client'

import { Share2 } from 'lucide-react'

interface ShareButtonProps {
  title: string
}

export function ShareButton({ title }: ShareButtonProps) {
  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title, url: window.location.href })
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link panoya kopyalandı!')
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
    >
      <Share2 className="w-4 h-4" />
      Paylaş
    </button>
  )
}
