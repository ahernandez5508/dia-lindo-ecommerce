'use server'
import { db } from '@/db'
import { orders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

type State = { error?: string } | null

const VALID_STATUSES = ['pending', 'confirmed', 'ready', 'delivered', 'cancelled'] as const

export async function updateOrderStatus(
  _: State,
  formData: FormData,
): Promise<State> {
  const id = Number(formData.get('orderId'))
  const status = formData.get('status') as string

  if (!id || isNaN(id)) return { error: 'ID de pedido inválido' }
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return { error: 'Estado inválido' }
  }

  await db.update(orders).set({ status }).where(eq(orders.id, id))
  revalidatePath(`/admin/orders/${id}`)
  revalidatePath('/admin/orders')
  return null
}
