'use client'

import { useState } from 'react'
import { Edit2, Users, TrendingUp } from 'lucide-react'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Modal from './ui/Modal'

export default function CapacityCard({ maxCapacity, activeOrders, mode, onUpdateCapacity, saving }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [inputVal, setInputVal]   = useState('')

  const effectiveMax = mode === 'utsuas' ? Math.floor(maxCapacity * 0.6) : maxCapacity
  const used         = activeOrders
  const remaining    = Math.max(0, effectiveMax - used)
  const pct          = effectiveMax > 0 ? (used / effectiveMax) * 100 : 0

  const barColor  = pct >= 90 ? 'from-red-400 to-red-500'   : pct >= 70 ? 'from-amber-400 to-amber-500' : 'from-green-400 to-green-500'
  const ringColor = pct >= 90 ? 'border-red-200 bg-red-50'  : pct >= 70 ? 'border-amber-200 bg-amber-50' : 'border-green-200 bg-green-50'
  const textColor = pct >= 90 ? 'text-red-500'              : pct >= 70 ? 'text-amber-500'                : 'text-green-500'
  const badgeV    = pct >= 90 ? 'danger'                    : pct >= 70 ? 'warning'                      : 'success'
  const badgeL    = pct >= 90 ? 'Hampir Penuh'              : pct >= 70 ? 'Waspada'                      : 'Normal'

  function handleOpen() { setInputVal(String(maxCapacity)); setModalOpen(true) }
  async function handleSave() {
    const val = parseInt(inputVal)
    if (!isNaN(val) && val > 0) { await onUpdateCapacity(val); setModalOpen(false) }
  }

  return (
    <>
      <Card className="relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-pink-50 rounded-full opacity-60 pointer-events-none" />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-pink-50 rounded-xl">
              <Users size={18} className="text-pink-400" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-gray-700">Kapasitas Hari Ini</h2>
              <Badge variant={badgeV} className="mt-0.5">{badgeL}</Badge>
            </div>
          </div>
          <button
            onClick={handleOpen}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-pink-400 border border-gray-200 hover:border-pink-300 rounded-xl px-3 py-1.5 transition-all"
          >
            <Edit2 size={11} /> Edit
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Maks', value: effectiveMax, color: 'text-gray-800' },
            { label: 'Terisi', value: used,         color: 'text-pink-500' },
            { label: 'Sisa',   value: remaining,    color: remaining <= 5 ? 'text-red-500' : 'text-green-500' },
          ].map(s => (
            <div key={s.label} className="text-center bg-pink-50/60 rounded-xl py-2.5 px-1">
              <p className={`text-3xl font-black ${s.color} leading-tight`}>{s.value}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-pink-100 rounded-full h-3 overflow-hidden mb-2">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`}
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>
        <div className="flex justify-between">
          <span className="text-[10px] text-gray-400">{Math.round(pct)}% terisi</span>
          <span className={`text-[10px] font-semibold ${textColor}`}>{remaining} slot tersisa</span>
        </div>

        {mode === 'utsuas' && (
          <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-700 font-medium">
            Mode UTS/UAS aktif — kapasitas 60% ({effectiveMax} dari {maxCapacity})
          </div>
        )}
        {remaining <= 5 && remaining > 0 && (
          <div className="mt-2 p-2.5 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-600 font-semibold text-center animate-pulse">
            Hanya tersisa {remaining} slot!
          </div>
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Edit Kapasitas Maksimum">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-600">
            Kapasitas Maksimum (order/hari)
          </label>
          <input
            type="number"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            min={1}
            className="w-full border-2 border-pink-200 focus:border-pink-400 rounded-xl px-3 py-3 text-2xl font-black text-center focus:outline-none transition-colors"
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
          <p className="text-xs text-gray-400 text-center">
            Mode UTS/UAS → {Math.floor(parseInt(inputVal || 0) * 0.6)} slot efektif
          </p>
          <div className="flex gap-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-pink-400 hover:bg-pink-500 text-white text-sm font-bold transition-colors disabled:opacity-60">
              Simpan
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
