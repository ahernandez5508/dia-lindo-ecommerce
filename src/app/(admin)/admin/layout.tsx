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
      <nav className="bg-white border-b border-gray-200 px-6 py-4 grid grid-cols-3 items-center">
        <span className="font-semibold text-gray-800 justify-self-start">Día Lindo — Admin</span>
        <a
          href={process.env.NEXT_PUBLIC_BASE_URL || '/'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-500 hover:text-gray-900 justify-self-center"
        >
          Ver sitio →
        </a>
        <span className="text-sm text-gray-500 justify-self-end">{session?.user?.email}</span>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
