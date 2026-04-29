import { getResend } from '@/lib/resend'
import type { PaymentMethod } from '@/lib/payment-methods'

type CartItem = { name: string; quantity: number; price: number }

export async function sendOrderEmail({
  orderId,
  trackingToken,
  order,
  cart,
}: {
  orderId: number
  trackingToken: string
  order: {
    customerName: string
    customerEmail: string
    paymentMethod: PaymentMethod
    total: number | string
  }
  cart: CartItem[]
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ''
  const trackingUrl = `${baseUrl}/mis-pedidos/${trackingToken}`

  const paymentCopy: Record<PaymentMethod, string> = {
    mercadopago: 'Tu pago está siendo procesado por MercadoPago.',
    transferencia:
      'Para completar tu pedido, realizá la transferencia. Te enviamos los datos por Instagram (<a href="https://instagram.com/dialindo.papeleria">@dialindo.papeleria</a>).',
  }

  const itemsHtml = cart
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;color:#3A3A3A">${i.name}</td><td style="padding:6px 0;text-align:right;color:#3A3A3A">x${i.quantity} — $${(i.price * i.quantity).toLocaleString('es-AR')}</td></tr>`,
    )
    .join('')

  const html = `
    <div style="font-family:Montserrat,sans-serif;max-width:560px;margin:0 auto;color:#3A3A3A">
      <div style="background:#F2E8DC;padding:32px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="font-family:'Playfair Display',serif;color:#C65A2E;margin:0;font-size:28px">Día Lindo</h1>
        <p style="color:#A3B18A;font-size:11px;letter-spacing:3px;margin:4px 0 0">PAPELERÍA CREATIVA</p>
      </div>
      <div style="padding:32px;background:#fff">
        <p>Hola <strong>${order.customerName}</strong>,</p>
        <p>¡Recibimos tu pedido <strong>#${orderId}</strong>! Gracias por elegirnos.</p>
        <table width="100%" style="margin:20px 0;border-top:1px solid #F2E8DC;border-bottom:1px solid #F2E8DC">
          ${itemsHtml}
          <tr><td colspan="2" style="padding:10px 0;border-top:1px solid #F2E8DC"></td></tr>
          <tr>
            <td style="font-weight:700">Total</td>
            <td style="font-weight:700;text-align:right;color:#C65A2E">$${Number(order.total).toLocaleString('es-AR')}</td>
          </tr>
        </table>
        <div style="background:#F2E8DC;border-radius:8px;padding:16px;margin:20px 0">
          <p style="margin:0;font-size:14px"><strong>Pago:</strong> ${(paymentCopy as Record<string, string>)[order.paymentMethod] ?? 'Coordinaremos los detalles del pago contigo.'}</p>
        </div>
        <div style="text-align:center;margin:28px 0">
          <a href="${trackingUrl}" style="background:#C65A2E;color:#fff;padding:14px 32px;border-radius:40px;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:1px">
            SEGUÍ TU PEDIDO
          </a>
        </div>
        <p style="font-size:12px;color:#999;text-align:center">O entrá acá: <a href="${trackingUrl}" style="color:#C65A2E">${trackingUrl}</a></p>
      </div>
      <div style="background:#3A3A3A;padding:16px;text-align:center;border-radius:0 0 12px 12px">
        <p style="color:rgba(255,255,255,0.5);font-size:11px;margin:0">© 2026 Día Lindo — Papelería Creativa</p>
      </div>
    </div>
  `

  await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: order.customerEmail,
    subject: `Pedido #${orderId} recibido — Día Lindo`,
    html,
  })
}
