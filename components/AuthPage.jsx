'use client'

import { useState } from 'react'
import { ArrowLeft, Mail, User, Delete, Eye, EyeOff, Send } from 'lucide-react'

const NUMPAD = ['1','2','3','4','5','6','7','8','9','','0','⌫']

export default function AuthPage({ onBack, onLogin }) {
  const [tab,        setTab]        = useState('login')   // 'login' | 'register'
  const [logoErr,    setLogoErr]    = useState(false)

  // Register state
  const [regName,    setRegName]    = useState('')
  const [regEmail,   setRegEmail]   = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [regDone,    setRegDone]    = useState(false)
  const [regPin,     setRegPin]     = useState('')
  const [regError,   setRegError]   = useState('')

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginStep,  setLoginStep]  = useState('email')   // 'email' | 'pin'
  const [digits,     setDigits]     = useState([])
  const [shake,      setShake]      = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [resendDone, setResendDone] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  // ── Register ──────────────────────────────────────────────────────────────
  async function handleRegister(e) {
    e.preventDefault()
    setRegError('')
    setRegLoading(true)
    try {
      const res  = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail }),
      })
      const data = await res.json()
      if (!res.ok) { setRegError(data.error); return }
      setRegDone(true)
      if (data.pin) setRegPin(data.pin)
    } catch {
      setRegError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setRegLoading(false)
    }
  }

  // ── Login step 1: cek email ───────────────────────────────────────────────
  async function handleEmailSubmit(e) {
    e.preventDefault()
    setLoginError('')
    setLoginStep('pin')
  }

  // ── Login step 2: PIN numpad ──────────────────────────────────────────────
  async function pressPin(key) {
    if (key === '') return
    if (key === '⌫') { setDigits(p => p.slice(0, -1)); return }
    if (digits.length >= 6) return
    const next = [...digits, key]
    setDigits(next)

    if (next.length === 6) {
      setLoginLoading(true)
      setLoginError('')
      try {
        const res  = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loginEmail, pin: next.join('') }),
        })
        const data = await res.json()
        if (!res.ok) {
          setShake(true)
          setTimeout(() => { setShake(false); setDigits([]) }, 600)
          setLoginError(data.error || 'Email atau PIN salah')
        } else {
          onLogin(data.user)
        }
      } catch {
        setShake(true)
        setTimeout(() => { setShake(false); setDigits([]) }, 600)
        setLoginError('Terjadi kesalahan. Coba lagi.')
      } finally {
        setLoginLoading(false)
      }
    }
  }

  // ── Resend PIN ────────────────────────────────────────────────────────────
  async function handleResend() {
    setResendLoading(true)
    try {
      await fetch('/api/auth/resend-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail }),
      })
      setResendDone(true)
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FBEAF0 0%, #F4C0D1 50%, #FBEAF0 100%)' }}>
      <div className="absolute inset-0 dot-pattern opacity-25 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-pink-300 rounded-full opacity-30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-pink-400 rounded-full opacity-20 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Back button */}
        <button onClick={onBack} className="flex items-center gap-1.5 text-pink-400 hover:text-pink-600 text-sm font-bold mb-4 transition-colors">
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-pink-200 border border-pink-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-400 to-pink-500 px-6 py-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/40 flex items-center justify-center bg-white/20">
              {!logoErr
                ? <img src="/logo.jpg" alt="Mocardi" className="w-full h-full object-cover" onError={() => setLogoErr(true)} />
                : <span className="font-display font-bold text-white text-lg">M</span>
              }
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-lg leading-tight">Mocardi Dashboard</h1>
              <p className="text-pink-100 text-xs">"Delight in every bite" 🍰</p>
            </div>
          </div>

          <div className="p-6">
            {/* ── TABS ── */}
            {loginStep === 'email' && (
              <div className="flex bg-pink-50 rounded-2xl p-1 gap-1 mb-5">
                {[['login','Masuk'],['register','Daftar']].map(([val, label]) => (
                  <button key={val} onClick={() => { setTab(val); setLoginError(''); setRegError('') }}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${tab === val ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* ── REGISTER ── */}
            {tab === 'register' && loginStep === 'email' && (
              <>
                {regDone ? (
                  <div className="text-center py-2">
                    {regPin ? (
                      // Email gagal terkirim — tampilkan PIN di layar
                      <>
                        <div className="text-4xl mb-3">🔑</div>
                        <h3 className="font-display font-bold text-gray-700 text-lg mb-1">Akun berhasil dibuat!</h3>
                        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3 font-semibold">
                          ⚠️ Email gagal terkirim — catat PIN ini sekarang!
                        </p>
                        <div className="bg-pink-50 border-2 border-dashed border-pink-400 rounded-2xl p-4 mb-4">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">PIN kamu</p>
                          <p className="text-4xl font-black text-pink-500 tracking-widest">{regPin}</p>
                        </div>
                        <p className="text-xs text-gray-400 mb-4">Screenshot atau catat PIN ini — tidak akan ditampilkan lagi.</p>
                      </>
                    ) : (
                      // Email berhasil terkirim
                      <>
                        <div className="text-5xl mb-4 animate-bounce">📬</div>
                        <h3 className="font-display font-bold text-gray-700 text-lg mb-2">Cek email kamu!</h3>
                        <p className="text-sm text-gray-500 mb-1">PIN sudah dikirim ke</p>
                        <p className="font-bold text-pink-500 text-sm mb-2">{regEmail}</p>
                        <p className="text-xs text-gray-400 mb-4">Cek folder Spam jika tidak masuk ke inbox.</p>
                      </>
                    )}
                    <button onClick={() => { setTab('login'); setLoginEmail(regEmail); setRegDone(false); setRegPin('') }}
                      className="w-full py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold rounded-2xl text-sm">
                      Lanjut Login →
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">Nama</label>
                      <div className="relative">
                        <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input type="text" value={regName} onChange={e => setRegName(e.target.value)} required
                          placeholder="Nama lengkap kamu"
                          className="w-full pl-9 pr-3 py-3 border-2 border-pink-100 focus:border-pink-400 rounded-xl text-sm font-semibold focus:outline-none transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">Email</label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required
                          placeholder="email@gmail.com"
                          className="w-full pl-9 pr-3 py-3 border-2 border-pink-100 focus:border-pink-400 rounded-xl text-sm font-semibold focus:outline-none transition-colors" />
                      </div>
                    </div>
                    {regError && <p className="text-xs text-red-500 font-semibold bg-red-50 border border-red-200 rounded-xl px-3 py-2">{regError}</p>}
                    <button type="submit" disabled={regLoading}
                      className="w-full py-3.5 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-display font-bold rounded-2xl text-sm transition-all shadow-md shadow-pink-200 disabled:opacity-60 flex items-center justify-center gap-2">
                      {regLoading ? 'Mengirim...' : <><Send size={15} /> Kirim PIN ke Email</>}
                    </button>
                    <p className="text-[10px] text-center text-gray-400">PIN 6 digit akan dikirim ke email kamu</p>
                  </form>
                )}
              </>
            )}

            {/* ── LOGIN step 1: Email ── */}
            {tab === 'login' && loginStep === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required
                      placeholder="email@gmail.com" autoFocus
                      className="w-full pl-9 pr-3 py-3 border-2 border-pink-100 focus:border-pink-400 rounded-xl text-sm font-semibold focus:outline-none transition-colors" />
                  </div>
                </div>
                {loginError && <p className="text-xs text-red-500 font-semibold bg-red-50 border border-red-200 rounded-xl px-3 py-2">{loginError}</p>}
                <button type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-display font-bold rounded-2xl text-sm transition-all shadow-md shadow-pink-200">
                  Lanjut →
                </button>
              </form>
            )}

            {/* ── LOGIN step 2: PIN ── */}
            {tab === 'login' && loginStep === 'pin' && (
              <div className={shake ? 'animate-shake' : ''}>
                <button onClick={() => { setLoginStep('email'); setDigits([]); setLoginError('') }}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-pink-400 mb-4 font-semibold transition-colors">
                  <ArrowLeft size={13} /> {loginEmail}
                </button>

                <p className="text-sm font-bold text-gray-600 text-center mb-1">Masukkan PIN 6 digit</p>
                <p className="text-xs text-gray-400 text-center mb-4">PIN dikirim ke email kamu saat daftar</p>

                {/* PIN dots */}
                <div className="flex justify-center gap-2 mb-4">
                  {[0,1,2,3,4,5].map(i => (
                    <div key={i} className={`transition-all duration-150 ${digits.length > i
                      ? 'w-4 h-4 bg-pink-400 rounded-full scale-110 shadow-md shadow-pink-200'
                      : 'w-4 h-4 border-2 border-pink-200 rounded-full bg-white'}`} />
                  ))}
                </div>

                {loginError && <p className="text-xs text-red-500 font-semibold text-center mb-3">{loginError}</p>}

                {/* Numpad */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {NUMPAD.map((key, i) => (
                    key === '' ? <div key={i} /> : (
                      <button key={i} onClick={() => pressPin(key)} disabled={loginLoading}
                        className="h-12 rounded-2xl text-base font-bold transition-all active:scale-90 disabled:opacity-50 bg-gradient-to-b from-white to-pink-50 text-gray-700 hover:from-pink-50 hover:to-pink-100 border-2 border-pink-100 shadow-sm">
                        {key === '⌫' ? <Delete size={16} className="mx-auto" /> : key}
                      </button>
                    )
                  ))}
                </div>

                {/* Lupa PIN */}
                <div className="text-center">
                  {resendDone
                    ? <p className="text-xs text-green-600 font-semibold">✅ PIN baru sudah dikirim ke email!</p>
                    : <button onClick={handleResend} disabled={resendLoading}
                        className="text-xs text-pink-400 hover:text-pink-600 font-semibold transition-colors disabled:opacity-50">
                        {resendLoading ? 'Mengirim...' : 'Lupa PIN? Kirim ulang ke email'}
                      </button>
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
