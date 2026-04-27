import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/db'
import { orders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import CartCleaner from './CartCleaner'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pedido confirmado' }

export default async function ConfirmacionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [order] = await db.select().from(orders).where(eq(orders.id, Number(id))).limit(1)
  if (!order) notFound()

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
      <CartCleaner />
      <div className="w-12 h-12 bg-sage/30 rounded-full flex items-center justify-center mb-6 text-sage text-2xl">
        ✓
      </div>
      <h1
        className="text-3xl text-carbon mb-3"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        ¡Pedido recibido!
      </h1>
      <p className="text-carbon/60 text-sm mb-2">
        Hola {order.customerName}, te confirmamos tu pedido #{order.id}.
      </p>
      <p className="text-carbon/50 text-sm mb-8">
        Te vamos a contactar a {order.customerEmail} para coordinar la entrega.
      </p>
      <Link
        href="/tienda"
        className="bg-terracota text-crema px-6 py-2.5 rounded-full text-sm hover:bg-terracota/90 transition-colors"
      >
        Seguir comprando
      </Link>
    </main>
  )
}
