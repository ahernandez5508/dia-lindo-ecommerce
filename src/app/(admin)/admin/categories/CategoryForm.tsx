'use client'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

type State = { error?: string } | null

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
    >
      {pending ? 'Guardando...' : 'Guardar'}
    </button>
  )
}

interface Props {
  action: (state: State, formData: FormData) => Promise<State>
  defaultValues?: { name: string }
}

export default function CategoryForm({ action, defaultValues }: Props) {
  const [state, formAction] = useActionState(action, null)
  return (
    <form action={formAction} className="space-y-4 max-w-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          name="name"
          type="text"
          required
          defaultValue={defaultValues?.name}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
      <SubmitButton />
    </form>
  )
}
