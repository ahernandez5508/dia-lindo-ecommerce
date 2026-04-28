'use client'
import { useCart } from '@/components/CartProvider'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createOrder } from './actions'
import Link from 'next/link'
import PaymentMethodRadio from '@/components/PaymentMethodRadio'
import PickupNotice from '@/components/PickupNotice'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-terracota text-crema py-3 rounded-full text-sm font-medium hover:bg-terracota/90 disabled:opacity-50 transition-colors"
    >
      {pending ? 'Enviando pedido...' : 'Confirmar pedido'}
    </button>
  )
}

export default function CheckoutPage() {
  const { items, total } = useCart()
  const [state, formAction] = useActionState(createOrder, null)

  if (items.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-carbon/50 mb-6">Tu carrito está vacío.</p>
        <Link href="/tienda" className="bg-terracota text-crema px-6 py-2.5 rounded-full text-sm hover:bg-terracota/90 transition-colors">
          Ir a la tienda
        </Link>
      </main>
    )
  }

  return (
    <main className="flex-1 px-6 py-10 max-w-3xl mx-auto w-full">
      <h1
        className="text-3xl text-carbon mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Finalizar pedido
      </h1>
      <div className="mb-8">
        <PickupNotice />
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Formulario */}
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="cart" value={JSON.stringify(items)} />

          <div>
            <label className="block text-sm font-medium text-carbon/70 mb-1">Nombre *</label>
            <input
              name="name"
              type="text"
              required
              className="w-full border border-salmon/50 rounded-lg px-3 py-2 text-sm bg-crema focus:outline-none focus:ring-2 focus:ring-terracota/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-carbon/70 mb-1">Email *</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border border-salmon/50 rounded-lg px-3 py-2 text-sm bg-crema focus:outline-none focus:ring-2 focus:ring-terracota/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-carbon/70 mb-1">Teléfono</label>
            <input
              name="phone"
              type="tel"
              className="w-full border border-salmon/50 rounded-lg px-3 py-2 text-sm bg-crema focus:outline-none focus:ring-2 focus:ring-terracota/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-carbon/70 mb-1">Notas</label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Aclaraciones del pedido..."
              className="w-full border border-salmon/50 rounded-lg px-3 py-2 text-sm bg-crema focus:outline-none focus:ring-2 focus:ring-terracota/30 resize-none"
            />
          </div>

          <PaymentMethodRadio />

          {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
          <SubmitButton />
        </form>

        {/* Resumen */}
        <div>
          <h2 className="text-sm font-medium text-carbon/60 uppercase tracking-widest mb-4">Resumen</h2>
          <div className="space-y-3 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-carbon/80">{item.name} × {item.quantity}</span>
                <span className="text-carbon">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-salmon/30 pt-3 flex justify-between font-medium">
            <span className="text-carbon/70">Total</span>
            <span className="text-terracota">${total.toLocaleString('es-AR')}</span>
          </div>
        </div>
      </div>
    </main>
  )
}
