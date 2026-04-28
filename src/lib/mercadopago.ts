import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

function getClient(): MercadoPagoConfig {
  const token = process.env.MP_ACCESS_TOKEN
  if (!token) throw new Error('MP_ACCESS_TOKEN is required')
  return new MercadoPagoConfig({ accessToken: token, options: { timeout: 5000 } })
}

export function getMpPreference() {
  return new Preference(getClient())
}

export function getMpPayment() {
  return new Payment(getClient())
}
