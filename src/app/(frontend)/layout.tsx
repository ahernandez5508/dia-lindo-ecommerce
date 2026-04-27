import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import { CartProvider } from '@/components/CartProvider'

export const metadata: Metadata = {
  title: {
    template: '%s | Día Lindo — Papelería Creativa',
    default: 'Día Lindo — Papelería Creativa',
  },
  description:
    'Kits de fiesta infantil personalizados, stickers, libros de actividades y más. Diseños únicos para hacer cada celebración especial.',
  metadataBase: new URL('https://www.dialindo.com.ar'),
  openGraph: {
    siteName: 'Día Lindo — Papelería Creativa',
    locale: 'es_AR',
    type: 'website',
  },
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-full">
        <Nav />
        {children}
      </div>
    </CartProvider>
  )
}
