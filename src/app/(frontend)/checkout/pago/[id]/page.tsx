import { notFound, redirect } from 'next/navigation'
import { db } from '@/db'
import { orders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { createMpPreference } from '../../actions'
import MercadoPagoBricks from '@/components/MercadoPagoBricks'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pagar pedido — Día Lindo' }
export const dynamic = 'force-dynamic'

export default async function PagoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idStr } = await params
  const id = Number(idStr)
  if (!Number.isInteger(id) || id <= 0) notFound()

  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1)
  if (!order) notFound()

  if (order.paymentMethod !== 'mercadopago') {
    redirect(`/checkout/confirmacion/${id}`)
  }
  if (order.status === 'confirmed') {
    redirect(`/checkout/confirmacion/${id}?status=approved`)
  }

  let preferenceId = order.mpPreferenceId
  if (!preferenceId) {
    const result = await createMpPreference(id)
    if ('error' in result) {
      throw new Error(result.error)
    }
    preferenceId = result.preferenceId
  }

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-10 gap-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl text-carbon mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Pagar pedido
        </h1>
        <p className="text-sm text-carbon/60 mb-6">
          Total: ${Number(order.total).toFixed(2)}
        </p>
        <MercadoPagoBricks
          preferenceId={preferenceId}
          publicKey={process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!}
          orderId={order.id}
          amount={Number(order.total)}
        />
      </div>
    </main>
  )
}
