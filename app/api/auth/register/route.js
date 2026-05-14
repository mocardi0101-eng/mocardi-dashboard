import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { Resend } from 'resend'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

function generatePin() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function hashPin(pin) {
  return createHash('sha256').update(pin + process.env.PIN_SALT || 'mocardi-salt').digest('hex')
}

export async function POST(request) {
  const { name, email } = await request.json()

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Nama dan email wajib diisi' }, { status: 400 })
  }

  const supabase = getSupabase()

  // Cek apakah email sudah terdaftar
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Email sudah terdaftar. Silakan login.' }, { status: 409 })
  }

  const pin = generatePin()
  const pin_hash = hashPin(pin)

  const { error } = await supabase
    .from('users')
    .insert([{ name: name.trim(), email: email.toLowerCase().trim(), pin_hash }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Kirim email PIN via Resend
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Mocardi <onboarding@resend.dev>',
      to: email,
      subject: '🍰 PIN Dashboard Mocardi kamu',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin:0;padding:0;background:#FBEAF0;font-family:'Helvetica Neue',Arial,sans-serif;">
          <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(212,83,126,0.12);">
            <div style="background:linear-gradient(135deg,#D4537E,#ED93B1);padding:32px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:32px;font-weight:900;letter-spacing:-0.5px;">Mocardi 🍰</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;font-style:italic;">"Delight in every bite"</p>
            </div>
            <div style="padding:32px;">
              <p style="color:#374151;font-size:15px;margin:0 0 8px;">Halo, <strong>${name}</strong>! 👋</p>
              <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Akun dashboard Mocardi kamu sudah berhasil dibuat. Ini PIN untuk login:</p>
              <div style="background:#FBEAF0;border:2px dashed #D4537E;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
                <p style="margin:0 0 4px;color:#9ca3af;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">PIN kamu</p>
                <p style="margin:0;color:#D4537E;font-size:42px;font-weight:900;letter-spacing:10px;">${pin}</p>
              </div>
              <p style="color:#9ca3af;font-size:12px;margin:0 0 4px;">⚠️ Simpan PIN ini baik-baik ya — jangan share ke orang lain.</p>
              <p style="color:#9ca3af;font-size:12px;margin:0;">Kalau lupa, kamu bisa request kirim ulang PIN dari halaman login.</p>
            </div>
            <div style="background:#FBEAF0;padding:16px;text-align:center;">
              <p style="margin:0;color:#d1b3be;font-size:11px;">Mocardi Internal Dashboard · mocardi.vercel.app</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })
  } catch (e) {
    // Kalau email gagal, hapus user yang baru dibuat
    await supabase.from('users').delete().eq('email', email.toLowerCase().trim())
    return NextResponse.json({ error: 'Gagal mengirim email. Coba lagi.' }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'PIN sudah dikirim ke email kamu!' }, { status: 201 })
}
