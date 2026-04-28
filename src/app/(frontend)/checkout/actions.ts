'use server'
import { db } from '@/db'
import { orders, orderItems } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import type { PaymentMethod } from '@/lib/payment-methods'
import { getMpPreference } from '@/lib/mercadopago'

const VALID_PAYMENT_METHODS: PaymentMethod[] = ['mercadopago', 'transferencia', 'efectivo']

type CartItem = { id: number; name: string; price: number; quantity: number }
type State = { error?: string } | null

export async function createOrder(_: State, formData: FormData): Promise<State> {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim()
  const notes = (formData.get('notes') as string)?.trim()
  const cartJson = formData.get('cart') as string
  const paymentMethod = formData.get('paymentMethod') as string

  if (!name || !email) return { error: 'Nombre y email son requeridos' }
  if (!paymentMethod || !VALID_PAYMENT_METHODS.includes(paymentMethod as PaymentMethod)) {
    return { error: 'Seleccioná un método de pago' }
  }

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
    paymentMethod: paymentMethod as PaymentMethod,
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

  if (paymentMethod === 'mercadopago') {
    redirect(`/checkout/pago/${inserted.id}`)
  }
  redirect(`/checkout/confirmacion/${inserted.id}`)
}

export async function createMpPreference(
  orderId: number
): Promise<{ preferenceId: string } | { error: string }> {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
  if (!order) return { error: 'Pedido no encontrado' }
  if (order.paymentMethod !== 'mercadopago') return { error: 'Método de pago inválido' }
  if (order.mpPreferenceId) return { preferenceId: order.mpPreferenceId }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!

  const result = await getMpPreference().create({
    body: {
      external_reference: String(orderId),
      items: [{
        id: String(orderId),
        title: `Pedido Día Lindo #${orderId}`,
        quantity: 1,
        unit_price: Number(order.total),
        currency_id: 'ARS',
      }],
      payer: {
        name: order.customerName,
        email: order.customerEmail,
      },
      payment_methods: {
        installments: 1,
      },
      back_urls: {
        success: `${baseUrl}/checkout/confirmacion/${orderId}?status=approved`,
        failure: `${baseUrl}/checkout/confirmacion/${orderId}?status=rejected`,
        pending: `${baseUrl}/checkout/confirmacion/${orderId}?status=pending`,
      },
      auto_return: 'approved',
      notification_url: `${baseUrl}/api/mercadopago/webhook`,
      statement_descriptor: 'DIA LINDO',
    },
  })

  if (!result.id) return { error: 'No se pudo crear la preferencia de pago' }

  await db.update(orders)
    .set({ mpPreferenceId: result.id })
    .where(eq(orders.id, orderId))

  return { preferenceId: result.id }
}
