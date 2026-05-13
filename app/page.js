'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, isConfigured } from '@/lib/supabase'
import { MENU } from '@/lib/constants'
import Header       from '@/components/Header'
import LoginScreen  from '@/components/LoginScreen'
import CapacityCard from '@/components/CapacityCard'
import TeamWellbeing from '@/components/TeamWellbeing'
import OrderManagement from '@/components/OrderManagement'
import KitchenFlow  from '@/components/KitchenFlow'
import InventoryCard from '@/components/InventoryCard'
import DailySummary from '@/components/DailySummary'
import ProductionEstimate from '@/components/ProductionEstimate'
import Confetti from '@/components/Confetti'

const AUTH_KEY = 'mocardi_auth'
const SESSION_TTL = 24 * 60 * 60 * 1000 // 24 jam

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`px-4 py-3 rounded-xl text-sm font-semibold shadow-xl text-white animate-fadeIn ${
          t.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`}>
          {t.msg}
        </div>
      ))}
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen bg-pink-50">
      <div className="h-16 bg-white border-b border-pink-100" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
      </div>
    </div>
  )
}

// ── Setup screen ──────────────────────────────────────────────────────────────
function SetupScreen() {
  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-pink-200 shadow-sm p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🍰</div>
        <h1 className="text-2xl font-black text-pink-500 mb-2">Mocardi Dashboard</h1>
        <p className="text-gray-500 text-sm mb-6">Perlu konfigurasi Supabase untuk memulai</p>
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 text-left text-xs font-mono text-gray-600 space-y-1">
          <p className="font-bold text-gray-700 mb-2">Buat file .env.local:</p>
          <p>NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co</p>
          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...</p>
        </div>
        <p className="text-xs text-gray-400 mt-4">Lalu restart dengan <code className="bg-gray-100 px-1 rounded">npm run dev</code></p>
      </div>
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [loggedIn,    setLoggedIn]    = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [orders,      setOrders]      = useState([])
  const [allOrders,   setAllOrders]   = useState([])
  const [inventory,   setInventory]   = useState([])
  const [maxCapacity, setMaxCapacity] = useState(50)
  const [confetti,    setConfetti]    = useState(0)
  const [mode,        setMode]        = useState('normal')
  const [saving,      setSaving]      = useState(false)
  const [loading,     setLoading]     = useState(true)
  const [toasts,      setToasts]      = useState([])
  const orderCounterRef = useRef(1)

  // ── Auth check on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY)
    if (stored) {
      const { ts } = JSON.parse(stored)
      if (Date.now() - ts < SESSION_TTL) setLoggedIn(true)
      else localStorage.removeItem(AUTH_KEY)
    }
    setAuthChecked(true)
  }, [])

  const showToast = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])

  const loadAll = useCallback(async () => {
    try {
      const [oRes, iRes, sRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: true }),
        supabase.from('inventory').select('*').order('label'),
        supabase.from('settings').select('*'),
      ])
      if (oRes.error) throw oRes.error
      if (iRes.error) throw iRes.error
      if (sRes.error) throw sRes.error

      const allO = oRes.data || []
      setAllOrders(allO)
      setOrders(allO.filter(o => o.status === 'active'))
      setInventory(iRes.data || [])

      const map = {}
      ;(sRes.data || []).forEach(s => { map[s.key] = s.value })
      if (map.max_capacity) setMaxCapacity(parseInt(map.max_capacity))
      if (map.mode)         setMode(map.mode)

      const maxNum = allO.reduce((m, o) => Math.max(m, o.order_number || 0), 0)
      orderCounterRef.current = maxNum + 1
    } catch (e) {
      showToast('Gagal memuat data: ' + e.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { if (loggedIn) loadAll() }, [loggedIn, loadAll])

  // ── Realtime
  useEffect(() => {
    if (!loggedIn) return
    const ch1 = supabase.channel('orders-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, loadAll)
      .subscribe()
    const ch2 = supabase.channel('inventory-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () =>
        supabase.from('inventory').select('*').order('label').then(({ data }) => { if (data) setInventory(data) })
      ).subscribe()
    return () => { supabase.removeChannel(ch1); supabase.removeChannel(ch2) }
  }, [loggedIn, loadAll])

  // ── Handlers
  async function handleAddOrder({ items_text, summary, total, items }) {
    const num = orderCounterRef.current
    const tmp = { id: `tmp-${Date.now()}`, order_number: num, items_text, summary, total, status: 'active', created_at: new Date().toISOString() }
    setOrders(p => [...p, tmp]); setAllOrders(p => [...p, tmp])
    orderCounterRef.current += 1; setSaving(true)
    try {
      const { data: od, error: oe } = await supabase.from('orders').insert([{ order_number: num, items_text, summary, total, status: 'active' }]).select().single()
      if (oe) throw oe

      const stockUpdates = {}
      for (const item of items) {
        const m = MENU.find(x => x.id === item.id)
        if (!m) continue
        for (const [k, amt] of Object.entries(m.ingredients)) stockUpdates[k] = (stockUpdates[k] || 0) + amt * item.qty
      }
      const snap = [...inventory]
      setInventory(snap.map(inv => ({ ...inv, stock: Math.max(0, inv.stock - (stockUpdates[inv.key] || 0)) })))
      await Promise.all(Object.entries(stockUpdates).map(([k, used]) => {
        const inv = snap.find(i => i.key === k)
        if (!inv) return Promise.resolve()
        return supabase.from('inventory').update({ stock: Math.max(0, inv.stock - used), updated_at: new Date().toISOString() }).eq('key', k)
      }))
      setOrders(p => p.map(o => o.id === tmp.id ? od : o))
      setAllOrders(p => p.map(o => o.id === tmp.id ? od : o))
      setConfetti(c => c + 1)
      showToast(`Order #${num} berhasil ditambahkan!`)
    } catch (e) {
      setOrders(p => p.filter(o => o.id !== tmp.id)); setAllOrders(p => p.filter(o => o.id !== tmp.id))
      orderCounterRef.current -= 1; showToast('Gagal menyimpan: ' + e.message, 'error')
    } finally { setSaving(false) }
  }

  async function handleCompleteOrder(id) {
    setOrders(p => p.filter(o => o.id !== id))
    setAllOrders(p => p.map(o => o.id === id ? { ...o, status: 'done' } : o))
    setSaving(true)
    try {
      const { error } = await supabase.from('orders').update({ status: 'done', completed_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error; showToast('Order selesai!')
    } catch (e) { loadAll(); showToast('Gagal: ' + e.message, 'error') }
    finally { setSaving(false) }
  }

  async function handleUpdateCapacity(val) {
    setMaxCapacity(val); setSaving(true)
    try {
      const { error } = await supabase.from('settings').update({ value: String(val), updated_at: new Date().toISOString() }).eq('key', 'max_capacity')
      if (error) throw error; showToast('Kapasitas diperbarui!')
    } catch (e) { showToast('Gagal: ' + e.message, 'error') }
    finally { setSaving(false) }
  }

  async function handleToggleMode() {
    const next = mode === 'utsuas' ? 'normal' : 'utsuas'
    setMode(next); setSaving(true)
    try {
      const { error } = await supabase.from('settings').update({ value: next, updated_at: new Date().toISOString() }).eq('key', 'mode')
      if (error) throw error; showToast(next === 'utsuas' ? 'Mode UTS/UAS aktif' : 'Mode Normal aktif')
    } catch (e) { setMode(mode); showToast('Gagal: ' + e.message, 'error') }
    finally { setSaving(false) }
  }

  async function handleUpdateStock(key, stock) {
    setInventory(p => p.map(i => i.key === key ? { ...i, stock } : i)); setSaving(true)
    try {
      const { error } = await supabase.from('inventory').update({ stock, updated_at: new Date().toISOString() }).eq('key', key)
      if (error) throw error; showToast('Stok diperbarui!')
    } catch (e) { loadAll(); showToast('Gagal: ' + e.message, 'error') }
    finally { setSaving(false) }
  }

  async function handleUpdateMinStock(key, min_stock) {
    setInventory(p => p.map(i => i.key === key ? { ...i, min_stock } : i)); setSaving(true)
    try {
      const { error } = await supabase.from('inventory').update({ min_stock, updated_at: new Date().toISOString() }).eq('key', key)
      if (error) throw error
    } catch (e) { loadAll(); showToast('Gagal: ' + e.message, 'error') }
    finally { setSaving(false) }
  }

  async function handleResetDay() {
    setOrders([]); setAllOrders([]); setSaving(true)
    try {
      const { error } = await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (error) throw error; orderCounterRef.current = 1; showToast('Hari baru dimulai!')
    } catch (e) { loadAll(); showToast('Gagal: ' + e.message, 'error') }
    finally { setSaving(false) }
  }

  function handleLogin()  { localStorage.setItem(AUTH_KEY, JSON.stringify({ ts: Date.now() })); setLoggedIn(true) }
  function handleLogout() { localStorage.removeItem(AUTH_KEY); setLoggedIn(false); setLoading(true) }

  if (!isConfigured)  return <SetupScreen />
  if (!authChecked)   return null
  if (!loggedIn)      return <LoginScreen onLogin={handleLogin} />
  if (loading)        return <Skeleton />

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #FBEAF0 0%, #fff 40%, #FBEAF0 100%)' }}>
      <Header saving={saving} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 animate-fadeIn">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <CapacityCard
            maxCapacity={maxCapacity} activeOrders={orders.length}
            mode={mode} onUpdateCapacity={handleUpdateCapacity} saving={saving}
          />
          <TeamWellbeing mode={mode} onToggleMode={handleToggleMode} />

          <div className="col-span-1 sm:col-span-2">
            <OrderManagement orders={orders} onAddOrder={handleAddOrder} onCompleteOrder={handleCompleteOrder} saving={saving} />
          </div>

          <KitchenFlow />
          <ProductionEstimate inventory={inventory} />

          <div className="col-span-1 sm:col-span-2">
            <InventoryCard inventory={inventory} onUpdateStock={handleUpdateStock} onUpdateMinStock={handleUpdateMinStock} saving={saving} />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <DailySummary orders={orders} allOrders={allOrders} inventory={inventory} maxCapacity={maxCapacity} mode={mode} onResetDay={handleResetDay} saving={saving} />
          </div>

        </div>
      </main>

      <Toast toasts={toasts} />
      <Confetti trigger={confetti} />
    </div>
  )
}
