import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// POST register user
export async function POST(request: Request) {
  const { email, password, name } = await request.json()
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: 'customer'
      }
    }
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ user: data.user }, { status: 201 })
}