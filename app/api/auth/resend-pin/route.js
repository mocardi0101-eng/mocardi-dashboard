import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createHash, randomBytes } from 'crypto'
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
  const { email } = await request.json()
  if (!email?.trim()) return NextResponse.json({ error: 'Email wajib diisi' }, { status: 400 })

  const supabase = getSupabase()

  const { data: user } = await supabase
    .from('users')
    .select('id, name')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (!user) return NextResponse.json({ error: 'Email tidak terdaftar' }, { status: 404 })

  const pin = generatePin()
  const pin_hash = hashPin(pin)

  await supabase.from('users').update({ pin_hash }).eq('email', email.toLowerCase().trim())

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Mocardi <onboarding@resend.dev>',
      to: email,
      subject: '🔑 PIN Baru Dashboard Mocardi',
      html: `
        <!DOCTYPE html><html><body style="margin:0;padding:0;background:#FBEAF0;font-family:'Helvetica Neue',Arial,sans-serif;">
          <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(212,83,126,0.12);">
            <div style="background:linear-gradient(135deg,#D4537E,#ED93B1);padding:32px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:32px;font-weight:900;">Mocardi 🍰</h1>
            </div>
            <div style="padding:32px;">
              <p style="color:#374151;font-size:15px;margin:0 0 8px;">Halo, <strong>${user.name}</strong>!</p>
              <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Ini PIN baru kamu (PIN lama sudah tidak berlaku):</p>
              <div style="background:#FBEAF0;border:2px dashed #D4537E;border-radius:16px;padding:24px;text-align:center;margin-bottom:16px;">
                <p style="margin:0 0 4px;color:#9ca3af;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">PIN Baru</p>
                <p style="margin:0;color:#D4537E;font-size:42px;font-weight:900;letter-spacing:10px;">${pin}</p>
              </div>
            </div>
          </div>
        </body></html>
      `,
    })
  } catch (e) {
    return NextResponse.json({ error: 'Gagal mengirim email' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
