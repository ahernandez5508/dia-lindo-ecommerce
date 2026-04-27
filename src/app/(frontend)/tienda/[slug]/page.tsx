import { notFound } from 'next/navigation'
import { db } from '@/db'
import { products, categories } from '@/db/schema'
import { eq } from 'drizzle-orm'
import AddToCart from '@/components/AddToCart'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [p] = await db.select({ name: products.name, description: products.description }).from(products).where(eq(products.slug, slug)).limit(1)
  if (!p) return {}
  return { title: p.name, description: p.description ?? undefined }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [row] = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      stock: products.stock,
      images: products.images,
      active: products.active,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1)

  if (!row || !row.active) notFound()

  const imgs: string[] = row.images ? (() => { try { return JSON.parse(row.images!) } catch { return [] } })() : []
  const price = Number(row.price)

  return (
    <main className="flex-1 px-6 py-10 max-w-4xl mx-auto w-full">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Imagen */}
        <div className="aspect-square bg-salmon/20 rounded-2xl overflow-hidden">
          {imgs[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgs[0]} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-carbon/20">Sin imagen</div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          {row.categoryName && (
            <p className="text-xs text-carbon/50 uppercase tracking-widest">{row.categoryName}</p>
          )}
          <h1
            className="text-3xl text-carbon"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {row.name}
          </h1>
          <p className="text-2xl text-terracota font-medium">
            ${price.toLocaleString('es-AR')}
          </p>
          {row.description && (
            <p className="text-sm text-carbon/70 leading-relaxed">{row.description}</p>
          )}
          <p className="text-xs text-carbon/40">
            {row.stock > 0 ? `${row.stock} disponibles` : 'Sin stock'}
          </p>
          {row.stock > 0 ? (
            <AddToCart product={{ id: row.id, name: row.name, price, image: imgs[0] }} />
          ) : (
            <button disabled className="w-full bg-carbon/10 text-carbon/40 py-3 rounded-full text-sm cursor-not-allowed">
              Sin stock
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
