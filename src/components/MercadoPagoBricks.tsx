'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { initMercadoPago, Payment } from '@mercadopago/sdk-react'

type Props = {
  preferenceId: string
  publicKey: string
  orderId: number
  amount: number
}

export default function MercadoPagoBricks({ preferenceId, publicKey, orderId, amount }: Props) {
  const router = useRouter()
  const initialized = useRef(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialized.current) return
    initMercadoPago(publicKey, { locale: 'es-AR' })
    initialized.current = true
  }, [publicKey])

  return (
    <div className="w-full">
      {error && (
        <p className="text-sm text-red-600 mb-4 p-3 bg-red-50 rounded-lg">{error}</p>
      )}
      <Payment
        initialization={{ preferenceId, amount }}
        customization={{
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
            mercadoPago: 'all',
            maxInstallments: 1,
          },
        }}
        onSubmit={async () => {
          router.push(`/checkout/confirmacion/${orderId}?status=approved`)
        }}
        onError={(err) => {
          console.error('[MP Brick]', err)
          setError('Ocurrió un error al procesar el pago. Por favor intentá de nuevo.')
        }}
        onReady={() => {}}
      />
    </div>
  )
}
