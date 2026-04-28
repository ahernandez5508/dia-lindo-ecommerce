'use client'
import { useCart, type CartItem } from '@/components/CartProvider'
import { useEffect, useState } from 'react'

type Props = {
  product: Omit<CartItem, 'quantity'>
}

export default function AddToCart({ product }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [pulsing, setPulsing] = useState(false)

  function handleAdd() {
    addItem(product)
    setAdded(true)
    setPulsing(true)
    setTimeout(() => setAdded(false), 1500)
  }

  useEffect(() => {
    if (!pulsing) return
    const t = setTimeout(() => setPulsing(false), 400)
    return () => clearTimeout(t)
  }, [pulsing])

  return (
    <button
      onClick={handleAdd}
      className={`w-full bg-terracota text-crema py-3 rounded-full text-sm font-medium hover:bg-terracota/90 transition-colors disabled:opacity-70 ${
        pulsing ? 'animate-pulse-soft' : ''
      }`}
    >
      {added ? '¡Agregado!' : 'Agregar al carrito'}
    </button>
  )
}
