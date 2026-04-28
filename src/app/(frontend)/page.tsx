import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/db'
import { products, categories } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

const FEATURES = [
  { icon: '✦', text: 'Diseño original' },
  { icon: '♥', text: 'Hecho con amor' },
  { icon: '★', text: 'Retiro en persona' },
  { icon: '✦', text: 'Alta calidad' },
]

export default async function HomePage() {
  const [cats, featured] = await Promise.all([
    db.select().from(categories).orderBy(categories.name),
    db.select().from(products).where(eq(products.active, true)).orderBy(desc(products.createdAt)).limit(4),
  ])

  return (
    <main className="flex-1">
      {/* Hero */}
      <section
        style={{
          background:
            'linear-gradient(135deg, var(--color-crema) 0%, color-mix(in srgb, var(--color-amarillo) 53%, transparent) 60%, color-mix(in srgb, var(--color-salmon) 34%, transparent) 100%)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-8 md:px-16 py-20 max-w-6xl mx-auto">
          {/* Left: copy */}
          <div>
            <p
              className="text-sage text-xs font-bold tracking-[0.2em] uppercase mb-4 animate-fade-in-up"
              style={{ animationDelay: '0ms' }}
            >
              PAPELERÍA CREATIVA ✦
            </p>
            <h1
              className="text-5xl md:text-6xl text-carbon leading-tight mb-6 animate-fade-in-up"
              style={{
                fontFamily: 'var(--font-display)',
                animationDelay: '100ms',
              }}
            >
              Cada día<br />
              es un{' '}
              <em className="text-terracota not-italic italic">Día Lindo</em>
            </h1>
            <p
              className="text-carbon/60 text-sm leading-relaxed mb-8 max-w-md animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              Papelería creativa y kits de fiesta para momentos especiales. Cada pieza está diseñada con amor para hacer tus celebraciones únicas.
            </p>
            <div
              className="flex flex-wrap gap-4 animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <Link
                href="/tienda"
                className="bg-terracota text-crema px-8 py-4 rounded-full text-xs font-bold tracking-widest hover:opacity-90 transition-all hover:-translate-y-0.5 inline-block"
              >
                VER TIENDA
              </Link>
              <Link
                href="/tienda"
                className="border border-carbon/20 text-carbon px-7 py-4 rounded-full text-xs font-semibold tracking-wider hover:border-terracota hover:text-terracota transition-all inline-block"
              >
                Ver todo
              </Link>
            </div>
          </div>

          {/* Right: decorative SVG */}
          <div className="hidden md:flex items-center justify-center">
            <svg
              width="400"
              height="360"
              viewBox="0 0 400 360"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              {/* Main notebook block */}
              <rect x="80" y="60" width="160" height="200" rx="12" fill="#C65A2E" opacity="0.9" />
              <rect x="88" y="68" width="144" height="184" rx="8" fill="#F2E8DC" opacity="0.8" />
              {/* Notebook lines */}
              <line x1="104" y1="110" x2="216" y2="110" stroke="#C65A2E" strokeWidth="2" strokeOpacity="0.3" />
              <line x1="104" y1="130" x2="216" y2="130" stroke="#C65A2E" strokeWidth="2" strokeOpacity="0.3" />
              <line x1="104" y1="150" x2="196" y2="150" stroke="#C65A2E" strokeWidth="2" strokeOpacity="0.3" />
              <line x1="104" y1="170" x2="210" y2="170" stroke="#C65A2E" strokeWidth="2" strokeOpacity="0.3" />
              {/* Spine */}
              <rect x="80" y="60" width="16" height="200" rx="4" fill="#A3401E" opacity="0.8" />
              {/* Sticker circle */}
              <circle cx="270" cy="80" r="44" fill="#F4E3B2" opacity="0.95" />
              <circle cx="270" cy="80" r="36" fill="#A3B18A" opacity="0.6" />
              <text x="270" y="86" textAnchor="middle" fontSize="20" fill="#3A3A3A" opacity="0.8">★</text>
              {/* Small card */}
              <rect x="220" y="180" width="100" height="70" rx="8" fill="#E6B8A2" opacity="0.9" />
              <line x1="234" y1="200" x2="306" y2="200" stroke="#C65A2E" strokeWidth="1.5" strokeOpacity="0.5" />
              <line x1="234" y1="214" x2="298" y2="214" stroke="#C65A2E" strokeWidth="1.5" strokeOpacity="0.5" />
              {/* Sparkles */}
              <text x="340" y="160" fontSize="22" fill="#C65A2E" opacity="0.7">✦</text>
              <text x="58" y="280" fontSize="16" fill="#A3B18A" opacity="0.8">✦</text>
              <text x="310" y="270" fontSize="12" fill="#F4E3B2" opacity="0.9">★</text>
              <text x="140" y="290" fontSize="18" fill="#C65A2E" opacity="0.4">✦</text>
              {/* Pencil */}
              <rect x="290" y="100" width="10" height="70" rx="3" fill="#F4E3B2" stroke="#C65A2E" strokeWidth="1.5" />
              <polygon points="290,170 300,170 295,188" fill="#3A3A3A" opacity="0.7" />
              <rect x="290" y="100" width="10" height="12" rx="2" fill="#E6B8A2" />
            </svg>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <div className="bg-carbon py-3 px-8">
        <div className="flex flex-wrap gap-8 justify-center">
          {FEATURES.map((f, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="text-amarillo text-base">{f.icon}</span>
              <span className="text-white text-xs font-medium tracking-wider">{f.text}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Categorías */}
      {cats.length > 0 && (
        <section className="px-8 md:px-16 py-10 border-t border-salmon/20 max-w-6xl mx-auto">
          <h2
            className="text-2xl text-carbon mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Categorías
          </h2>
          <div className="flex gap-0 border-b border-salmon/20 overflow-x-auto">
            {cats.map(cat => (
              <Link
                key={cat.id}
                href={`/tienda?categoria=${cat.slug}`}
                className="px-5 py-3 text-sm text-carbon/50 font-medium whitespace-nowrap border-b-2 border-transparent hover:text-terracota hover:border-terracota/40 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Destacados */}
      {featured.length > 0 && (
        <section className="px-8 md:px-16 py-12 max-w-6xl mx-auto">
          <h2
            className="text-2xl text-carbon mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Destacados
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featured.map(p => {
              const img = p.images
                ? (() => { try { return JSON.parse(p.images!)[0] } catch { return null } })()
                : null
              return (
                <Link key={p.id} href={`/tienda/${p.slug}`} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-square bg-salmon/20 overflow-hidden">
                      {img ? (
                        <Image
                          src={img}
                          alt={p.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-carbon/20 text-xs">Sin imagen</div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-display text-base font-semibold text-carbon leading-snug mb-3">{p.name}</p>
                      <p className="text-xl font-bold text-terracota">${Number(p.price).toLocaleString('es-AR')}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}
