import { ArrowRight, Sparkles, Target, Megaphone, BarChart3, Film, Wand2 } from "lucide-react";

const features = [
  { icon: Film, title: "Pro Rolki", desc: "Krótkie formy szyte pod TikToka, Reels i Shorts. Hook, payoff, viral potential." },
  { icon: Megaphone, title: "Kampanie", desc: "Pełne kampanie promocyjne — od strategii do dystrybucji w mediach." },
  { icon: Sparkles, title: "Wizerunek", desc: "Budujemy spójny wizerunek marki w sieci. Tone of voice, estetyka, ton." },
  { icon: Target, title: "Targetowanie", desc: "Precyzyjne targetowanie i optymalizacja, żeby każda złotówka pracowała." },
  { icon: Wand2, title: "Kreacja", desc: "Storyboardy, scenariusze, montaż, motion design i muzyka pod licencją." },
  { icon: BarChart3, title: "Analityka", desc: "Realne KPI: zasięg, engagement, CTR, konwersje. Bez bullshitu." },
];

export function Products() {
  return (
    <section id="produkty" className="border-b border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="text-xs font-medium uppercase tracking-widest text-brand">Produkty</div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl">Wszystko, czego potrzebuje marka<br className="hidden sm:block" /> w social media.</h2>
          </div>
          <a href="#kontakt" className="group inline-flex items-center gap-2 text-sm font-medium text-brand">
            Porozmawiajmy
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group relative bg-card p-6 transition-colors hover:bg-accent sm:p-8">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-brand transition-all group-hover:border-brand/40">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
