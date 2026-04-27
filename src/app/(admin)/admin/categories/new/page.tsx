import Link from 'next/link'
import CategoryForm from '../CategoryForm'
import { createCategory } from '../actions'

export default function NewCategoryPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/categories" className="text-sm text-gray-500 hover:text-gray-900">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Nueva categoría</h1>
      </div>
      <CategoryForm action={createCategory} />
    </div>
  )
}
