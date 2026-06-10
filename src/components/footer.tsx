import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-display text-xl font-bold tracking-tight">rolkas<span className="text-brand">.</span></div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">Pro rolki, kampanie i wizerunek marek w social media.</p>
          </div>
          <FooterCol title="Firma" links={[["O nas", "#"], ["Portfolio", "#przyklady"], ["Kariera", "#"]]} />
          <FooterCol title="Usługi" links={[["Rolki", "#produkty"], ["Kampanie", "#rozwiazania"], ["Strategia", "#"]]} />
          <FooterCol title="Kontakt" links={[["hej@rolkas.beer", "mailto:hej@rolkas.beer"], ["Warszawa, PL", "#"]]} />
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} Rolkas. Wszystkie prawa zastrzeżone.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground">Polityka prywatności</a>
            <a href="#" className="hover:text-foreground">Regulamin</a>
            <Link to="/admin" className="hover:text-foreground">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-foreground">{title}</div>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {links.map(([label, href]) => (
          <li key={label}><a href={href} className="transition-colors hover:text-foreground">{label}</a></li>
        ))}
      </ul>
    </div>
  );
}
