import { NextRequest } from 'next/server'
import { db } from '@/db'
import { orders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getMpPayment } from '@/lib/mercadopago'
import { verifyMpSignature } from '@/lib/mp-webhook-verify'

export const dynamic = 'force-dynamic'

function mapStatus(mpStatus: string | undefined): string | null {
  switch (mpStatus) {
    case 'approved': return 'confirmed'
    case 'rejected':
    case 'cancelled': return 'rejected'
    default: return null
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.MP_WEBHOOK_SECRET
  if (!secret) {
    console.error('[mp-webhook] MP_WEBHOOK_SECRET not configured')
    return new Response('misconfigured', { status: 500 })
  }

  const signatureHeader = req.headers.get('x-signature')
  const requestIdHeader = req.headers.get('x-request-id')

  let body: any
  try {
    body = await req.json()
  } catch {
    return new Response('bad json', { status: 400 })
  }

  const url = new URL(req.url)
  const dataId = String(body?.data?.id ?? url.searchParams.get('data.id') ?? '')
  if (!dataId) return new Response('missing data.id', { status: 400 })

  const ok = verifyMpSignature({ signatureHeader, requestIdHeader, dataId, secret })
  if (!ok) return new Response('invalid signature', { status: 401 })

  if (body.type !== 'payment') return new Response(null, { status: 422 })

  let payment: any
  try {
    payment = await getMpPayment().get({ id: dataId })
  } catch (err) {
    console.error('[mp-webhook] payment.get failed', err)
    return new Response('upstream error', { status: 502 })
  }

  const orderId = Number(payment.external_reference)
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return new Response('invalid external_reference', { status: 400 })
  }

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
  if (!order) return new Response('order not found', { status: 404 })

  const newStatus = mapStatus(payment.status)
  const paymentIdStr = String(payment.id)

  if (order.mpPaymentId === paymentIdStr) {
    return new Response(null, { status: 200 })
  }

  await db.update(orders)
    .set({
      ...(newStatus ? { status: newStatus } : {}),
      mpPaymentId: paymentIdStr,
    })
    .where(eq(orders.id, orderId))

  return new Response(null, { status: 200 })
}
