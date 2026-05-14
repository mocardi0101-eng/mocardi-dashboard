'use client'

import { useState } from 'react'
import { ArrowRight, ShoppingBag, Package, BarChart3, ChefHat } from 'lucide-react'

const FLOATERS = [
  { e:'🍫', s:'top-[8%]  left-[8%]',  d:'4s',   delay:'0s'   },
  { e:'🍪', s:'top-[12%] right-[6%]', d:'5s',   delay:'0.5s' },
  { e:'🍵', s:'top-[35%] left-[4%]',  d:'3.5s', delay:'1s'   },
  { e:'✨', s:'top-[20%] right-[14%]',d:'2.5s', delay:'0.8s' },
  { e:'🎀', s:'bottom-[28%] left-[6%]', d:'4.5s', delay:'1.5s'},
  { e:'💕', s:'bottom-[18%] right-[8%]',d:'3.8s', delay:'0.3s'},
  { e:'🌸', s:'top-[55%] right-[4%]', d:'4.2s', delay:'1.2s' },
  { e:'⭐', s:'top-[68%] left-[12%]', d:'3s',   delay:'0.7s' },
]

const FEATURES = [
  { icon: ShoppingBag, title: 'Order Management',    desc: 'Input order dalam hitungan detik, antrian otomatis terkelola',  color: 'bg-pink-50  text-pink-400'   },
  { icon: Package,     title: 'Stok Otomatis',       desc: 'Bahan baku berkurang sendiri setiap order dikonfirmasi',        color: 'bg-amber-50 text-amber-500'  },
  { icon: ChefHat,     title: 'Kitchen Flow',        desc: 'Checklist produksi step-by-step biar nggak ada yang kelewat',   color: 'bg-green-50 text-green-500'  },
  { icon: BarChart3,   title: 'Rekap Harian',        desc: 'Download laporan PDF otomatis, revenue & profit langsung keliatan', color: 'bg-blue-50 text-blue-400' },
]

export default function LandingPage({ onGetStarted }) {
  const [logoErr, setLogoErr] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ background: 'linear-gradient(160deg, #FBEAF0 0%, #fff 50%, #FBEAF0 100%)' }}>
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />

      {/* Floating emojis */}
      {FLOATERS.map((f, i) => (
        <div key={i} className={`absolute ${f.s} text-3xl pointer-events-none select-none opacity-50 hidden sm:block`}
          style={{ animation: `float ${f.d} ease-in-out infinite`, animationDelay: f.delay }}>
          {f.e}
        </div>
      ))}

      {/* Navbar */}
      <nav className="relative z-10 max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-pink-200 shadow flex items-center justify-center bg-pink-50">
            {!logoErr
              ? <img src="/logo.jpg" alt="Mocardi" className="w-full h-full object-cover" onError={() => setLogoErr(true)} />
              : <span className="font-display font-bold text-pink-400 text-lg">M</span>
            }
          </div>
          <span className="font-display font-bold text-pink-500 text-xl">Mocardi</span>
        </div>
        <button
          onClick={onGetStarted}
          className="text-sm font-bold text-pink-500 border-2 border-pink-300 hover:bg-pink-50 px-4 py-2 rounded-xl transition-all"
        >
          Masuk
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 text-xs font-bold px-3 py-1.5 rounded-full mb-6 border border-pink-200">
          ✨ Internal Dashboard untuk Tim Mocardi
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-bold text-gray-800 leading-tight mb-5">
          Operasional bisnis<br />
          <span className="text-pink-500">lebih simpel,</span> lebih&nbsp;rapi
        </h1>
        <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          Dashboard internal Mocardi — kelola order, stok bahan, produksi, dan rekap harian dari satu tempat. Bisa diakses dari HP manapun, sync realtime.
        </p>
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-display font-bold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-pink-200 transition-all active:scale-95"
        >
          Mulai Sekarang <ArrowRight size={20} />
        </button>
        <p className="text-xs text-gray-400 mt-3">Gratis · Tidak perlu install · Langsung bisa dipakai</p>
      </section>

      {/* Features grid */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Fitur Utama</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-white rounded-2xl border border-pink-100 shadow-sm p-4 card-lift">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${f.color}`}>
                <f.icon size={18} />
              </div>
              <p className="text-sm font-bold text-gray-700 leading-tight mb-1">{f.title}</p>
              <p className="text-xs text-gray-400 leading-snug">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-16 text-center">
        <div className="bg-gradient-to-r from-pink-400 to-pink-500 rounded-3xl p-8 shadow-xl shadow-pink-200">
          <p className="text-3xl mb-2">🍰</p>
          <h2 className="font-display font-bold text-white text-2xl mb-2">Siap mulai hari ini?</h2>
          <p className="text-pink-100 text-sm mb-5">"Delight in every bite" — dan setiap order terkelola dengan baik</p>
          <button
            onClick={onGetStarted}
            className="bg-white text-pink-500 font-display font-bold px-6 py-3 rounded-2xl hover:bg-pink-50 transition-all shadow-md active:scale-95"
          >
            Daftar Sekarang →
          </button>
        </div>
      </section>
    </div>
  )
}
