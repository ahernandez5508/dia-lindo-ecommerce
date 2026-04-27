import Link from 'next/link'
import { db } from '@/db'
import { categories } from '@/db/schema'
import { deleteCategory } from './actions'

export default async function CategoriesPage() {
  const cats = await db.select().from(categories).orderBy(categories.name)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
        <Link
          href="/admin/categories/new"
          className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-700"
        >
          Nueva categoría
        </Link>
      </div>

      {cats.length === 0 ? (
        <p className="text-gray-500 text-sm">No hay categorías todavía.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="pb-3 font-medium text-gray-700">Nombre</th>
              <th className="pb-3 font-medium text-gray-700">Slug</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {cats.map((cat) => (
              <tr key={cat.id} className="border-b border-gray-100">
                <td className="py-3 text-gray-900">{cat.name}</td>
                <td className="py-3 text-gray-500">{cat.slug}</td>
                <td className="py-3">
                  <div className="flex gap-3 justify-end">
                    <Link href={`/admin/categories/${cat.id}/edit`} className="text-gray-600 hover:text-gray-900">
                      Editar
                    </Link>
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={cat.id} />
                      <button type="submit" className="text-red-500 hover:text-red-700">
                        Eliminar
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
