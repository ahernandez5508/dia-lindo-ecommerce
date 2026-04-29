'use client'
import { useEffect, useRef, useState } from 'react'
import { useActionState } from 'react'
import { useUploadThing } from '@/lib/uploadthing'
import { deleteUploadthingFile } from './actions'

type ImageItem =
  | { type: 'uploaded'; url: string }
  | { type: 'pending'; file: File; preview: string }

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


interface Props {
  action: (state: State, formData: FormData) => Promise<State>
  categories: Category[]
  defaultValues?: Partial<ProductValues>
}

export default function ProductForm({ action, categories, defaultValues }: Props) {
  const [state, formAction] = useActionState(action, null)
  const formRef = useRef<HTMLFormElement>(null)
  const hiddenImagesRef = useRef<HTMLInputElement>(null)

  const [items, setItems] = useState<ImageItem[]>(() => {
    if (!defaultValues?.images) return []
    try {
      const parsed = JSON.parse(defaultValues.images)
      if (!Array.isArray(parsed)) return []
      return parsed
        .filter((u: unknown): u is string => typeof u === 'string' && u.length > 0)
        .map((url: string) => ({ type: 'uploaded' as const, url }))
    } catch {
      return []
    }
  })

  const [uploadError, setUploadError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Resetea submitting cuando la server action devuelve un error (sin redirect)
  useEffect(() => {
    if (state?.error) setSubmitting(false)
  }, [state])

  const { startUpload, isUploading } = useUploadThing('productImage', {
    onUploadError: (err) => {
      const msg = err.message?.toLowerCase() ?? ''
      if (msg.includes('size') || msg.includes('large') || msg.includes('limit')) {
        setUploadError('Una imagen supera el tamaño máximo de 16 MB.')
      } else {
        setUploadError('No se pudo subir la imagen. Intentá de nuevo.')
      }
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    const newItems: ImageItem[] = files.map(file => ({
      type: 'pending',
      file,
      preview: URL.createObjectURL(file),
    }))
    setItems(prev => [...prev, ...newItems])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeItem = (i: number) => {
    const item = items[i]
    if (item.type === 'uploaded') {
      deleteUploadthingFile(item.url)
    } else {
      URL.revokeObjectURL(item.preview)
    }
    setItems(prev => prev.filter((_, idx) => idx !== i))
  }

  const moveUp = (i: number) => {
    if (i === 0) return
    setItems(prev => {
      const next = [...prev]
      ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
      return next
    })
  }

  const moveDown = (i: number) => {
    setItems(prev => {
      if (i === prev.length - 1) return prev
      const next = [...prev]
      ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
      return next
    })
  }

  const handleSave = async () => {
    if (!formRef.current || submitting || isUploading) return
    setSubmitting(true)
    setUploadError(null)

    try {
      type PendingItem = Extract<ImageItem, { type: 'pending' }>
      const pendingItems = items.filter((item): item is PendingItem => item.type === 'pending')
      let uploadResults: { url: string }[] = []

      if (pendingItems.length > 0) {
        const res = await startUpload(pendingItems.map(i => i.file))
        if (!res || res.length !== pendingItems.length) {
          setUploadError('Error al subir las imágenes. Intentá de nuevo.')
          setSubmitting(false)
          return
        }
        uploadResults = res
        pendingItems.forEach(item => URL.revokeObjectURL(item.preview))
      }

      let pendingIdx = 0
      const finalUrls = items.map(item => {
        if (item.type === 'uploaded') return item.url
        return uploadResults[pendingIdx++]?.url ?? null
      }).filter((u): u is string => u !== null)

      if (hiddenImagesRef.current) {
        hiddenImagesRef.current.value = JSON.stringify(finalUrls)
      }

      // requestSubmit() dispara action={formAction} de forma nativa
      // Next.js maneja el redirect() correctamente por esta vía
      formRef.current.requestSubmit()
    } catch {
      setUploadError('Error al subir las imágenes. Intentá de nuevo.')
      setSubmitting(false)
    }
  }

  const displayUrl = (item: ImageItem) =>
    item.type === 'uploaded' ? item.url : item.preview

  const busy = isUploading || submitting

  return (
    <form ref={formRef} action={formAction} className="space-y-4 max-w-lg">
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

        {items.length > 0 && (
          <ul className="space-y-2 mb-3">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-2 border border-salmon/20 rounded-lg p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayUrl(item)}
                  alt={`Imagen ${i + 1}`}
                  className="w-14 h-14 object-cover rounded"
                />
                <span className="flex-1 text-xs text-gray-500 truncate">
                  {item.type === 'pending' ? item.file.name : item.url}
                </span>
                {item.type === 'pending' && (
                  <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                    pendiente
                  </span>
                )}
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
                    disabled={i === items.length - 1}
                    className="px-2 py-0.5 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-30"
                    aria-label="Mover abajo"
                  >
                    ↓
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="px-2 py-1 text-sm border border-salmon/30 rounded-lg hover:bg-salmon/10 transition"
                  aria-label="Quitar imagen"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer transition ${busy ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}>
          <span className="text-sm text-gray-500">
            {isUploading ? 'Subiendo...' : 'Hacé clic para seleccionar imágenes'}
          </span>
          <span className="text-xs text-gray-400">PNG, JPG, WEBP · máx. 16 MB · hasta 8 imágenes</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={busy}
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {uploadError && (
          <p className="mt-2 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {uploadError}
          </p>
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

      <input ref={hiddenImagesRef} type="hidden" name="images" value="[]" />

      <button
        type="button"
        onClick={handleSave}
        disabled={busy}
        className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
      >
        {busy ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}
