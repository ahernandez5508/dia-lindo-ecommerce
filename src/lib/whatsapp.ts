export const WHATSAPP_NUMBER = '5491133259416' as const

export function buildWhatsAppLink(productName: string): string {
  const text = `Hola! Quería consultar por el producto "${productName}".`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}
