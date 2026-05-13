'use client'

import { useState } from 'react'
import { Package, Edit2, Check, X, Settings, AlertTriangle } from 'lucide-react'
import Card from './ui/Card'
import Modal from './ui/Modal'

function getStatus(stock, minStock) {
  if (stock <= minStock)         return { label: 'Kritis',  color: 'bg-red-400',   bg: 'bg-red-50',   border: 'border-red-200',   text: 'text-red-600' }
  if (stock <= minStock * 1.5)   return { label: 'Menipis', color: 'bg-amber-400', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' }
  return                                { label: 'Aman',    color: 'bg-green-400', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' }
}

export default function InventoryCard({ inventory, onUpdateStock, onUpdateMinStock, saving }) {
  const [editingKey, setEditingKey] = useState(null)
  const [editVal,    setEditVal]    = useState('')
  const [minModal,   setMinModal]   = useState(false)
  const [minValues,  setMinValues]  = useState({})

  const criticalItems = inventory.filter(i => i.stock <= i.min_stock)
  const warningItems  = inventory.filter(i => i.stock > i.min_stock && i.stock <= i.min_stock * 1.5)

  function startEdit(item)  { setEditingKey(item.key); setEditVal(String(item.stock)) }
  async function saveEdit(item) {
    const val = parseInt(editVal)
    if (!isNaN(val) && val >= 0) await onUpdateStock(item.key, val)
    setEditingKey(null)
  }

  function openMinModal() {
    const vals = {}
    inventory.forEach(i => { vals[i.key] = String(i.min_stock) })
    setMinValues(vals); setMinModal(true)
  }

  async function saveMinStocks() {
    for (const item of inventory) {
      const newMin = parseInt(minValues[item.key])
      if (!isNaN(newMin) && newMin !== item.min_stock) await onUpdateMinStock(item.key, newMin)
    }
    setMinModal(false)
  }

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-pink-50 rounded-xl">
              <Package size={18} className="text-pink-400" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-gray-700">Stok Bahan Baku</h2>
              <p className="text-xs text-gray-400">
                {criticalItems.length > 0 ? `${criticalItems.length} bahan kritis` : warningItems.length > 0 ? `${warningItems.length} bahan menipis` : 'Semua stok aman'}
              </p>
            </div>
          </div>
          <button onClick={openMinModal} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 border border-gray-200 hover:border-gray-300 rounded-xl px-3 py-1.5 transition-all">
            <Settings size={12} /> Atur Min
          </button>
        </div>

        {/* Critical alert */}
        {criticalItems.length > 0 && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle size={13} className="text-red-500" />
              <p className="text-xs font-bold text-red-600">Perlu dibeli segera:</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {criticalItems.map(item => (
                <span key={item.key} className="text-[11px] bg-red-100 text-red-700 border border-red-200 rounded-full px-2.5 py-1 font-semibold">
                  {item.label} · {item.stock} {item.unit}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2.5">
          {inventory.map(item => {
            const s       = getStatus(item.stock, item.min_stock)
            const pct     = Math.min(100, (item.stock / item.max_stock) * 100)
            const isEdit  = editingKey === item.key

            return (
              <div key={item.key} className={`p-3.5 rounded-2xl border transition-all ${s.bg} ${s.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-700">{item.label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.text} border ${s.border}`}>
                      {s.label}
                    </span>
                  </div>

                  {isEdit ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={editVal}
                        onChange={e => setEditVal(e.target.value)}
                        className="w-20 border-2 border-pink-300 rounded-xl px-2 py-1 text-sm text-center font-bold focus:outline-none focus:border-pink-400"
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(item); if (e.key === 'Escape') setEditingKey(null) }}
                        autoFocus
                      />
                      <span className="text-xs text-gray-400">{item.unit}</span>
                      <button onClick={() => saveEdit(item)} disabled={saving} className="p-1.5 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors">
                        <Check size={13} />
                      </button>
                      <button onClick={() => setEditingKey(null)} className="p-1.5 bg-gray-100 text-gray-400 hover:bg-gray-200 rounded-lg transition-colors">
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-gray-700">
                        {item.stock} <span className="text-xs font-normal text-gray-400">{item.unit}</span>
                      </span>
                      <button onClick={() => startEdit(item)} className="p-1.5 text-gray-300 hover:text-pink-400 hover:bg-white rounded-lg transition-colors">
                        <Edit2 size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Min: {item.min_stock} {item.unit}</p>
              </div>
            )
          })}
        </div>
      </Card>

      <Modal isOpen={minModal} onClose={() => setMinModal(false)} title="Atur Stok Minimum">
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {inventory.map(item => (
            <div key={item.key} className="flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-gray-600 flex-1">{item.label}</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={minValues[item.key] || ''}
                  onChange={e => setMinValues(p => ({ ...p, [item.key]: e.target.value }))}
                  className="w-20 border-2 border-pink-200 focus:border-pink-400 rounded-xl px-2 py-1.5 text-sm text-center font-bold focus:outline-none"
                />
                <span className="text-xs text-gray-400 w-10">{item.unit}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => setMinModal(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors">Batal</button>
          <button onClick={saveMinStocks} disabled={saving} className="flex-1 py-3 rounded-xl bg-pink-400 hover:bg-pink-500 text-white text-sm font-bold transition-colors disabled:opacity-60">Simpan</button>
        </div>
      </Modal>
    </>
  )
}
