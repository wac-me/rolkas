const clients = ["IBM", "TESLA", "NETFLIX", "PKO", "SPOTIFY", "NIKE"];

export function Clients() {
  return (
    <section className="border-b border-border/60 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">Zaufali nam</p>
        <div className="mt-8 grid grid-cols-3 items-center gap-8 sm:grid-cols-6">
          {clients.map((c) => (
            <div key={c} className="text-center font-display text-xl font-bold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground sm:text-2xl">
              {c}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
