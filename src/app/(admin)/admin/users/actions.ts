'use server'
import bcryptjs from 'bcryptjs'
import { db } from '@/db'
import { adminUsers } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

type State = { error?: string; success?: string } | null

export async function createAdminUser(_: State, formData: FormData): Promise<State> {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = (formData.get('password') as string) ?? ''
  const name = (formData.get('name') as string)?.trim() || null

  if (!email) return { error: 'El email es requerido' }
  if (!password || password.length < 8) return { error: 'La contraseña debe tener al menos 8 caracteres' }

  // Check uniqueness
  const [existing] = await db.select({ id: adminUsers.id }).from(adminUsers).where(eq(adminUsers.email, email)).limit(1)
  if (existing) return { error: 'Ya existe un usuario con ese email' }

  const hashed = await bcryptjs.hash(password, 12)

  await db.insert(adminUsers).values({
    id: crypto.randomUUID(),
    email,
    password: hashed,
    name,
  })

  revalidatePath('/admin/users')
  return { success: 'Usuario creado correctamente' }
}
