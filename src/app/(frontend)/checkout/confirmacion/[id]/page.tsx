import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/db'
import { orders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import CartCleaner from './CartCleaner'
import PaymentInstructions from '@/components/PaymentInstructions'
import PickupNotice from '@/components/PickupNotice'
import type { PaymentMethod } from '@/lib/payment-methods'
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
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center gap-6">
      <CartCleaner />
      <div className="w-12 h-12 bg-sage/30 rounded-full flex items-center justify-center text-sage text-2xl">
        ✓
      </div>
      <h1
        className="text-3xl text-carbon"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        ¡Pedido recibido!
      </h1>
      <div className="text-sm text-carbon/60 space-y-1">
        <p>Hola {order.customerName}, te confirmamos tu pedido #{order.id}.</p>
        <p className="text-carbon/50">
          Te vamos a contactar a {order.customerEmail} para coordinar el retiro.
        </p>
      </div>

      <PaymentInstructions method={order.paymentMethod as PaymentMethod} />

      <div className="w-full max-w-md">
        <PickupNotice />
      </div>

      <Link
        href="/tienda"
        className="bg-terracota text-crema px-6 py-2.5 rounded-full text-sm hover:bg-terracota/90 transition-colors"
      >
        Seguir comprando
      </Link>
    </main>
  )
}
