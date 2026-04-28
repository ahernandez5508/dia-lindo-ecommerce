'use server'
import { db } from '@/db'
import { products } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type State = { error?: string } | null

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function createProduct(_: State, formData: FormData): Promise<State> {
  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const price = formData.get('price') as string
  const stock = formData.get('stock') as string
  const categoryId = formData.get('categoryId') as string
  const active = formData.get('active') === 'on'
  const customizable = formData.get('customizable') === 'on'
  const imageUrl = (formData.get('imageUrl') as string)?.trim()

  if (!name) return { error: 'El nombre es requerido' }
  if (!price || isNaN(Number(price))) return { error: 'El precio es inválido' }

  try {
    await db.insert(products).values({
      name,
      slug: toSlug(name),
      description: description || null,
      price,
      stock: Number(stock) || 0,
      categoryId: categoryId ? Number(categoryId) : null,
      images: imageUrl ? JSON.stringify([imageUrl]) : null,
      active,
      customizable,
    })
  } catch {
    return { error: 'Ya existe un producto con ese nombre' }
  }
  redirect('/admin/products')
}

export async function updateProduct(id: number, _: State, formData: FormData): Promise<State> {
  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const price = formData.get('price') as string
  const stock = formData.get('stock') as string
  const categoryId = formData.get('categoryId') as string
  const active = formData.get('active') === 'on'
  const customizable = formData.get('customizable') === 'on'
  const imageUrl = (formData.get('imageUrl') as string)?.trim()

  if (!name) return { error: 'El nombre es requerido' }
  if (!price || isNaN(Number(price))) return { error: 'El precio es inválido' }

  try {
    await db
      .update(products)
      .set({
        name,
        slug: toSlug(name),
        description: description || null,
        price,
        stock: Number(stock) || 0,
        categoryId: categoryId ? Number(categoryId) : null,
        images: imageUrl ? JSON.stringify([imageUrl]) : null,
        active,
        customizable,
      })
      .where(eq(products.id, id))
  } catch {
    return { error: 'Ya existe un producto con ese nombre' }
  }
  redirect('/admin/products')
}

export async function deleteProduct(formData: FormData) {
  const id = Number(formData.get('id'))
  await db.delete(products).where(eq(products.id, id))
  revalidatePath('/admin/products')
}
