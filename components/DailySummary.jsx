'use client'

import { useState } from 'react'
import { BarChart3, Download, RefreshCw, AlertTriangle, TrendingUp, DollarSign, ShoppingBag, FileText } from 'lucide-react'
import Card from './ui/Card'
import { formatRupiah, formatDateID } from '@/lib/constants'

export default function DailySummary({ orders, allOrders, inventory, maxCapacity, mode, onResetDay, saving }) {
  const [confirmReset, setConfirmReset] = useState(false)

  const effectiveMax  = mode === 'utsuas' ? Math.floor(maxCapacity * 0.6) : maxCapacity
  const totalOrders   = allOrders.length
  const revenue       = allOrders.reduce((s, o) => s + o.total, 0)
  const profit        = Math.round(revenue * 0.4)
  const pct           = effectiveMax > 0 ? (orders.length / effectiveMax) * 100 : 0

  const criticalStock = inventory.filter(i => i.stock <= i.min_stock)
  const warningStock  = inventory.filter(i => i.stock > i.min_stock && i.stock <= i.min_stock * 1.5)

  const alerts = [
    pct >= 90 && { type: 'danger',  msg: `Kapasitas hampir penuh! ${orders.length}/${effectiveMax} (${Math.round(pct)}%)` },
    pct >= 70 && pct < 90 && { type: 'warning', msg: `Kapasitas mencapai ${Math.round(pct)}% — pantau terus` },
    effectiveMax - orders.length <= 5 && effectiveMax - orders.length > 0 && { type: 'warning', msg: `Hanya tersisa ${effectiveMax - orders.length} slot order hari ini!` },
    ...criticalStock.map(i => ({ type: 'danger',  msg: `Stok ${i.label} kritis: ${i.stock} ${i.unit}` })),
    ...warningStock.map(i => ({ type: 'warning', msg: `Stok ${i.label} mulai menipis: ${i.stock} ${i.unit}` })),
  ].filter(Boolean)

  function downloadTxt() {
    const lines = [
      '============================================',
      '        REKAP HARIAN MOCARDI',
      `        ${formatDateID()}`,
      '     "Delight in every bite"',
      '============================================',
      '',
      '--- RINGKASAN PENJUALAN ---',
      `Total Order    : ${totalOrders}`,
      `Total Revenue  : ${formatRupiah(revenue)}`,
      `Est. Profit    : ${formatRupiah(profit)} (40%)`,
      '',
      '--- ORDER AKTIF ---',
      ...orders.map((o, i) => `${i + 1}. #${o.order_number} ${o.items_text} — ${formatRupiah(o.total)}`),
      orders.length === 0 ? '(tidak ada order aktif)' : '',
      '',
      '--- STATUS STOK ---',
      ...inventory.map(i => {
        const st = i.stock <= i.min_stock ? 'KRITIS' : i.stock <= i.min_stock * 1.5 ? 'MENIPIS' : 'AMAN'
        return `${i.label.padEnd(16)}: ${String(i.stock).padStart(5)} ${i.unit.padEnd(5)} [${st}]`
      }),
      '',
      '--- PERLU DIBELI ---',
      ...criticalStock.map(i => `- ${i.label}: tambah minimal ${i.min_stock * 3 - i.stock} ${i.unit}`),
      criticalStock.length === 0 ? '(tidak ada)' : '',
      '',
      '============================================',
      `Dicetak: ${new Date().toLocaleString('id-ID')}`,
      '============================================',
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `mocardi-rekap-${new Date().toISOString().slice(0,10)}.txt`
    a.click(); URL.revokeObjectURL(url)
  }

  function downloadPdf() {
    const date = formatDateID()
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <title>Rekap Harian Mocardi — ${date}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1f2937; background: #fff; padding: 32px; }
          .header { text-align: center; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 3px solid #D4537E; }
          .logo { font-size: 28px; font-weight: 900; color: #D4537E; letter-spacing: -0.5px; }
          .tagline { font-size: 12px; color: #9ca3af; margin-top: 2px; font-style: italic; }
          .date { font-size: 13px; color: #6b7280; margin-top: 6px; font-weight: 600; }
          .section { margin-bottom: 22px; }
          .section-title { font-size: 11px; font-weight: 800; color: #D4537E; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; padding-bottom: 4px; border-bottom: 1px solid #F4C0D1; }
          .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 22px; }
          .metric-card { background: #FBEAF0; border-radius: 12px; padding: 14px; text-align: center; }
          .metric-value { font-size: 18px; font-weight: 900; color: #D4537E; }
          .metric-value.green { color: #639922; }
          .metric-value.dark  { color: #1f2937; }
          .metric-label { font-size: 10px; color: #9ca3af; margin-top: 3px; font-weight: 600; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { background: #FBEAF0; color: #D4537E; font-weight: 800; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 10px; text-align: left; }
          td { padding: 8px 10px; border-bottom: 1px solid #f3f4f6; }
          tr:last-child td { border-bottom: none; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 700; }
          .badge-danger  { background: #fee2e2; color: #dc2626; }
          .badge-warning { background: #fef3c7; color: #d97706; }
          .badge-ok      { background: #dcfce7; color: #16a34a; }
          .order-row td:last-child { font-weight: 700; color: #D4537E; text-align: right; }
          .empty { color: #9ca3af; font-style: italic; font-size: 12px; padding: 8px 0; }
          .footer { margin-top: 28px; padding-top: 14px; border-top: 1px solid #f3f4f6; text-align: center; font-size: 10px; color: #9ca3af; }
          @media print {
            body { padding: 20px; }
            @page { margin: 1cm; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Mocardi</div>
          <div class="tagline">"Delight in every bite"</div>
          <div class="date">Rekap Harian — ${date}</div>
        </div>

        <div class="metrics">
          <div class="metric-card">
            <div class="metric-value">${totalOrders}</div>
            <div class="metric-label">Total Order</div>
          </div>
          <div class="metric-card">
            <div class="metric-value dark" style="font-size:14px">${formatRupiah(revenue)}</div>
            <div class="metric-label">Total Revenue</div>
          </div>
          <div class="metric-card">
            <div class="metric-value green" style="font-size:14px">${formatRupiah(profit)}</div>
            <div class="metric-label">Est. Profit (40%)</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Order Aktif</div>
          ${orders.length === 0
            ? '<p class="empty">Tidak ada order aktif</p>'
            : `<table>
                <thead><tr><th>#</th><th>Item</th><th>Total</th></tr></thead>
                <tbody>
                  ${orders.map(o => `
                    <tr class="order-row">
                      <td><strong>#${o.order_number}</strong></td>
                      <td>${o.items_text}</td>
                      <td>${formatRupiah(o.total)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>`
          }
        </div>

        <div class="section">
          <div class="section-title">Status Stok Bahan</div>
          <table>
            <thead><tr><th>Bahan</th><th>Stok</th><th>Min</th><th>Status</th></tr></thead>
            <tbody>
              ${inventory.map(i => {
                const isCritical = i.stock <= i.min_stock
                const isWarning  = i.stock > i.min_stock && i.stock <= i.min_stock * 1.5
                const badge = isCritical
                  ? '<span class="badge badge-danger">Kritis</span>'
                  : isWarning
                    ? '<span class="badge badge-warning">Menipis</span>'
                    : '<span class="badge badge-ok">Aman</span>'
                return `<tr>
                  <td><strong>${i.label}</strong></td>
                  <td>${i.stock} ${i.unit}</td>
                  <td>${i.min_stock} ${i.unit}</td>
                  <td>${badge}</td>
                </tr>`
              }).join('')}
            </tbody>
          </table>
        </div>

        ${criticalStock.length > 0 ? `
        <div class="section">
          <div class="section-title">Perlu Dibeli Segera</div>
          <table>
            <thead><tr><th>Bahan</th><th>Tambah Minimal</th></tr></thead>
            <tbody>
              ${criticalStock.map(i => `
                <tr>
                  <td><strong>${i.label}</strong></td>
                  <td>${i.min_stock * 3 - i.stock} ${i.unit}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>` : ''}

        <div class="footer">
          Dicetak: ${new Date().toLocaleString('id-ID')} · Mocardi Internal Dashboard
        </div>

        <script>window.onload = () => { window.print(); }</script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  const metrics = [
    { label: 'Total Order', value: String(totalOrders), icon: ShoppingBag, color: 'text-pink-500', bg: 'bg-pink-50' },
    { label: 'Revenue',     value: formatRupiah(revenue), icon: DollarSign, color: 'text-gray-800', bg: 'bg-gray-50' },
    { label: 'Est. Profit', value: formatRupiah(profit),  icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  return (
    <Card>
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2.5 bg-pink-50 rounded-xl">
          <BarChart3 size={18} className="text-pink-400" />
        </div>
        <h2 className="text-lg font-display font-bold text-gray-700">Ringkasan Harian</h2>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {metrics.map(m => (
          <div key={m.label} className={`${m.bg} rounded-2xl p-4 text-center`}>
            <m.icon size={16} className={`${m.color} mx-auto mb-2 opacity-70`} />
            <p className={`text-lg font-black ${m.color} leading-tight`}>{m.value}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {alerts.length > 0 && (
        <div className="mb-5 space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle size={11} /> Smart Alerts ({alerts.length})
          </p>
          {alerts.map((alert, i) => (
            <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl text-xs font-medium border ${
              alert.type === 'danger' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
              <AlertTriangle size={11} className="flex-shrink-0 mt-0.5" />
              {alert.msg}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={downloadPdf}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-pink-200"
        >
          <FileText size={14} /> Download PDF
        </button>

        <button
          onClick={downloadTxt}
          className="flex items-center gap-2 text-sm font-semibold text-gray-400 border border-gray-200 hover:border-pink-200 hover:text-pink-400 hover:bg-pink-50 px-5 py-3 rounded-xl transition-all"
        >
          <Download size={14} /> TXT
        </button>

        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-400 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-5 py-3 rounded-xl transition-all"
          >
            <RefreshCw size={14} /> Reset Hari Baru
          </button>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl flex-wrap">
            <p className="text-xs text-red-600 font-semibold">Yakin hapus semua order?</p>
            <button onClick={async () => { await onResetDay(); setConfirmReset(false) }} disabled={saving} className="text-xs bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
              Ya, Reset
            </button>
            <button onClick={() => setConfirmReset(false)} className="text-xs text-gray-500 hover:text-gray-700 font-semibold">
              Batal
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}
