'use client'
import { createContext, useContext, useEffect, useState } from 'react'

export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

type CartCtx = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  updateQty: (id: number, qty: number) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('dl-cart')
    if (stored) setItems(JSON.parse(stored))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem('dl-cart', JSON.stringify(items))
  }, [items, hydrated])

  const addItem = (item: Omit<CartItem, 'quantity'>) =>
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...item, quantity: 1 }]
    })

  const removeItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id))

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) return removeItem(id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  const clearCart = () => setItems([])
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
