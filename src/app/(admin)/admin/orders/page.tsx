import Link from 'next/link'
import { db } from '@/db'
import { orders } from '@/db/schema'
import { desc, eq, like, or, and } from 'drizzle-orm'
import { PAYMENT_METHODS } from '@/lib/payment-methods'
import type { PaymentMethod } from '@/lib/payment-methods'

const STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmado', className: 'bg-blue-100 text-blue-700' },
  ready: { label: 'Listo para retirar', className: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'Entregado', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-700' },
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const { q, status } = await searchParams

  const conditions = []
  if (q) {
    conditions.push(
      or(
        like(orders.customerName, `%${q}%`),
        like(orders.customerEmail, `%${q}%`),
      )!,
    )
  }
  if (status) conditions.push(eq(orders.status, status))

  const rows = await db
    .select()
    .from(orders)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(orders.createdAt))

  return (
    <div>
      <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 inline-block mb-4">
        ← Volver al panel
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pedidos</h1>

      <form method="GET" className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ''}
          placeholder="Buscar cliente o email..."
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 flex-1 max-w-xs"
        />
        <select
          name="status"
          defaultValue={status ?? ''}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmado</option>
          <option value="ready">Listo para retirar</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>
        <button
          type="submit"
          className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-700"
        >
          Filtrar
        </button>
        {(q || status) && (
          <Link
            href="/admin/orders"
            className="border border-gray-300 rounded px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Limpiar
          </Link>
        )}
      </form>

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
              const statusInfo = STATUS[o.status] ?? { label: o.status, className: 'bg-gray-100 text-gray-500' }
              const paymentLabel = PAYMENT_METHODS[o.paymentMethod as PaymentMethod]?.short ?? o.paymentMethod
              return (
                <tr key={o.id} className="border-b border-gray-100">
                  <td className="py-3 text-gray-500">#{o.id}</td>
                  <td className="py-3 text-gray-900">{o.customerName}</td>
                  <td className="py-3 text-gray-700">${Number(o.total).toFixed(2)}</td>
                  <td className="py-3 text-gray-500">{paymentLabel}</td>
                  <td className="py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusInfo.className}`}>
                      {statusInfo.label}
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
