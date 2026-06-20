import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET all products
export async function GET() {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST create product
export async function POST(request: Request) {
  const body = await request.json()
  const { name, description, price, stock, category, image_url } = body

  const { data, error } = await supabase
    .from('products')
    .insert([{ name, description, price, stock, category, image_url }])
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0], { status: 201 })
}