import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET all orders
export async function GET() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (name, price, image_url)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST create order
export async function POST(request: Request) {
  const body = await request.json()
  const { user_id, total, items } = body

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{ user_id, total }])
    .select()
    .single()

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 })

  // Create order items
  // After
  const orderItems = items.map((item: { product_id: string; quantity: number; price: number }) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 })

  return NextResponse.json(order, { status: 201 })
}