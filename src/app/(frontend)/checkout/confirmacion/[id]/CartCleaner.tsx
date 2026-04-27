'use client'
import { useEffect } from 'react'
import { useCart } from '@/components/CartProvider'

export default function CartCleaner() {
  const { clearCart } = useCart()
  useEffect(() => { clearCart() }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}
