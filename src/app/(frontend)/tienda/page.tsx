import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/db'
import { products, categories } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import type { Metadata } from 'next'
import ProductBadge from '@/components/ProductBadge'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Tienda' }

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>
}) {
  const { categoria, q } = await searchParams

  const [cats, rows] = await Promise.all([
    db.select().from(categories).orderBy(categories.name),
    db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        images: products.images,
        customizable: products.customizable,
        stock: products.stock,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(
        categoria
          ? and(eq(products.active, true), eq(categories.slug, categoria))
          : eq(products.active, true),
      )
      .orderBy(products.name),
  ])

  const filtered = q
    ? rows.filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
    : rows

  return (
    <main className="flex-1 px-6 py-10 max-w-5xl mx-auto w-full">
      <h1
        className="text-3xl text-carbon mb-8"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {q ? `Resultados para "${q}"` : 'Tienda'}
      </h1>

      {/* Filtro de categorías — tab underline style */}
      {cats.length > 0 && (
        <div className="flex gap-0 border-b border-salmon/20 overflow-x-auto mb-8">
          <Link
            href={q ? `/tienda?q=${encodeURIComponent(q)}` : '/tienda'}
            className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
              !categoria
                ? 'border-terracota text-terracota font-bold'
                : 'border-transparent text-carbon/60 font-medium hover:text-terracota'
            }`}
          >
            Todo
          </Link>
          {cats.map(cat => (
            <Link
              key={cat.id}
              href={`/tienda?categoria=${cat.slug}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
              className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                categoria === cat.slug
                  ? 'border-terracota text-terracota font-bold'
                  : 'border-transparent text-carbon/60 font-medium hover:text-terracota'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-carbon/50 text-sm">
          {q ? `No se encontraron productos para "${q}".` : 'No hay productos en esta categoría.'}
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map(p => {
            const img = p.images
              ? (() => { try { return JSON.parse(p.images!)[0] } catch { return null } })()
              : null
            return (
              <Link key={p.id} href={`/tienda/${p.slug}`} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="relative aspect-square bg-salmon/20 overflow-hidden">
                    {p.customizable && <ProductBadge variant="custom" />}
                    {p.stock === 0 && (
                      <span className="absolute top-2 right-2 z-10 bg-carbon/80 text-crema text-xs px-2 py-0.5 rounded-full">
                        Sin stock
                      </span>
                    )}
                    {img ? (
                      <Image
                        src={img}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-carbon/20 text-xs">Sin imagen</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-display text-base font-semibold text-carbon leading-snug mb-3">
                      {p.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-terracota">
                        ${Number(p.price).toLocaleString('es-AR')}
                      </p>
                      <span className="bg-carbon text-crema text-xs font-bold tracking-wider px-3 py-2 rounded-lg group-hover:bg-terracota transition-colors">
                        Ver
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
