import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

function hashPin(pin) {
  return createHash('sha256').update(pin + process.env.PIN_SALT || 'mocardi-salt').digest('hex')
}

export async function POST(request) {
  const { email, pin } = await request.json()

  if (!email?.trim() || !pin?.trim()) {
    return NextResponse.json({ error: 'Email dan PIN wajib diisi' }, { status: 400 })
  }

  const supabase = getSupabase()

  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('email', email.toLowerCase().trim())
    .eq('pin_hash', hashPin(pin))
    .single()

  if (error || !user) {
    return NextResponse.json({ error: 'Email atau PIN salah' }, { status: 401 })
  }

  return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } })
}
