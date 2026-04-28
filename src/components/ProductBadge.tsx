type Props = {
  variant: 'custom'
  position?: 'top-left' | 'top-right'
}

export default function ProductBadge({ position = 'top-left' }: Props) {
  const posClass = position === 'top-right' ? 'top-2 right-2' : 'top-2 left-2'
  return (
    <span
      className={`absolute ${posClass} bg-sage text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-medium shadow-sm`}
    >
      Personalizable
    </span>
  )
}
