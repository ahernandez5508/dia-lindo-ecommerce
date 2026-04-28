import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/db'
import { products, categories } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import RevealOnScroll from '@/components/RevealOnScroll'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [cats, featured] = await Promise.all([
    db.select().from(categories).orderBy(categories.name),
    db.select().from(products).where(eq(products.active, true)).orderBy(desc(products.createdAt)).limit(4),
  ])

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative px-6 py-24 text-center overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, color-mix(in srgb, var(--color-amarillo) 40%, transparent) 0%, transparent 70%)',
          }}
        />
        <Image
          src="/images/logo.webp"
          alt="Día Lindo"
          width={180}
          height={180}
          priority
          className="mx-auto mb-4 animate-fade-in-up"
          style={{ animationDelay: '0ms' }}
        />
        <p
          className="text-carbon/70 max-w-md mx-auto mb-10 text-base md:text-lg animate-fade-in-up"
          style={{ animationDelay: '150ms' }}
        >
          Papelería creativa para momentos especiales
        </p>
        <Link
          href="/tienda"
          className="bg-terracota text-crema px-8 py-3 rounded-full text-sm font-medium hover:bg-terracota/90 transition-colors animate-fade-in-up inline-block"
          style={{ animationDelay: '300ms' }}
        >
          Ver tienda
        </Link>
      </section>

      {/* Categorías */}
      {cats.length > 0 && (
        <RevealOnScroll className="px-6 py-10 border-t border-salmon/20">
          <h2
            className="text-2xl text-carbon text-center mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Categorías
          </h2>
          <div className="flex flex-wrap gap-3 justify-center max-w-lg mx-auto">
            {cats.map(cat => (
              <Link
                key={cat.id}
                href={`/tienda?categoria=${cat.slug}`}
                className="bg-salmon/30 text-carbon/80 px-5 py-2 rounded-full text-sm hover:bg-salmon/10 transition-all border border-salmon/30 hover:scale-105"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </RevealOnScroll>
      )}

      {/* Destacados */}
      {featured.length > 0 && (
        <RevealOnScroll className="px-6 py-12 max-w-5xl mx-auto">
          <h2
            className="text-2xl text-carbon text-center mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Destacados
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featured.map(p => {
              const img = p.images ? (() => { try { return JSON.parse(p.images!)[0] } catch { return null } })() : null
              return (
                <Link key={p.id} href={`/tienda/${p.slug}`} className="group">
                  <div className="bg-crema rounded-xl p-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                    <div className="aspect-square bg-salmon/20 rounded-xl mb-3 overflow-hidden">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-carbon/20 text-xs">Sin imagen</div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-carbon">{p.name}</p>
                    <p className="text-sm text-terracota">${Number(p.price).toLocaleString('es-AR')}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </RevealOnScroll>
      )}
    </main>
  )
}
