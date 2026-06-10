import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Menu, X, User } from "lucide-react";

const links = [
  { label: "Produkty", href: "/#produkty" },
  { label: "Rozwiązania", href: "/#rozwiazania" },
  { label: "Ceny", href: "/#ceny" },
  { label: "Kontakt", href: "/#kontakt" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="group flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-tight">rolkas<span className="text-brand">.</span></span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">{l.label}</a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setSearch((s) => !s)} aria-label="Szukaj" className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <Search className="h-4 w-4" />
          </button>
          <Link to="/auth" className="hidden items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:flex">
            <User className="h-4 w-4" />
            Login
          </Link>
          <a href="#kontakt" className="hidden rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 sm:inline-block">Zamów rolkę</a>
          <button onClick={() => setOpen((o) => !o)} aria-label="Menu" className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {search && (
        <div className="border-t border-border/60 bg-background/95 px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input autoFocus placeholder="Szukaj kampanii, rozwiązań..." className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </div>
        </div>
      )}

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="flex flex-col p-2">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">{l.label}</a>
            ))}
            <Link to="/auth" className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">Login</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
