import { buildWhatsAppLink } from '@/lib/whatsapp'

interface Props {
  productName: string
}

export default function WhatsAppCTA({ productName }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="inline-flex items-center gap-2 bg-sage/20 text-sage px-3 py-1.5 rounded-full text-xs font-medium w-fit">
        <span>✦</span>
        <span>Producto personalizable</span>
      </div>
      <a
        href={buildWhatsAppLink(productName)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Consultar por WhatsApp sobre ${productName}`}
        className="w-full bg-terracota text-crema py-3 rounded-full text-sm font-medium text-center hover:bg-terracota/90 transition-colors"
      >
        💬 Consultá por WhatsApp
      </a>
      <p className="text-xs text-carbon/50 text-center">Te respondemos en el día</p>
    </div>
  )
}
