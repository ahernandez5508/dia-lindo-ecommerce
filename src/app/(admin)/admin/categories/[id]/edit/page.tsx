import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/db'
import { categories } from '@/db/schema'
import { eq } from 'drizzle-orm'
import CategoryForm from '../../CategoryForm'
import { updateCategory } from '../../actions'

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idStr } = await params
  const id = Number(idStr)

  const [cat] = await db.select().from(categories).where(eq(categories.id, id)).limit(1)
  if (!cat) notFound()

  const action = updateCategory.bind(null, id)

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/categories" className="text-sm text-gray-500 hover:text-gray-900">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar categoría</h1>
      </div>
      <CategoryForm action={action} defaultValues={{ name: cat.name! }} />
    </div>
  )
}
