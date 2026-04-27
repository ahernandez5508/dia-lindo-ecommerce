import type { Metadata } from 'next'
import './globals.css'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-crema text-carbon">{children}</body>
    </html>
  )
}
