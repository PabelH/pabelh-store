import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET single order with items
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (name, price, image_url)
      )
    `)
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  return NextResponse.json(data)
}

// PATCH update order status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { status } = await request.json()

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0])
}