import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('label', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(request) {
  const supabase = getSupabase()
  const body = await request.json()
  const { key, stock, min_stock } = body

  const updateData = { updated_at: new Date().toISOString() }
  if (stock !== undefined) updateData.stock = stock
  if (min_stock !== undefined) updateData.min_stock = min_stock

  const { data, error } = await supabase
    .from('inventory')
    .update(updateData)
    .eq('key', key)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
