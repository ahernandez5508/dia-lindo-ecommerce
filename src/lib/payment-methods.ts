export type PaymentMethod = 'mercadopago' | 'transferencia' | 'efectivo'

export const PAYMENT_METHODS: Record<
  PaymentMethod,
  { label: string; short: string; instructions: string }
> = {
  mercadopago: {
    label: 'MercadoPago',
    short: 'MercadoPago',
    instructions:
      'Vas a poder pagar por MercadoPago al confirmar el pedido. Te enviaremos el link de pago por email.',
  },
  transferencia: {
    label: 'Transferencia bancaria',
    short: 'Transferencia',
    // TODO-OQ2: reemplazar con CBU/alias real cuando esté disponible
    instructions:
      'Te enviaremos el CBU/alias por email para realizar la transferencia. Mandanos el comprobante por Instagram una vez realizada.',
  },
  efectivo: {
    label: 'Efectivo',
    short: 'Efectivo',
    instructions:
      'Abonás en efectivo al momento de retirar tu pedido. Coordinamos zona y horario por Instagram DM.',
  },
}
