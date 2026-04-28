import Link from 'next/link'
import { db } from '@/db'
import { orders } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { PAYMENT_METHODS } from '@/lib/payment-methods'
import type { PaymentMethod } from '@/lib/payment-methods'

const STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmado', className: 'bg-blue-100 text-blue-700' },
  ready: { label: 'Listo para retirar', className: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'Entregado', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-700' },
}

export default async function OrdersPage() {
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pedidos</h1>

      {rows.length === 0 ? (
        <p className="text-gray-500 text-sm">No hay pedidos todavía.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="pb-3 font-medium text-gray-700">#</th>
              <th className="pb-3 font-medium text-gray-700">Cliente</th>
              <th className="pb-3 font-medium text-gray-700">Total</th>
              <th className="pb-3 font-medium text-gray-700">Pago</th>
              <th className="pb-3 font-medium text-gray-700">Estado</th>
              <th className="pb-3 font-medium text-gray-700">Fecha</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => {
              const status = STATUS[o.status] ?? { label: o.status, className: 'bg-gray-100 text-gray-500' }
              const paymentLabel = PAYMENT_METHODS[o.paymentMethod as PaymentMethod]?.short ?? o.paymentMethod
              return (
                <tr key={o.id} className="border-b border-gray-100">
                  <td className="py-3 text-gray-500">#{o.id}</td>
                  <td className="py-3 text-gray-900">{o.customerName}</td>
                  <td className="py-3 text-gray-700">${Number(o.total).toFixed(2)}</td>
                  <td className="py-3 text-gray-500">{paymentLabel}</td>
                  <td className="py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString('es-AR') : '—'}
                  </td>
                  <td className="py-3 text-right">
                    <Link href={`/admin/orders/${o.id}`} className="text-gray-600 hover:text-gray-900">
                      Ver
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
