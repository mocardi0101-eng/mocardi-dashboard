'use client'

import { Heart, Sun, BookOpen } from 'lucide-react'
import Card from './ui/Card'

export default function TeamWellbeing({ mode, onToggleMode }) {
  const isUTS = mode === 'utsuas'

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-pink-50 rounded-full opacity-50 pointer-events-none" />

      <div className="flex items-center gap-2 mb-5">
        <div className="p-2.5 bg-pink-50 rounded-xl">
          <Heart size={18} className="text-pink-400" />
        </div>
        <h2 className="text-lg font-display font-bold text-gray-700">Kondisi Tim</h2>
      </div>

      {/* Mode display */}
      <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 mb-4 transition-all ${
        isUTS
          ? 'bg-amber-50 border-amber-200'
          : 'bg-green-50 border-green-200'
      }`}>
        <div className={`p-2.5 rounded-xl ${isUTS ? 'bg-amber-100' : 'bg-green-100'}`}>
          {isUTS
            ? <BookOpen size={20} className="text-amber-600" />
            : <Sun size={20} className="text-green-600" />
          }
        </div>
        <div>
          <p className={`font-black text-sm ${isUTS ? 'text-amber-700' : 'text-green-700'}`}>
            {isUTS ? 'Mode UTS/UAS' : 'Mode Normal'}
          </p>
          <p className={`text-xs font-medium ${isUTS ? 'text-amber-500' : 'text-green-500'}`}>
            {isUTS ? 'Kapasitas dikurangi 40%' : 'Semua slot tersedia'}
          </p>
        </div>
        <div className={`ml-auto w-3 h-3 rounded-full ${isUTS ? 'bg-amber-400' : 'bg-green-400'} animate-pulse`} />
      </div>

      <button
        onClick={onToggleMode}
        className={`w-full py-3 rounded-xl text-sm font-bold transition-all border-2 ${
          isUTS
            ? 'bg-white text-green-600 border-green-200 hover:bg-green-50'
            : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50'
        }`}
      >
        {isUTS ? '✓ Kembali ke Mode Normal' : 'Aktifkan Mode UTS/UAS'}
      </button>
    </Card>
  )
}
