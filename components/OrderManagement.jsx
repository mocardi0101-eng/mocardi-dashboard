'use client'

import { useState } from 'react'
import { Plus, Check, ChevronUp, Minus, ShoppingBag } from 'lucide-react'
import Card from './ui/Card'
import { MENU, formatRupiah } from '@/lib/constants'

export default function OrderManagement({ orders, onAddOrder, onCompleteOrder, saving }) {
  const [showForm,    setShowForm]    = useState(false)
  const [quantities,  setQuantities]  = useState({})

  const total     = Object.entries(quantities).reduce((s, [id, qty]) => {
    const item = MENU.find(m => m.id === Number(id))
    return s + (item ? item.price * qty : 0)
  }, 0)
  const itemCount = Object.values(quantities).reduce((a, b) => a + b, 0)

  function adjust(id, delta) {
    setQuantities(prev => {
      const next = (prev[id] || 0) + delta
      if (next <= 0) { const { [id]: _, ...rest } = prev; return rest }
      return { ...prev, [id]: next }
    })
  }

  async function handleConfirm() {
    if (itemCount === 0) return
    const items = Object.entries(quantities).filter(([, q]) => q > 0).map(([id, qty]) => ({ ...MENU.find(m => m.id === Number(id)), qty }))
    const items_text = items.map(i => `${i.emoji} ${i.name} x${i.qty}`).join(', ')
    const summary    = items.map(i => `${i.name} x${i.qty}`).join(', ')
    await onAddOrder({ items_text, summary, total, items })
    setQuantities({})
    setShowForm(false)
  }

  return (
    <Card accent="bg-gradient-to-r from-pink-300 via-pink-400 to-pink-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-pink-50 rounded-2xl">
            <ShoppingBag size={18} className="text-pink-400" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-gray-700">Manajemen Order</h2>
            <p className="text-xs text-gray-400 font-semibold">{orders.length} order aktif</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white text-sm font-bold px-4 py-2.5 rounded-2xl transition-all shadow-md shadow-pink-200 active:scale-95"
        >
          {showForm ? <ChevronUp size={15} /> : <Plus size={15} />}
          {showForm ? 'Tutup' : '+ New Order'}
        </button>
      </div>

      {showForm && (
        <div className="mb-5 p-4 bg-pink-50/80 border-2 border-pink-100 rounded-3xl animate-fadeInUp">
          <p className="text-sm font-display font-bold text-gray-600 mb-3">✨ Pilih Menu</p>
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {MENU.map(item => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border-2 p-3 transition-all cursor-pointer ${
                  quantities[item.id] > 0 ? 'border-pink-400 shadow-md shadow-pink-100' : 'border-pink-100 hover:border-pink-300'
                }`}
                onClick={() => adjust(item.id, 1)}
              >
                <div className="text-3xl mb-1.5 text-center">{item.emoji}</div>
                <p className="text-xs font-bold text-gray-700 text-center leading-tight mb-1">{item.name}</p>
                <p className="text-[10px] text-pink-400 font-bold text-center">{formatRupiah(item.price)}</p>

                {quantities[item.id] > 0 && (
                  <div className="flex items-center justify-center gap-1.5 mt-2" onClick={e => e.stopPropagation()}>
                    <button onClick={() => adjust(item.id, -1)} className="w-6 h-6 flex items-center justify-center rounded-lg border border-pink-200 text-pink-400 hover:bg-pink-50 text-sm font-bold transition-colors">
                      <Minus size={10} />
                    </button>
                    <span className="text-sm font-black text-pink-500 w-5 text-center">{quantities[item.id]}</span>
                    <button onClick={() => adjust(item.id, 1)} className="w-6 h-6 flex items-center justify-center rounded-lg bg-pink-400 hover:bg-pink-500 text-white transition-colors">
                      <Plus size={10} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {itemCount > 0 && (
            <div className="flex items-center justify-between p-3 bg-white rounded-2xl border-2 border-pink-200 mb-3 animate-pop">
              <span className="text-sm text-gray-500 font-semibold">🛒 {itemCount} item</span>
              <span className="text-base font-black text-pink-500">{formatRupiah(total)}</span>
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={itemCount === 0 || saving}
            className="w-full py-3.5 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 disabled:opacity-40 text-white font-display font-bold text-base rounded-2xl transition-all shadow-md shadow-pink-200 active:scale-98"
          >
            🎉 Konfirmasi Order — {formatRupiah(total)}
          </button>
        </div>
      )}

      <div className="space-y-2.5">
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-3 animate-float">🛍️</div>
            <p className="text-sm font-semibold text-gray-300">Belum ada order aktif</p>
            <p className="text-xs text-gray-200 mt-1">Tap "+ New Order" untuk mulai</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="flex items-center gap-3 p-3.5 bg-pink-50/60 border-2 border-pink-100 rounded-2xl hover:border-pink-200 transition-all">
              <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-pink-400 to-pink-500 text-white rounded-xl flex items-center justify-center font-display font-bold text-sm shadow-sm">
                {order.order_number}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-700 truncate">{order.items_text}</p>
                <p className="text-xs text-pink-400 font-bold">{formatRupiah(order.total)}</p>
              </div>
              <button
                onClick={() => onCompleteOrder(order.id)}
                disabled={saving}
                className="flex-shrink-0 flex items-center gap-1.5 text-xs text-green-600 border-2 border-green-200 bg-green-50 hover:bg-green-100 font-bold px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
              >
                <Check size={12} /> Selesai
              </button>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
