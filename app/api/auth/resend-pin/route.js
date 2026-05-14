import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { sendNewPinEmail } from '@/lib/mailer'

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
  const { email } = await request.json()
  if (!email?.trim()) return NextResponse.json({ error: 'Email wajib diisi' }, { status: 400 })

  const supabase = getSupabase()

  const { data: user } = await supabase
    .from('users')
    .select('id, name')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (!user) return NextResponse.json({ error: 'Email tidak terdaftar' }, { status: 404 })

  const pin      = generatePin()
  const pin_hash = hashPin(pin)

  await supabase.from('users').update({ pin_hash }).eq('email', email.toLowerCase().trim())

  try {
    await sendNewPinEmail({ to: email, name: user.name, pin })
  } catch (e) {
    return NextResponse.json({ error: 'Gagal mengirim email: ' + e.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
