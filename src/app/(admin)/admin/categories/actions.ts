'use server'
import { db } from '@/db'
import { categories } from '@/db/schema'
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

export async function createCategory(_: State, formData: FormData): Promise<State> {
  const name = (formData.get('name') as string)?.trim()
  if (!name) return { error: 'El nombre es requerido' }
  try {
    await db.insert(categories).values({ name, slug: toSlug(name) })
  } catch {
    return { error: 'Ya existe una categoría con ese nombre' }
  }
  redirect('/admin/categories')
}

export async function updateCategory(id: number, _: State, formData: FormData): Promise<State> {
  const name = (formData.get('name') as string)?.trim()
  if (!name) return { error: 'El nombre es requerido' }
  try {
    await db.update(categories).set({ name, slug: toSlug(name) }).where(eq(categories.id, id))
  } catch {
    return { error: 'Ya existe una categoría con ese nombre' }
  }
  redirect('/admin/categories')
}

export async function deleteCategory(formData: FormData) {
  const id = Number(formData.get('id'))
  try {
    await db.delete(categories).where(eq(categories.id, id))
  } catch {
    // productos asociados — ignorar silenciosamente por ahora
  }
  revalidatePath('/admin/categories')
}
