import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-carbon text-white px-8 md:px-16 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Col 1: Logo + tagline */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/images/logo.webp"
              alt="Día Lindo"
              width={56}
              height={56}
              className="object-contain mb-3"
            />
            <p className="text-sm text-white/50 leading-relaxed max-w-[180px]">
              Papelería creativa para momentos especiales.
            </p>
          </div>

          {/* Col 2: Tienda */}
          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-amarillo mb-4 uppercase">
              Tienda
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/tienda" className="text-sm text-white/50 hover:text-white transition-colors">
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link href="/carrito" className="text-sm text-white/50 hover:text-white transition-colors">
                  Mi carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Nosotras */}
          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-amarillo mb-4 uppercase">
              Nosotras
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="https://www.instagram.com/dialindo.kitsdefiesta/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Ayuda */}
          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-amarillo mb-4 uppercase">
              Ayuda
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <span className="text-sm text-white/50">Solo retiro en persona</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © 2026 Día Lindo — Papelería Creativa
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/dialindo.kitsdefiesta/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors text-sm"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
