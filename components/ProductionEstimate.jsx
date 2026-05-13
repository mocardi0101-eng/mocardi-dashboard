'use client'

import { useMemo, useState } from 'react'
import { FlaskConical, Plus, Minus } from 'lucide-react'
import Card from './ui/Card'
import { MENU, formatRupiah } from '@/lib/constants'

export default function ProductionEstimate({ inventory }) {
  const [mode,    setMode]    = useState('estimate') // 'estimate' | 'plan'
  const [targets, setTargets] = useState(() => Object.fromEntries(MENU.map(m => [m.id, 0])))

  const stockMap = useMemo(() => {
    const m = {}
    inventory.forEach(i => { m[i.key] = i.stock })
    return m
  }, [inventory])

  // ── Estimasi: max porsi dari stok ──────────────────────────────────────────
  const estimates = useMemo(() => MENU.map(item => {
    let maxPortions = Infinity
    let bottleneck  = null
    for (const [key, needed] of Object.entries(item.ingredients)) {
      const canMake = needed > 0 ? Math.floor((stockMap[key] ?? 0) / needed) : Infinity
      if (canMake < maxPortions) { maxPortions = canMake; bottleneck = key }
    }
    return { ...item, maxPortions: maxPortions === Infinity ? 0 : maxPortions, bottleneck }
  }), [stockMap])

  // ── Rencana: cek apakah target bisa dipenuhi ───────────────────────────────
  const planChecks = useMemo(() => {
    // Gabungkan kebutuhan semua item berdasarkan target
    const totalNeeded = {}
    for (const item of MENU) {
      const qty = targets[item.id] || 0
      if (qty === 0) continue
      for (const [key, amt] of Object.entries(item.ingredients)) {
        totalNeeded[key] = (totalNeeded[key] || 0) + amt * qty
      }
    }
    // Cek per menu item
    return MENU.map(item => {
      const qty = targets[item.id] || 0
      const shortage = []
      for (const [key, amt] of Object.entries(item.ingredients)) {
        const needed    = amt * qty
        const available = stockMap[key] ?? 0
        if (needed > available) {
          const inv = inventory.find(i => i.key === key)
          shortage.push({ label: inv?.label || key, kurang: needed - available, unit: inv?.unit || '' })
        }
      }
      return { ...item, qty, ok: qty === 0 || shortage.length === 0, shortage }
    })
  }, [targets, stockMap, inventory])

  const totalTarget  = Object.values(targets).reduce((a, b) => a + b, 0)
  const totalRevPlan = MENU.reduce((s, m) => s + m.price * (targets[m.id] || 0), 0)
  const allOk        = planChecks.every(p => p.ok)

  function adjust(id, delta) {
    setTargets(p => ({ ...p, [id]: Math.max(0, (p[id] || 0) + delta) }))
  }

  function getEstColor(n) {
    if (n === 0)  return { bar: 'bg-red-400',   text: 'text-red-500',   bg: 'bg-red-50',   border: 'border-red-200' }
    if (n <= 3)   return { bar: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
    return               { bar: 'bg-green-400', text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
  }

  const maxEst = Math.max(...estimates.map(e => e.maxPortions), 1)

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-pink-50 rounded-xl">
            <FlaskConical size={18} className="text-pink-400" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-gray-700">Estimasi Produksi</h2>
            <p className="text-xs text-gray-400">Berdasarkan stok saat ini</p>
          </div>
        </div>
        {/* Toggle mode */}
        <div className="flex bg-pink-50 rounded-xl p-0.5 gap-0.5">
          {[['estimate','Estimasi'],['plan','Rencanakan']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setMode(val)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                mode === val ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MODE ESTIMASI ── */}
      {mode === 'estimate' && (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400">Maks porsi yang bisa dibuat</p>
            <div className="text-right">
              <span className="text-2xl font-black text-pink-400">
                {estimates.reduce((s, e) => s + e.maxPortions, 0)}
              </span>
              <span className="text-xs text-gray-400 ml-1">porsi</span>
            </div>
          </div>

          <div className="space-y-3">
            {estimates.map(item => {
              const c   = getEstColor(item.maxPortions)
              const pct = Math.min(100, (item.maxPortions / maxEst) * 100)
              const inv = inventory.find(i => i.key === item.bottleneck)
              return (
                <div key={item.id} className={`p-3.5 rounded-2xl border ${c.bg} ${c.border}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.emoji}</span>
                      <div>
                        <p className="text-sm font-bold text-gray-700 leading-tight">{item.name}</p>
                        {item.maxPortions === 0 && inv && (
                          <p className="text-[10px] text-red-500 font-medium">Stok {inv.label} habis</p>
                        )}
                        {item.maxPortions > 0 && item.maxPortions <= 3 && inv && (
                          <p className="text-[10px] text-amber-600 font-medium">Terbatas oleh {inv.label}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-black ${c.text}`}>{item.maxPortions}</span>
                      <p className="text-[10px] text-gray-400">porsi</p>
                    </div>
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full ${c.bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* ── MODE RENCANAKAN ── */}
      {mode === 'plan' && (
        <>
          <div className="space-y-3 mb-4">
            {planChecks.map(item => (
              <div key={item.id} className={`p-3.5 rounded-2xl border-2 transition-all ${
                item.qty === 0   ? 'bg-gray-50 border-gray-100' :
                item.ok          ? 'bg-green-50 border-green-200' :
                                   'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.emoji}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-700">{item.name}</p>
                      <p className="text-xs text-pink-400 font-semibold">{formatRupiah(item.price * item.qty)}</p>
                    </div>
                  </div>
                  {/* Stepper */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adjust(item.id, -1)}
                      disabled={item.qty === 0}
                      className="w-8 h-8 rounded-xl border-2 border-pink-200 text-pink-400 hover:bg-pink-50 disabled:opacity-30 flex items-center justify-center transition-colors"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center font-black text-gray-700 text-lg">{item.qty}</span>
                    <button
                      onClick={() => adjust(item.id, 1)}
                      className="w-8 h-8 rounded-xl bg-pink-400 hover:bg-pink-500 text-white flex items-center justify-center transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                {/* Shortage warning */}
                {item.qty > 0 && !item.ok && (
                  <div className="mt-2 pt-2 border-t border-red-200 space-y-0.5">
                    {item.shortage.map((s, i) => (
                      <p key={i} className="text-[11px] text-red-600 font-medium">
                        Kurang {s.label}: {s.kurang} {s.unit}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary */}
          {totalTarget > 0 && (
            <div className={`p-3.5 rounded-2xl border-2 ${allOk ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-700">{totalTarget} porsi direncanakan</p>
                  <p className={`text-xs font-semibold mt-0.5 ${allOk ? 'text-green-600' : 'text-red-600'}`}>
                    {allOk ? 'Stok cukup untuk semua!' : 'Stok tidak cukup — cek kekurangan di atas'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-pink-500">{formatRupiah(totalRevPlan)}</p>
                  <p className="text-[10px] text-gray-400">est. revenue</p>
                </div>
              </div>
            </div>
          )}

          {totalTarget === 0 && (
            <p className="text-center text-xs text-gray-300 py-2">Tap + untuk atur target produksi</p>
          )}
        </>
      )}
    </Card>
  )
}
