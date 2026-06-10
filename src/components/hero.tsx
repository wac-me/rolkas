import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-noise">
      {/* Animated abstract background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute left-[10%] top-[20%] h-72 w-72 rounded-full bg-brand/30 blur-3xl animate-float-slow" />
        <div className="absolute right-[5%] top-[10%] h-96 w-96 rounded-full blur-3xl animate-float-slower" style={{ background: "color-mix(in oklab, var(--brand) 25%, transparent)" }} />
        <div className="absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-glow/20 blur-3xl animate-float-slow" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pb-24 pt-20 text-center sm:px-6 lg:px-8 lg:pb-32 lg:pt-28">
        <a href="#przyklady" className="group mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur transition-colors hover:border-brand/40 hover:text-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
          Nowe rolki w portfolio
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </a>

        <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
          <span className="text-gradient">Profesjonalne</span>
          <br />
          kampanie w <span className="text-brand-gradient">social mediach</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Tworzymy pro rolki na TikToka, Instagrama, Facebooka i więcej. Kampanie promocyjne i wizerunek marki, który zatrzymuje kciuk.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <a href="#kontakt" className="group inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.02]">
            Zamów teraz
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a href="#przyklady" className="inline-flex items-center gap-2 rounded-md border border-border bg-card/50 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-accent">
            <Play className="h-4 w-4" />
            Zobacz przykłady
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 text-left sm:gap-16">
          {[
            { v: "120M+", l: "wyświetleń" },
            { v: "300+", l: "rolek" },
            { v: "40+", l: "marek" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-2xl font-bold sm:text-3xl">{s.v}</div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
