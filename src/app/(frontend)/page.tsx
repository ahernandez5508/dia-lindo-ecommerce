export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1
        className="text-4xl md:text-6xl font-display text-terracota mb-4"
        style={{ fontFamily: 'var(--font-display)', letterSpacing: 'var(--letter-spacing-brand)' }}
      >
        Día Lindo
      </h1>
      <p
        className="text-lg text-carbon/70 max-w-sm"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        Papelería Creativa — Próximamente
      </p>
    </main>
  )
}
