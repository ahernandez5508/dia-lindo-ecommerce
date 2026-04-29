'use client'
import { createContext, useContext, useEffect, useState } from 'react'

export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

const CART_KEY = 'dl-cart'
const CART_TTL_MS = 7_200_000

type StoredCart = { items: CartItem[]; lastActivity: number }

function isStoredCart(v: unknown): v is StoredCart {
  return (
    typeof v === 'object' &&
    v !== null &&
    !Array.isArray(v) &&
    Array.isArray((v as StoredCart).items) &&
    typeof (v as StoredCart).lastActivity === 'number'
  )
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
    const stored = localStorage.getItem(CART_KEY)
    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          localStorage.removeItem(CART_KEY)
        } else if (isStoredCart(parsed)) {
          if (Date.now() - parsed.lastActivity >= CART_TTL_MS) {
            localStorage.removeItem(CART_KEY)
          } else {
            setItems(parsed.items)
          }
        } else {
          localStorage.removeItem(CART_KEY)
        }
      } catch {
        localStorage.removeItem(CART_KEY)
      }
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify({ items, lastActivity: Date.now() }))
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
