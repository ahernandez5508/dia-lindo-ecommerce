'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/CartProvider'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Nav() {
  const { count } = useCart()
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/tienda?q=${encodeURIComponent(q)}` : '/tienda')
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-crema/60"
      style={{
        background: 'rgba(242,232,220,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        height: '72px',
      }}
    >
      <div className="flex items-center justify-between gap-4 px-6 h-full max-w-6xl mx-auto">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo.webp"
            alt="Día Lindo"
            width={48}
            height={48}
            className="object-contain"
            priority
          />
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-sm">
          <div className="relative">
            <input
              type="text"
              name="q"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full pl-4 pr-10 py-2 rounded-full text-sm text-carbon bg-white/70 border border-carbon/10 placeholder:text-carbon/40 focus:outline-none focus:border-terracota/40 transition-colors"
            />
            <button
              type="submit"
              aria-label="Buscar"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-carbon/40 hover:text-terracota transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </form>

        {/* Nav links + cart */}
        <nav className="flex items-center gap-6">
          <Link
            href="/tienda"
            className="uppercase text-xs tracking-widest text-carbon/50 hover:text-terracota transition-colors"
          >
            Tienda
          </Link>

          {/* Cart pill */}
          <button
            onClick={() => router.push('/carrito')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-colors ${
              count > 0 ? 'bg-carbon text-crema' : 'bg-carbon/10 text-carbon'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Carrito
            {count > 0 && (
              <span className="bg-amarillo text-carbon text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}
