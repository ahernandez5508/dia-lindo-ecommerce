import { notFound } from 'next/navigation'
import { db } from '@/db'
import { orders, orderItems } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { PAYMENT_METHODS } from '@/lib/payment-methods'
import type { PaymentMethod } from '@/lib/payment-methods'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Mi pedido' }

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente de pago',
  confirmed: 'Confirmado',
  ready: 'Listo para retirar',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

export default async function TrackingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const [order] = await db.select().from(orders).where(eq(orders.trackingToken, token)).limit(1)
  if (!order) notFound()
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id))
  const paymentLabel = PAYMENT_METHODS[order.paymentMethod as PaymentMethod]?.label ?? order.paymentMethod
  const statusLabel = STATUS_LABELS[order.status] ?? order.status

  return (
    <main className="flex-1 px-6 py-12 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-carbon mb-1" style={{ fontFamily: 'var(--font-display)' }}>
        Pedido #{order.id}
      </h1>
      <p className="text-sm text-carbon/60 mb-8">Hola {order.customerName}</p>

      <div className="bg-white rounded-xl border border-salmon/20 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-carbon/60">Estado</span>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
              order.status === 'confirmed' || order.status === 'delivered'
                ? 'bg-sage/20 text-sage'
                : order.status === 'cancelled'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-amarillo/40 text-carbon'
            }`}
          >
            {statusLabel}
          </span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-carbon/60">Método de pago</span>
          <span className="text-sm font-medium text-carbon">{paymentLabel}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-carbon/60">Total</span>
          <span className="text-lg font-bold text-terracota">${Number(order.total).toLocaleString('es-AR')}</span>
        </div>
      </div>

      {items.length > 0 && (
        <div className="bg-white rounded-xl border border-salmon/20 p-6">
          <h2 className="text-sm font-semibold text-carbon mb-4">Ítems del pedido</h2>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-carbon">
                  {item.productName} <span className="text-carbon/50">×{item.quantity}</span>
                </span>
                <span className="text-carbon font-medium">
                  ${(item.quantity * Number(item.unitPrice)).toLocaleString('es-AR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
