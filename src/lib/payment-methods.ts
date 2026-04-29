export type PaymentMethod = 'mercadopago' | 'transferencia'

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
}
