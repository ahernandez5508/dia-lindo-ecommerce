'use client'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

type State = { error?: string } | null
type Category = { id: number; name: string }
type ProductValues = {
  name: string
  description: string | null
  price: string
  stock: number
  categoryId: number | null
  active: boolean
  customizable: boolean
  images: string | null
}

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
  categories: Category[]
  defaultValues?: Partial<ProductValues>
}

export default function ProductForm({ action, categories, defaultValues }: Props) {
  const [state, formAction] = useActionState(action, null)

  let imageUrl = ''
  if (defaultValues?.images) {
    try {
      imageUrl = JSON.parse(defaultValues.images)[0] ?? ''
    } catch {}
  }

  return (
    <form action={formAction} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input
          name="name"
          type="text"
          required
          defaultValue={defaultValues?.name}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? ''}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={defaultValues?.price}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            defaultValue={defaultValues?.stock ?? 0}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
        <select
          name="categoryId"
          defaultValue={defaultValues?.categoryId ?? ''}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <option value="">Sin categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
        <input
          name="imageUrl"
          type="url"
          defaultValue={imageUrl}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          name="active"
          type="checkbox"
          id="active"
          defaultChecked={defaultValues?.active ?? true}
          className="rounded"
        />
        <label htmlFor="active" className="text-sm text-gray-700">
          Producto activo
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          name="customizable"
          type="checkbox"
          id="customizable"
          defaultChecked={defaultValues?.customizable ?? false}
          className="rounded"
        />
        <label htmlFor="customizable" className="text-sm text-gray-700">
          Producto personalizable (consulta por Instagram)
        </label>
      </div>

      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
      <SubmitButton />
    </form>
  )
}
