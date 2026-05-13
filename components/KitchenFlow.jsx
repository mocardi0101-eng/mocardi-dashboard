'use client'

import { useState } from 'react'
import { ChefHat, Check, Timer, RotateCcw } from 'lucide-react'
import Card from './ui/Card'

const STEPS = [
  { id: 1, label: 'Siapkan Bahan',  desc: 'Timbang & siapkan semua bahan sesuai resep', emoji: '🥣', time: null },
  { id: 2, label: 'Proses Masak',   desc: 'Proses memasak — estimasi 10 menit', emoji: '🔥', time: '10 mnt' },
  { id: 3, label: 'Packing & QC',   desc: 'Kemas produk dengan rapi & cantik', emoji: '📦', time: null },
]

export default function KitchenFlow() {
  const [checked, setChecked] = useState({})

  const doneCount = Object.values(checked).filter(Boolean).length
  const allDone   = doneCount === STEPS.length

  return (
    <Card className="relative overflow-hidden">
      {allDone && (
        <div className="absolute inset-0 bg-green-50/40 rounded-2xl pointer-events-none" />
      )}

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-pink-50 rounded-xl">
            <ChefHat size={18} className="text-pink-400" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-gray-700">Kitchen Flow</h2>
            <p className="text-xs text-gray-400">{doneCount}/{STEPS.length} langkah selesai</p>
          </div>
        </div>
        {doneCount > 0 && (
          <button
            onClick={() => setChecked({})}
            className="p-1.5 text-gray-300 hover:text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>

      {/* Progress bar mini */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-400 to-pink-500 transition-all duration-500"
          style={{ width: `${(doneCount / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="space-y-3">
        {STEPS.map((step, idx) => {
          const done    = !!checked[step.id]
          const isLast  = idx === STEPS.length - 1

          return (
            <div
              key={step.id}
              onClick={() => setChecked(p => ({ ...p, [step.id]: !p[step.id] }))}
              className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all select-none ${
                done
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50/60 border-gray-100 hover:border-pink-200 hover:bg-pink-50/40'
              }`}
            >
              {/* Check circle */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-all ${
                done ? 'bg-green-400 shadow-md shadow-green-200' : 'bg-white border-2 border-gray-200'
              }`}>
                {done ? <Check size={16} className="text-white" strokeWidth={3} /> : step.emoji}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-bold transition-colors ${done ? 'text-green-600 line-through' : 'text-gray-700'}`}>
                    {step.label}
                  </p>
                  {step.time && (
                    <span className="flex items-center gap-0.5 text-[9px] text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-1.5 py-0.5 font-bold">
                      <Timer size={8} /> {step.time}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{step.desc}</p>
              </div>

              <div className={`w-4 h-4 rounded-full border-2 transition-all ${done ? 'bg-green-400 border-green-400' : 'border-gray-200'}`} />
            </div>
          )
        })}
      </div>

      {allDone && (
        <div className="mt-4 p-3.5 bg-green-50 border-2 border-green-200 rounded-2xl text-center">
          <p className="text-sm font-black text-green-600">Semua selesai! Siap diantar</p>
          <p className="text-xs text-green-500 mt-0.5">Tap icon reset untuk mulai batch baru</p>
        </div>
      )}
    </Card>
  )
}
