'use client'
import { PAYMENT_METHODS, type PaymentMethod } from '@/lib/payment-methods'
import { useState } from 'react'

const CAPTIONS: Record<PaymentMethod, string> = {
  mercadopago: 'link de pago al confirmar',
  transferencia: 'CBU/Alias en confirmación',
  efectivo: 'al retirar',
}

const METHODS = Object.keys(PAYMENT_METHODS) as PaymentMethod[]

export default function PaymentMethodRadio() {
  const [selected, setSelected] = useState<PaymentMethod | ''>('')

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-carbon/70 mb-2">
        Método de pago <span className="text-terracota">*</span>
      </legend>
      {METHODS.map((value) => (
        <label
          key={value}
          className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
            selected === value
              ? 'border-terracota bg-terracota/5'
              : 'border-salmon/40 hover:border-terracota/50'
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={value}
            required
            checked={selected === value}
            onChange={() => setSelected(value)}
            className="accent-terracota"
          />
          <span className="text-sm text-carbon">
            <span className="font-medium">{PAYMENT_METHODS[value].label}</span>
            <span className="text-carbon/50"> — {CAPTIONS[value]}</span>
          </span>
        </label>
      ))}
    </fieldset>
  )
}
