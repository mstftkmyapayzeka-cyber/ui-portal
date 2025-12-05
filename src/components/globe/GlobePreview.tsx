'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Globe, ArrowRight, MapPin, Newspaper, BarChart3, X } from 'lucide-react'

// Dynamic import for 3D Globe (client-side only)
const Globe3D = dynamic(() => import('./Globe3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">3D Dünya yükleniyor...</p>
      </div>
    </div>
  ),
})

interface GlobePreviewProps {
  totalNews?: number
  totalRegions?: number
}

const regionInfo: Record<string, { color: string; news: number }> = {
  'Avrupa': { color: '#3B82F6', news: 0 },
  'Orta Doğu': { color: '#F59E0B', news: 0 },
  'Asya-Pasifik': { color: '#EC4899', news: 0 },
  'Kuzey Amerika': { color: '#06B6D4', news: 0 },
  'Güney Amerika': { color: '#22C55E', news: 0 },
  'Afrika': { color: '#EAB308', news: 0 },
  'Türkiye': { color: '#EF4444', news: 0 },
}

export default function GlobePreview({ totalNews = 0, totalRegions = 7 }: GlobePreviewProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const router = useRouter()

  const handleRegionSelect = (regionName: string) => {
    setSelectedRegion(regionName)
  }

  const handleViewNews = () => {
    if (selectedRegion) {
      router.push(`/guncel-gelismeler?region=${encodeURIComponent(selectedRegion)}`)
    }
  }

  const handleViewAnalyses = () => {
    if (selectedRegion) {
      router.push(`/analizler?region=${encodeURIComponent(selectedRegion)}`)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900">
      <div className="flex flex-col lg:flex-row min-h-[500px]">
        {/* 3D Globe Section */}
        <div className="relative lg:w-2/3 h-[400px] lg:h-[500px]">
          <Globe3D 
            onRegionSelect={handleRegionSelect}
            className="w-full h-full"
          />
          
          {/* Title overlay */}
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-xl px-4 py-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">İnteraktif Dünya Haritası</h3>
                <p className="text-slate-400 text-xs">Bölge seçin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:w-1/3 p-6 lg:p-8 bg-slate-800/50 flex flex-col justify-center">
          {selectedRegion ? (
            // Selected region info
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: regionInfo[selectedRegion]?.color || '#888' }}
                  />
                  <h3 className="text-xl font-bold text-white">{selectedRegion}</h3>
                </div>
                <button 
                  onClick={() => setSelectedRegion(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-slate-300 text-sm mb-6">
                {selectedRegion} bölgesindeki güncel gelişmeleri ve uzman analizlerini keşfedin.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleViewNews}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors group"
                >
                  <span className="flex items-center gap-3">
                    <Newspaper className="w-5 h-5 text-teal-400" />
                    <span className="font-medium">Haberleri Gör</span>
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleViewAnalyses}
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
          ) : (
            // Default info
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Bölge Seçin</h3>
              <p className="text-slate-300 text-sm mb-6">
                Dünya üzerindeki işaretçilere tıklayarak bölgesel haberlere ve analizlere ulaşın.
              </p>

              {/* Region list */}
              <div className="space-y-2 mb-6">
                {Object.entries(regionInfo).map(([name, info]) => (
                  <button
                    key={name}
                    onClick={() => setSelectedRegion(name)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: info.color }}
                    />
                    <span className="text-sm text-white/80">{name}</span>
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{totalRegions}</p>
                  <p className="text-xs text-slate-400">Bölge</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{totalNews}</p>
                  <p className="text-xs text-slate-400">Haber</p>
                </div>
              </div>
            </div>
          )}

          {/* Full map link */}
          <Link
            href="/harita"
            className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-teal-500/20 text-teal-400 font-semibold hover:bg-teal-500/30 transition-colors"
          >
            Tam Ekran Harita
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
