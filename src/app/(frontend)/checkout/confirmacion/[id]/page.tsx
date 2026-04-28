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
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ status?: string }>
}) {
  const { id } = await params
  const { status: statusParam } = await searchParams
  const [order] = await db.select().from(orders).where(eq(orders.id, Number(id))).limit(1)
  if (!order) notFound()

  const isMp = order.paymentMethod === 'mercadopago'
  let uiState: 'success' | 'pending' | 'rejected' = 'pending'
  if (isMp) {
    if (order.status === 'confirmed' || statusParam === 'approved') uiState = 'success'
    else if (order.status === 'rejected' || statusParam === 'rejected') uiState = 'rejected'
    else uiState = 'pending'
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center gap-6">
      <CartCleaner />

      {isMp ? (
        <>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
            uiState === 'success' ? 'bg-sage/30 text-sage' :
            uiState === 'rejected' ? 'bg-red-100 text-red-500' :
            'bg-salmon/20 text-terracota'
          }`}>
            {uiState === 'success' ? '✓' : uiState === 'rejected' ? '✕' : '…'}
          </div>
          <h1 className="text-3xl text-carbon" style={{ fontFamily: 'var(--font-display)' }}>
            {uiState === 'success' && '¡Pago aprobado!'}
            {uiState === 'pending' && 'Procesando pago…'}
            {uiState === 'rejected' && 'Pago rechazado'}
          </h1>
          <div className="text-sm text-carbon/60 space-y-1">
            {uiState === 'success' && (
              <>
                <p>Tu pedido #{order.id} está confirmado, {order.customerName}.</p>
                <p className="text-carbon/50">Te contactamos a {order.customerEmail} para coordinar el retiro.</p>
              </>
            )}
            {uiState === 'pending' && (
              <p>Estamos confirmando tu pago. Te avisamos cuando esté listo.</p>
            )}
            {uiState === 'rejected' && (
              <p>El pago no pudo procesarse. Podés intentarlo de nuevo.</p>
            )}
          </div>
          {uiState === 'rejected' && (
            <Link
              href={`/checkout/pago/${order.id}`}
              className="bg-terracota text-crema px-6 py-2.5 rounded-full text-sm hover:bg-terracota/90 transition-colors"
            >
              Volver a intentar
            </Link>
          )}
          {uiState !== 'rejected' && (
            <Link
              href="/tienda"
              className="bg-terracota text-crema px-6 py-2.5 rounded-full text-sm hover:bg-terracota/90 transition-colors"
            >
              Seguir comprando
            </Link>
          )}
        </>
      ) : (
        <>
          <div className="w-12 h-12 bg-sage/30 rounded-full flex items-center justify-center text-sage text-2xl">
            ✓
          </div>
          <h1 className="text-3xl text-carbon" style={{ fontFamily: 'var(--font-display)' }}>
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
        </>
      )}
    </main>
  )
}
