import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-800">Día Lindo — Admin</span>
          <a
            href={process.env.NEXT_PUBLIC_BASE_URL || '/'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-terracota hover:text-terracota transition-colors"
          >
            Ver sitio →
          </a>
        </div>
        <span className="text-sm text-gray-500">{session?.user?.email}</span>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
