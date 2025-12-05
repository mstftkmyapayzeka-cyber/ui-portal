'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { MapPin, Newspaper, BarChart3, ArrowRight, X } from 'lucide-react'

const Globe3D = dynamic(() => import('@/components/globe/Globe3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-slate-900 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">3D Dünya haritası yükleniyor...</p>
      </div>
    </div>
  ),
})

const regionColors: Record<string, string> = {
  'Avrupa': '#3B82F6',
  'Orta Doğu': '#F59E0B',
  'Asya-Pasifik': '#EC4899',
  'Kuzey Amerika': '#06B6D4',
  'Güney Amerika': '#22C55E',
  'Afrika': '#EAB308',
  'Türkiye': '#EF4444',
}

interface MapClientProps {
  newsCounts: Record<string, number>
}

export default function MapClient({ newsCounts }: MapClientProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const router = useRouter()

  const handleRegionSelect = (regionName: string) => {
    setSelectedRegion(regionName)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative">
        {/* Globe */}
        <div className="rounded-3xl overflow-hidden border border-slate-800">
          <Globe3D 
            onRegionSelect={handleRegionSelect}
            className="w-full h-[600px]"
          />
        </div>

        {/* Selected Region Panel */}
        {selectedRegion && (
          <div 
            className="absolute top-4 right-4 w-80 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden z-20"
            style={{ animation: 'slideIn 0.3s ease-out' }}
          >
            <style jsx>{`
              @keyframes slideIn {
                from { opacity: 0; transform: translateX(20px); }
                to { opacity: 1; transform: translateX(0); }
              }
            `}</style>

            {/* Header */}
            <div 
              className="p-5 relative"
              style={{ background: `linear-gradient(135deg, ${regionColors[selectedRegion]}40, ${regionColors[selectedRegion]}20)` }}
            >
              <button
                onClick={() => setSelectedRegion(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: regionColors[selectedRegion] }}
                >
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedRegion}</h3>
                  <p className="text-white/60 text-sm">{newsCounts[selectedRegion] || 0} güncel haber</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 space-y-3">
              <button
                onClick={() => router.push(`/guncel-gelismeler?region=${encodeURIComponent(selectedRegion)}`)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors group"
              >
                <span className="flex items-center gap-3">
                  <Newspaper className="w-5 h-5 text-teal-400" />
                  <span className="font-medium">Haberleri Gör</span>
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => router.push(`/analizler?region=${encodeURIComponent(selectedRegion)}`)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors group"
              >
                <span className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <span className="font-medium">Analizleri Gör</span>
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">Bölgeler</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(regionColors).map(([name, color]) => (
              <button
                key={name}
                onClick={() => setSelectedRegion(name)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${
                  selectedRegion === name ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-white/80">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-700">
          <p className="text-xs text-slate-400">🖱️ Sürükle: Döndür</p>
          <p className="text-xs text-slate-400">🔍 Scroll: Yakınlaştır</p>
          <p className="text-xs text-slate-400">📍 Tıkla: Bölge seç</p>
        </div>
      </div>
    </div>
  )
}



