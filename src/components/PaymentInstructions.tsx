import { PAYMENT_METHODS, type PaymentMethod } from '@/lib/payment-methods'

interface Props {
  method: PaymentMethod
}

export default function PaymentInstructions({ method }: Props) {
  const entry = (PAYMENT_METHODS as Record<string, { label: string; instructions: string }>)[method] ?? {
    label: method,
    instructions: 'Coordinaremos los detalles del pago contigo.',
  }
  const { label, instructions } = entry

  return (
    <div className="w-full max-w-md border border-salmon/40 rounded-xl px-5 py-4 bg-crema/50 text-left">
      <p className="text-xs text-carbon/50 uppercase tracking-widest mb-1">Pago</p>
      <p className="text-sm font-medium text-carbon mb-2">{label}</p>
      <p className="text-sm text-carbon/70 leading-relaxed">{instructions}</p>
    </div>
  )
}
