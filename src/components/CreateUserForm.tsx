'use client'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createAdminUser } from '@/app/(admin)/admin/users/actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
    >
      {pending ? 'Creando...' : 'Crear usuario'}
    </button>
  )
}

export default function CreateUserForm() {
  const [state, formAction] = useActionState(createAdminUser, null)

  return (
    <form action={formAction} className="space-y-4 max-w-sm">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Nombre (opcional)</label>
        <input
          type="text"
          name="name"
          placeholder="Nombre del usuario"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
        <input
          type="email"
          name="email"
          required
          placeholder="admin@ejemplo.com"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Contraseña</label>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          placeholder="Mínimo 8 caracteres"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>
      <SubmitButton />
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
      {state?.success && <p className="text-green-600 text-sm">{state.success}</p>}
    </form>
  )
}
