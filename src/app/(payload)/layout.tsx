import React from 'react'
import '@payloadcms/next/css'

export default function PayloadLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
