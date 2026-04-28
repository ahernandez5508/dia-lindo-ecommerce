import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6 text-center bg-crema">
      <h1
        className="text-4xl text-carbon"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Página no encontrada
      </h1>

      <p className="text-base text-carbon/60" style={{ fontFamily: 'var(--font-body)' }}>
        El contenido que buscás no existe o fue movido.
      </p>

      <Link
        href="/tienda"
        className="bg-terracota text-crema px-8 py-3 rounded-full text-sm font-medium hover:bg-terracota/90 transition-colors"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        Ir a la tienda
      </Link>
    </div>
  )
}
