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
  const { data, error } = await supabase.from('settings').select('*')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const result = {}
  for (const row of data) result[row.key] = row.value
  return NextResponse.json(result)
}

export async function PATCH(request) {
  const supabase = getSupabase()
  const body = await request.json()
  const { key, value } = body

  const { data, error } = await supabase
    .from('settings')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
