import Link from 'next/link'
import { db } from '@/db'
import { products, categories } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Tienda' }

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>
}) {
  const { categoria } = await searchParams

  const [cats, rows] = await Promise.all([
    db.select().from(categories).orderBy(categories.name),
    db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        images: products.images,
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

  return (
    <main className="flex-1 px-6 py-10 max-w-5xl mx-auto w-full">
      <h1
        className="text-3xl text-carbon mb-8"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Tienda
      </h1>

      {/* Filtro de categorías */}
      {cats.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/tienda"
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              !categoria ? 'bg-terracota text-crema' : 'bg-salmon/30 text-carbon/80 hover:bg-salmon/50'
            }`}
          >
            Todo
          </Link>
          {cats.map(cat => (
            <Link
              key={cat.id}
              href={`/tienda?categoria=${cat.slug}`}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                categoria === cat.slug
                  ? 'bg-terracota text-crema'
                  : 'bg-salmon/30 text-carbon/80 hover:bg-salmon/50'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {rows.length === 0 ? (
        <p className="text-carbon/50 text-sm">No hay productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {rows.map(p => {
            const img = p.images ? (() => { try { return JSON.parse(p.images!)[0] } catch { return null } })() : null
            return (
              <Link key={p.id} href={`/tienda/${p.slug}`} className="group">
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
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
