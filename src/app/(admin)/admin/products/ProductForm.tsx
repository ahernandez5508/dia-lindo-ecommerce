'use client'
import { useState } from 'react'
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

  const [urls, setUrls] = useState<string[]>(() => {
    if (!defaultValues?.images) return ['']
    try {
      const parsed = JSON.parse(defaultValues.images)
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : ['']
    } catch {
      return ['']
    }
  })

  const updateUrl = (i: number, value: string) =>
    setUrls(prev => prev.map((u, idx) => (idx === i ? value : u)))
  const addUrl = () => setUrls(prev => [...prev, ''])
  const removeUrl = (i: number) =>
    setUrls(prev => prev.length === 1 ? [''] : prev.filter((_, idx) => idx !== i))

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
        <label className="block text-sm font-medium text-carbon mb-1">
          Imágenes (URL)
          <span className="text-xs text-carbon/60 ml-1">La primera será la imagen principal</span>
        </label>
        {urls.map((url, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="url"
              name={`imageUrl_${i}`}
              value={url}
              onChange={e => updateUrl(i, e.target.value)}
              placeholder="https://..."
              className="flex-1 border border-salmon/30 rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => removeUrl(i)}
              disabled={urls.length === 1}
              className="px-3 py-2 text-sm border border-salmon/30 rounded-lg disabled:opacity-40 hover:bg-salmon/10 transition"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addUrl}
          className="text-sm border border-dashed border-salmon/50 rounded-lg px-4 py-2 hover:bg-salmon/10 transition w-full"
        >
          + Agregar imagen
        </button>
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
