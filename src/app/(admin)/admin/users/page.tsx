import Link from 'next/link'
import { db } from '@/db'
import { adminUsers } from '@/db/schema'
import { desc } from 'drizzle-orm'
import CreateUserForm from '@/components/CreateUserForm'

export default async function UsersPage() {
  const users = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      createdAt: adminUsers.createdAt,
    })
    .from(adminUsers)
    .orderBy(desc(adminUsers.createdAt))

  return (
    <div>
      <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 inline-block mb-4">
        ← Volver al panel
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Usuarios administradores</h1>

      {users.length === 0 ? (
        <p className="text-gray-500 text-sm mb-8">No hay usuarios todavía.</p>
      ) : (
        <table className="w-full text-sm mb-10">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="pb-3 font-medium text-gray-700">Email</th>
              <th className="pb-3 font-medium text-gray-700">Nombre</th>
              <th className="pb-3 font-medium text-gray-700">Creado</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100">
                <td className="py-3 text-gray-900">{u.email}</td>
                <td className="py-3 text-gray-500">{u.name ?? '—'}</td>
                <td className="py-3 text-gray-500">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString('es-AR') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Crear nuevo usuario</h2>
      <CreateUserForm />
    </div>
  )
}
