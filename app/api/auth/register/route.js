import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { sendPinEmail } from '@/lib/mailer'

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
  return createHash('sha256').update(pin + (process.env.PIN_SALT || 'mocardi-salt')).digest('hex')
}

export async function POST(request) {
  const { name, email } = await request.json()

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Nama dan email wajib diisi' }, { status: 400 })
  }

  const supabase = getSupabase()

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Email sudah terdaftar. Silakan login.' }, { status: 409 })
  }

  const pin      = generatePin()
  const pin_hash = hashPin(pin)

  const { error } = await supabase
    .from('users')
    .insert([{ name: name.trim(), email: email.toLowerCase().trim(), pin_hash }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let emailSent = false
  try {
    await sendPinEmail({ to: email, name: name.trim(), pin })
    emailSent = true
  } catch (e) {
    console.error('Email error:', e.message)
  }

  return NextResponse.json({
    success: true,
    emailSent,
    pin: emailSent ? undefined : pin,
    message: emailSent
      ? 'PIN sudah dikirim ke email kamu!'
      : 'Akun berhasil dibuat! Email tidak terkirim — catat PIN ini sekarang.',
  }, { status: 201 })
}
