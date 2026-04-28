'use client'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateOrderStatus } from '@/app/(admin)/admin/orders/actions'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'ready', label: 'Listo para retirar' },
  { value: 'delivered', label: 'Entregado' },
]

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
    >
      {pending ? 'Actualizando...' : 'Actualizar estado'}
    </button>
  )
}

interface Props {
  orderId: number
  currentStatus: string
}

export default function StatusForm({ orderId, currentStatus }: Props) {
  const [state, formAction] = useActionState(updateOrderStatus, null)

  return (
    <form action={formAction} className="flex items-end gap-3">
      <input type="hidden" name="orderId" value={orderId} />
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
        <select
          name="status"
          defaultValue={currentStatus}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <SubmitButton />
      {state?.error && <p className="text-red-600 text-sm self-center">{state.error}</p>}
    </form>
  )
}
