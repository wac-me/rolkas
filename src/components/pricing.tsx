import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "2 990",
    desc: "Dla małych marek i lokalnych biznesów.",
    features: ["4 rolki / mc", "Scenariusz + montaż", "1 kanał social", "Raport miesięczny"],
    cta: "Zaczynamy",
    featured: false,
  },
  {
    name: "Growth",
    price: "7 490",
    desc: "Dla marek skalujących obecność w sieci.",
    features: ["12 rolek / mc", "Strategia + scenariusze", "3 kanały social", "Targetowanie reklam", "Analityka tygodniowa"],
    cta: "Wybierz Growth",
    featured: true,
  },
  {
    name: "Brand",
    price: "indywidualnie",
    desc: "Pełne kampanie 360° dla rozpoznawalnych marek.",
    features: ["Bez limitu rolek", "Dedykowany zespół", "Influencer marketing", "Custom KPI"],
    cta: "Porozmawiajmy",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="ceny" className="border-b border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-medium uppercase tracking-widest text-brand">Ceny</div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl">Prosto, bez gwiazdek</h2>
          <p className="mt-4 text-muted-foreground">Pakiety dopasowane do etapu, na którym jest Twoja marka.</p>
        </div>

        <div id="rozwiazania" className="mt-12 grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl border p-8 transition-all ${
                t.featured
                  ? "border-brand/50 bg-card glow-ring"
                  : "border-border bg-card/50 hover:border-border/80"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-0.5 text-xs font-semibold text-brand-foreground">Najpopularniejszy</span>
              )}
              <div className="font-display text-lg font-semibold">{t.name}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">{t.price}</span>
                {t.price !== "indywidualnie" && <span className="text-sm text-muted-foreground">zł / mc</span>}
              </div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#kontakt"
                className={`mt-8 block rounded-md py-2.5 text-center text-sm font-semibold transition-opacity ${
                  t.featured
                    ? "bg-brand text-brand-foreground hover:opacity-90"
                    : "border border-border bg-background hover:bg-accent"
                }`}
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
