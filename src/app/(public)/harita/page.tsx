import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, Globe, MapPin } from 'lucide-react'

// Dynamic import for client-side only component
const Globe3D = dynamic(
  () => import('@/components/globe/Globe3D'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-slate-900 rounded-3xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">3D Dünya haritası yükleniyor...</p>
        </div>
      </div>
    )
  }
)

// Client component for interactive features
const MapClient = dynamic(() => import('./MapClient'), { ssr: false })

export const metadata = {
  title: 'Dünya Haritası | Uluslararası İlişkiler',
  description: 'İnteraktif dünya haritası ile bölgesel haberleri ve analizleri keşfedin',
}

async function getRegionCounts() {
  const regions = ['Avrupa', 'Orta Doğu', 'Asya-Pasifik', 'Kuzey Amerika', 'Güney Amerika', 'Afrika', 'Türkiye', 'Küresel']
  
  const newsCounts: Record<string, number> = {}

  for (const region of regions) {
    const { count } = await supabase
      .from('NewsItem')
      .select('*', { count: 'exact', head: true })
      .eq('published', true)
      .eq('region', region)
    
    newsCounts[region] = count || 0
  }

  return { newsCounts }
}

export default async function MapPage() {
  const { newsCounts } = await getRegionCounts()

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfa
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-display">İnteraktif Dünya Haritası</h1>
              <p className="text-slate-400 mt-1">Bölgelere tıklayarak güncel haberleri keşfedin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <MapClient newsCounts={newsCounts} />

      {/* Region Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-bold text-white mb-6">Bölgelere Hızlı Erişim</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { name: 'Avrupa', color: '#3B82F6' },
            { name: 'Orta Doğu', color: '#F59E0B' },
            { name: 'Asya-Pasifik', color: '#EC4899' },
            { name: 'Kuzey Amerika', color: '#06B6D4' },
            { name: 'Güney Amerika', color: '#22C55E' },
            { name: 'Afrika', color: '#EAB308' },
            { name: 'Türkiye', color: '#EF4444' },
          ].map((region) => (
            <Link
              key={region.name}
              href={`/guncel-gelismeler?region=${encodeURIComponent(region.name)}`}
              className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all duration-300"
            >
              <div 
                className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${region.color}20` }}
              >
                <MapPin className="w-5 h-5" style={{ color: region.color }} />
              </div>
              <p className="text-white font-medium text-sm group-hover:text-teal-400 transition-colors">
                {region.name}
              </p>
              <p className="text-slate-500 text-xs mt-1">
                {newsCounts[region.name] || 0} haber
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
