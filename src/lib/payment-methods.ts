export type PaymentMethod = 'mercadopago' | 'transferencia' | 'efectivo'

export const PAYMENT_METHODS: Record<
  PaymentMethod,
  { label: string; short: string; instructions: string }
> = {
  mercadopago: {
    label: 'MercadoPago',
    short: 'MercadoPago',
    instructions:
      'Te vamos a enviar el link de pago de MercadoPago por Instagram DM para que puedas completar tu compra.',
  },
  transferencia: {
    label: 'Transferencia bancaria',
    short: 'Transferencia',
    instructions:
      'Te enviaremos el CBU/alias por Instagram DM para realizar la transferencia. Mandanos el comprobante una vez realizada.',
  },
  efectivo: {
    label: 'Efectivo',
    short: 'Efectivo',
    instructions:
      'Abonás en efectivo al momento de retirar tu pedido. Coordinamos zona y horario por Instagram DM.',
  },
}
