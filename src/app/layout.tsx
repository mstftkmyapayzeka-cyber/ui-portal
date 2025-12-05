import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SessionProvider } from '@/components/providers/SessionProvider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Uİ Portal - Uluslararası İlişkiler Platformu',
    template: '%s | Uİ Portal',
  },
  description: 'Uluslararası İlişkiler disiplini için kapsamlı akademik içerik platformu. Makaleler, analizler, podcastler ve daha fazlası.',
  keywords: ['uluslararası ilişkiler', 'politik analiz', 'akademik', 'podcast', 'makale', 'güvenlik çalışmaları'],
  authors: [{ name: 'Uİ Portal' }],
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Uİ Portal',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="font-body bg-white dark:bg-[#0c1a1a] text-slate-700 dark:text-slate-300 min-h-screen">
        <SessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
