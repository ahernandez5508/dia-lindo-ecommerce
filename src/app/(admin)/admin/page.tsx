import Link from 'next/link'

const sections = [
  { label: 'Productos', href: '/admin/products', description: 'Gestionar catálogo' },
  { label: 'Categorías', href: '/admin/categories', description: 'Organizar productos' },
  { label: 'Pedidos', href: '/admin/orders', description: 'Ver y gestionar pedidos' },
  { label: 'Usuarios', href: '/admin/users', description: 'Gestionar accesos' },
]

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de administración</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-400 transition-colors"
          >
            <p className="font-semibold text-gray-900">{s.label}</p>
            <p className="text-sm text-gray-500 mt-1">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
