'use client'

import { useState } from 'react'
import { Loader2, LogOut } from 'lucide-react'
import { formatDateID } from '@/lib/constants'

export default function Header({ saving, onLogout }) {
  const [logoErr, setLogoErr] = useState(false)

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm sticky top-0 z-40">
      {/* Pink accent bar at top */}
      <div className="h-1 w-full bg-gradient-to-r from-pink-300 via-pink-400 to-pink-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-pink-200 shadow-md flex items-center justify-center bg-pink-50 flex-shrink-0">
              {!logoErr ? (
                <img src="/logo.jpg" alt="Mocardi" className="w-full h-full object-cover" onError={() => setLogoErr(true)} />
              ) : (
                <span className="text-2xl font-display font-bold text-pink-400">M</span>
              )}
            </div>
            <span className="absolute -top-1 -right-1 text-xs animate-float-fast">✨</span>
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-pink-500 leading-tight">Mocardi</h1>
            <p className="text-[11px] text-gray-400 font-semibold leading-tight hidden sm:block">
              Internal Operational Dashboard 🍰
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {saving && (
            <span className="flex items-center gap-1 text-xs text-pink-400 font-semibold animate-pulse">
              <Loader2 size={12} className="animate-spin" /> Menyimpan...
            </span>
          )}
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-gray-300 font-semibold">Hari ini</p>
            <p className="text-xs font-bold text-gray-600">{formatDateID()}</p>
          </div>
          <button
            onClick={onLogout}
            className="p-2.5 rounded-xl text-gray-300 hover:text-pink-400 hover:bg-pink-50 transition-all"
            title="Keluar"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
