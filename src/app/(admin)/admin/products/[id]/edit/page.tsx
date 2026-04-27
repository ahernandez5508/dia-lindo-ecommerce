import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/db'
import { products, categories } from '@/db/schema'
import { eq } from 'drizzle-orm'
import ProductForm from '../../ProductForm'
import { updateProduct } from '../../actions'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idStr } = await params
  const id = Number(idStr)

  const [[product], cats] = await Promise.all([
    db.select().from(products).where(eq(products.id, id)).limit(1),
    db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(categories.name),
  ])

  if (!product) notFound()

  const action = updateProduct.bind(null, id)

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-900">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar producto</h1>
      </div>
      <ProductForm action={action} categories={cats} defaultValues={product} />
    </div>
  )
}
