'use client'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'

export default function CarritoPage() {
  const { items, removeItem, updateQty, total } = useCart()

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
    <main className="flex-1 px-6 py-10 max-w-2xl mx-auto w-full">
      <h1
        className="text-3xl text-carbon mb-8"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Carrito
      </h1>

      <div className="space-y-4 mb-8">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 border-b border-salmon/20 pb-4">
            <div className="w-16 h-16 bg-salmon/20 rounded-lg overflow-hidden shrink-0">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-carbon truncate">{item.name}</p>
              <p className="text-sm text-terracota">${Number(item.price).toLocaleString('es-AR')}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => updateQty(item.id, item.quantity - 1)}
                className="w-7 h-7 rounded-full border border-salmon/50 text-carbon/70 hover:bg-salmon/20 transition-colors flex items-center justify-center text-sm"
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQty(item.id, item.quantity + 1)}
                className="w-7 h-7 rounded-full border border-salmon/50 text-carbon/70 hover:bg-salmon/20 transition-colors flex items-center justify-center text-sm"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="text-carbon/30 hover:text-carbon/70 transition-colors text-xs shrink-0"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-carbon/60">Total</span>
        <span className="text-xl font-medium text-carbon">${total.toLocaleString('es-AR')}</span>
      </div>

      <Link
        href="/checkout"
        className="block w-full bg-terracota text-crema py-3 rounded-full text-sm font-medium text-center hover:bg-terracota/90 transition-colors"
      >
        Finalizar pedido
      </Link>
    </main>
  )
}
