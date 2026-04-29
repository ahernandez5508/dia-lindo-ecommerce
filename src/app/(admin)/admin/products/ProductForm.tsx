'use client'
import { useState } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import type { ClientUploadedFileData } from 'uploadthing/types'
import { UploadDropzone } from '@/lib/uploadthing'

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

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending || disabled}
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
    if (!defaultValues?.images) return []
    try {
      const parsed = JSON.parse(defaultValues.images)
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : []
    } catch {
      return []
    }
  })

  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const removeUrl = (i: number) =>
    setUrls(prev => prev.filter((_, idx) => idx !== i))

  const moveUp = (i: number) => {
    if (i === 0) return
    setUrls(prev => {
      const next = [...prev]
      ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
      return next
    })
  }

  const moveDown = (i: number) => {
    setUrls(prev => {
      if (i === prev.length - 1) return prev
      const next = [...prev]
      ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
      return next
    })
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
        <label className="block text-sm font-medium text-carbon mb-1">
          Imágenes
          <span className="text-xs text-carbon/60 ml-1">La primera será la imagen principal</span>
        </label>

        {urls.length > 0 && (
          <ul className="space-y-2 mb-3">
            {urls.map((url, i) => (
              <li key={url + i} className="flex items-center gap-2 border border-salmon/20 rounded-lg p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Imagen ${i + 1}`}
                  className="w-14 h-14 object-cover rounded"
                />
                <span className="flex-1 text-xs text-gray-500 truncate">{url}</span>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="px-2 py-0.5 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-30"
                    aria-label="Mover arriba"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(i)}
                    disabled={i === urls.length - 1}
                    className="px-2 py-0.5 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-30"
                    aria-label="Mover abajo"
                  >
                    ↓
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeUrl(i)}
                  className="px-2 py-1 text-sm border border-salmon/30 rounded-lg hover:bg-salmon/10 transition"
                  aria-label="Quitar imagen"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <UploadDropzone
          endpoint="productImage"
          onUploadBegin={() => {
            setUploading(true)
            setUploadError(null)
          }}
          onClientUploadComplete={(res: ClientUploadedFileData<{ url: string; key: string }>[]) => {
            setUploading(false)
            setUrls(prev => [...prev, ...res.map((f) => f.url)])
          }}
          onUploadError={(err: Error) => {
            setUploading(false)
            setUploadError(err.message ?? 'Error al subir la imagen')
          }}
        />

        {uploadError && (
          <p className="text-red-600 text-xs mt-1">{uploadError}</p>
        )}
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

      <input type="hidden" name="images" value={JSON.stringify(urls)} />

      <SubmitButton disabled={uploading} />
    </form>
  )
}
