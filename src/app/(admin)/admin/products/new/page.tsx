import Link from 'next/link'
import { db } from '@/db'
import { categories } from '@/db/schema'
import ProductForm from '../ProductForm'
import { createProduct } from '../actions'

export default async function NewProductPage() {
  const cats = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .orderBy(categories.name)

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-900">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo producto</h1>
      </div>
      <ProductForm action={createProduct} categories={cats} />
    </div>
  )
}
