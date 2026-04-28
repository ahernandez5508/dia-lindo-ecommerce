import Link from 'next/link'
import { db } from '@/db'
import { products, categories } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { deleteProduct } from './actions'

export default async function ProductsPage() {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      stock: products.stock,
      active: products.active,
      customizable: products.customizable,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(products.name)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <Link
          href="/admin/products/new"
          className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-700"
        >
          Nuevo producto
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-gray-500 text-sm">No hay productos todavía.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="pb-3 font-medium text-gray-700">Nombre</th>
              <th className="pb-3 font-medium text-gray-700">Precio</th>
              <th className="pb-3 font-medium text-gray-700">Stock</th>
              <th className="pb-3 font-medium text-gray-700">Categoría</th>
              <th className="pb-3 font-medium text-gray-700">Estado</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-gray-100">
                <td className="py-3 text-gray-900">
                  <span>{p.name}</span>
                  {p.customizable && (
                    <span className="ml-2 inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-sage/20 text-sage">
                      Personalizable
                    </span>
                  )}
                </td>
                <td className="py-3 text-gray-700">${Number(p.price).toFixed(2)}</td>
                <td className="py-3 text-gray-700">{p.stock}</td>
                <td className="py-3 text-gray-500">{p.categoryName ?? '—'}</td>
                <td className="py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {p.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex gap-3 justify-end">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-gray-600 hover:text-gray-900">
                      Editar
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
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
