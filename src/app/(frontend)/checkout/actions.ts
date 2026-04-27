'use server'
import { db } from '@/db'
import { orders, orderItems } from '@/db/schema'
import { redirect } from 'next/navigation'

type CartItem = { id: number; name: string; price: number; quantity: number }
type State = { error?: string } | null

export async function createOrder(_: State, formData: FormData): Promise<State> {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim()
  const notes = (formData.get('notes') as string)?.trim()
  const cartJson = formData.get('cart') as string

  if (!name || !email) return { error: 'Nombre y email son requeridos' }

  let cart: CartItem[]
  try {
    cart = JSON.parse(cartJson)
  } catch {
    return { error: 'Error al procesar el carrito' }
  }

  if (!cart.length) return { error: 'El carrito está vacío' }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const [inserted] = await db.insert(orders).values({
    customerName: name,
    customerEmail: email,
    customerPhone: phone || null,
    notes: notes || null,
    total: total.toFixed(2),
    status: 'pending',
  }).$returningId()

  await db.insert(orderItems).values(
    cart.map(item => ({
      orderId: inserted.id,
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      unitPrice: item.price.toFixed(2),
    })),
  )

  redirect(`/checkout/confirmacion/${inserted.id}`)
}
