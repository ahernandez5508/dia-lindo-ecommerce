'use client'
import { useCart, type CartItem } from '@/components/CartProvider'
import { useState } from 'react'

type Props = {
  product: Omit<CartItem, 'quantity'>
}

export default function AddToCart({ product }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full bg-terracota text-crema py-3 rounded-full text-sm font-medium hover:bg-terracota/90 transition-colors disabled:opacity-70"
    >
      {added ? '¡Agregado!' : 'Agregar al carrito'}
    </button>
  )
}
