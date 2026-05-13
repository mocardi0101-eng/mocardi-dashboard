'use client'

import { useState, useEffect } from 'react'
import { Delete } from 'lucide-react'
import { PIN } from '@/lib/constants'

const NUMPAD = ['1','2','3','4','5','6','7','8','9','','0','⌫']

const FLOATERS = [
  { emoji:'🍫', style:'top-[8%]  left-[10%] text-4xl', delay:'0s',    duration:'4s'  },
  { emoji:'🍪', style:'top-[12%] right-[8%] text-3xl', delay:'0.5s',  duration:'5s'  },
  { emoji:'🍵', style:'top-[30%] left-[5%]  text-2xl', delay:'1s',    duration:'3.5s'},
  { emoji:'✨', style:'top-[20%] right-[15%] text-xl', delay:'0.8s',  duration:'2.5s'},
  { emoji:'🎀', style:'bottom-[25%] left-[8%]  text-3xl', delay:'1.5s', duration:'4.5s'},
  { emoji:'💕', style:'bottom-[15%] right-[10%] text-2xl', delay:'0.3s', duration:'3.8s'},
  { emoji:'🌸', style:'top-[55%] right-[5%]  text-3xl', delay:'1.2s', duration:'4.2s'},
  { emoji:'⭐', style:'bottom-[35%] right-[20%] text-xl', delay:'0.7s', duration:'3s'  },
  { emoji:'🧁', style:'top-[70%] left-[15%] text-2xl', delay:'2s',    duration:'5.5s'},
]

export default function LoginScreen({ onLogin }) {
  const [digits,   setDigits]   = useState([])
  const [shake,    setShake]    = useState(false)
  const [logoErr,  setLogoErr]  = useState(false)
  const [success,  setSuccess]  = useState(false)

  useEffect(() => {
    if (digits.length === 4) {
      if (digits.join('') === PIN) {
        setSuccess(true)
        setTimeout(() => onLogin(), 500)
      } else {
        setShake(true)
        setTimeout(() => { setShake(false); setDigits([]) }, 600)
      }
    }
  }, [digits, onLogin])

  function press(key) {
    if (key === '')   return
    if (key === '⌫') { setDigits(p => p.slice(0, -1)); return }
    if (digits.length >= 4) return
    setDigits(p => [...p, key])
  }

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #FBEAF0 0%, #F4C0D1 50%, #FBEAF0 100%)' }}>

      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />

      {/* Floating emojis */}
      {FLOATERS.map((f, i) => (
        <div
          key={i}
          className={`absolute ${f.style} pointer-events-none select-none opacity-60`}
          style={{ animation: `float ${f.duration} ease-in-out infinite`, animationDelay: f.delay }}
        >
          {f.emoji}
        </div>
      ))}

      {/* Big blobs */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-pink-300 rounded-full opacity-30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-pink-400 rounded-full opacity-20 blur-3xl pointer-events-none" />

      {/* Card */}
      <div className={`relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-pink-200 p-8 w-full max-w-xs flex flex-col items-center gap-5 border border-pink-100 ${shake ? 'animate-shake' : ''} ${success ? 'animate-pop' : ''}`}>

        {/* Decoration dots */}
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-pink-400 rounded-full shadow-md" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-200 rounded-full" />

        {/* Logo */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-200 shadow-xl flex items-center justify-center bg-pink-50">
            {!logoErr ? (
              <img src="/logo.jpg" alt="Mocardi" className="w-full h-full object-cover" onError={() => setLogoErr(true)} />
            ) : (
              <span className="text-5xl font-display font-bold text-pink-400">M</span>
            )}
          </div>
          {/* Sparkle ring */}
          <div className="absolute -top-1 -right-1 text-lg animate-sparkle">✨</div>
        </div>

        {/* Title */}
        <div className="text-center -mt-1">
          <h1 className="text-3xl font-display font-bold text-pink-500">Mocardi</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Internal Dashboard</p>
          <p className="text-[10px] text-pink-300 mt-1 italic">"Delight in every bite" 🍰</p>
        </div>

        {/* PIN dots */}
        <div className="flex gap-3">
          {[0,1,2,3].map(i => (
            <div key={i} className={`transition-all duration-200 ${
              digits.length > i
                ? 'w-5 h-5 bg-pink-400 rounded-full scale-110 shadow-md shadow-pink-200'
                : 'w-5 h-5 border-2 border-pink-200 rounded-full bg-white'
            }`} />
          ))}
        </div>

        <p className="text-xs text-gray-400 font-semibold -mt-2">
          {success ? '✅ Masuk...' : 'Masukkan PIN'}
        </p>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2 w-full">
          {NUMPAD.map((key, i) => (
            key === '' ? <div key={i} /> : (
              <button
                key={i}
                onClick={() => press(key)}
                className={`h-14 rounded-2xl text-lg font-bold transition-all active:scale-90 select-none ${
                  key === '⌫'
                    ? 'bg-pink-50 text-pink-400 hover:bg-pink-100 border-2 border-pink-100'
                    : 'bg-gradient-to-b from-white to-pink-50 text-gray-700 hover:from-pink-50 hover:to-pink-100 border-2 border-pink-100 shadow-sm'
                }`}
              >
                {key === '⌫' ? <Delete size={18} className="mx-auto" /> : key}
              </button>
            )
          ))}
        </div>

        <p className="text-[10px] text-gray-300">PIN: 1234</p>
      </div>
    </div>
  )
}
