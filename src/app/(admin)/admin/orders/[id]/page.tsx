import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/db'
import { orders, orderItems } from '@/db/schema'
import { eq } from 'drizzle-orm'

const STATUS: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idStr } = await params
  const id = Number(idStr)

  const [[order], items] = await Promise.all([
    db.select().from(orders).where(eq(orders.id, id)).limit(1),
    db.select().from(orderItems).where(eq(orderItems.orderId, id)),
  ])

  if (!order) notFound()

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-gray-900">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Pedido #{order.id}</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 grid grid-cols-2 gap-4 text-sm max-w-lg">
        <div>
          <p className="text-gray-500">Cliente</p>
          <p className="font-medium text-gray-900">{order.customerName}</p>
        </div>
        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium text-gray-900">{order.customerEmail}</p>
        </div>
        {order.customerPhone && (
          <div>
            <p className="text-gray-500">Teléfono</p>
            <p className="font-medium text-gray-900">{order.customerPhone}</p>
          </div>
        )}
        <div>
          <p className="text-gray-500">Estado</p>
          <p className="font-medium text-gray-900">{STATUS[order.status] ?? order.status}</p>
        </div>
        <div>
          <p className="text-gray-500">Total</p>
          <p className="font-medium text-gray-900">${Number(order.total).toFixed(2)}</p>
        </div>
        {order.notes && (
          <div className="col-span-2">
            <p className="text-gray-500">Notas</p>
            <p className="text-gray-900">{order.notes}</p>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Ítems</h2>
          <table className="w-full text-sm max-w-lg">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 font-medium text-gray-700">Producto</th>
                <th className="pb-3 font-medium text-gray-700">Cantidad</th>
                <th className="pb-3 font-medium text-gray-700">Precio unit.</th>
                <th className="pb-3 font-medium text-gray-700">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3 text-gray-900">{item.productName}</td>
                  <td className="py-3 text-gray-700">{item.quantity}</td>
                  <td className="py-3 text-gray-700">${Number(item.unitPrice).toFixed(2)}</td>
                  <td className="py-3 text-gray-700">
                    ${(item.quantity * Number(item.unitPrice)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
