'use client'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'

export default function Nav() {
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-crema/95 backdrop-blur border-b border-salmon/30 px-6 py-4 flex items-center justify-between">
      <Link
        href="/"
        className="font-display text-xl text-terracota"
        style={{ fontFamily: 'var(--font-display)', letterSpacing: 'var(--letter-spacing-brand)' }}
      >
        Día Lindo
      </Link>
      <nav className="flex items-center gap-6 text-sm font-medium">
        <Link href="/tienda" className="text-carbon/80 hover:text-terracota transition-colors">
          Tienda
        </Link>
        <Link href="/carrito" className="relative text-carbon/80 hover:text-terracota transition-colors">
          Carrito
          {count > 0 && (
            <span className="absolute -top-2 -right-4 bg-terracota text-crema text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </Link>
      </nav>
    </header>
  )
}
