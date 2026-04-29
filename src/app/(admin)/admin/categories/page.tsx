import Link from 'next/link'
import { db } from '@/db'
import { categories } from '@/db/schema'
import { like } from 'drizzle-orm'
import { deleteCategory } from './actions'

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  const cats = await db
    .select()
    .from(categories)
    .where(q ? like(categories.name, `%${q}%`) : undefined)
    .orderBy(categories.name)

  return (
    <div>
      <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 inline-block mb-4">
        ← Volver al panel
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
        <Link
          href="/admin/categories/new"
          className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-700"
        >
          Nueva categoría
        </Link>
      </div>

      <form method="GET" className="flex gap-3 mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ''}
          placeholder="Buscar por nombre..."
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 flex-1 max-w-xs"
        />
        <button
          type="submit"
          className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-700"
        >
          Filtrar
        </button>
        {q && (
          <Link
            href="/admin/categories"
            className="border border-gray-300 rounded px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Limpiar
          </Link>
        )}
      </form>

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
