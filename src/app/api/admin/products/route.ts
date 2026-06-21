import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET all products (admin view with stock info)
export async function GET() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST create product (admin only)
export async function POST(request: Request) {
  const body = await request.json()
  const { name, description, price, stock, category, image_url } = body

  if (!name || !price) {
    return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('products')
    .insert([{ name, description, price, stock, category, image_url }])
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0], { status: 201 })
}