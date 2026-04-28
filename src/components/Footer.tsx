import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="border-t border-salmon/20 bg-crema px-6 py-10">
      <div className="flex flex-col items-center gap-4 text-center">
        <Image
          src="/images/logo.webp"
          alt="Día Lindo"
          width={120}
          height={120}
          className="object-contain"
        />

        <p
          aria-hidden="true"
          className="text-lg text-terracota"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Día Lindo
        </p>

        <p className="text-sm text-carbon/70" style={{ fontFamily: 'var(--font-body)' }}>
          Papelería creativa para momentos especiales
        </p>

        <a
          href="https://www.instagram.com/dialindo.kitsdefiesta/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Seguinos en Instagram @dialindo.kitsdefiesta"
          className="text-sm font-medium text-terracota hover:text-terracota/80 transition-colors"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Seguinos en Instagram
        </a>

        <p className="text-xs text-carbon/50" style={{ fontFamily: 'var(--font-body)' }}>
          Retiros coordinados por Instagram DM
        </p>

        <p aria-hidden="true" className="text-xs text-carbon/40" style={{ fontFamily: 'var(--font-body)' }}>
          © 2025 Día Lindo — Papelería Creativa
        </p>
      </div>
    </footer>
  )
}
