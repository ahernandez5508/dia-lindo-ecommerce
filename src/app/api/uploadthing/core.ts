import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
import { auth } from '@/auth'

const f = createUploadthing()

export const ourFileRouter = {
  productImage: f({
    image: { maxFileSize: '4MB', maxFileCount: 8 },
  })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user?.email) throw new UploadThingError('Unauthorized')
      return { userEmail: session.user.email }
    })
    .onUploadComplete(({ file }) => ({ url: file.url, key: file.key })),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
