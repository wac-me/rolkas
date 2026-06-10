import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Nav } from "@/components/nav";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Login — Rolkas" }, { name: "description", content: "Zaloguj się do panelu Rolkas." }] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/admin" });
    });
  }, [nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const fn = mode === "signin"
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    const { error } = await fn;
    setLoading(false);
    if (error) return toast.error(error.message);
    if (mode === "signup") toast.success("Konto utworzone. Możesz się zalogować.");
    else nav({ to: "/admin" });
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="relative flex items-center justify-center px-4 py-20">
        <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative w-full max-w-md rounded-2xl border border-border bg-card/60 p-8 shadow-[var(--shadow-card)] backdrop-blur">
          <h1 className="font-display text-2xl font-bold">{mode === "signin" ? "Zaloguj się" : "Utwórz konto"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Panel administracyjny Rolkas.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-border bg-input/40 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/40" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Hasło</span>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-border bg-input/40 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/40" />
            </label>
            <button disabled={loading} className="w-full rounded-md bg-brand py-2.5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
              {loading ? "..." : mode === "signin" ? "Zaloguj się" : "Utwórz konto"}
            </button>
          </form>
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground">
            {mode === "signin" ? "Nie masz konta? Zarejestruj się" : "Masz już konto? Zaloguj się"}
          </button>
        </div>
      </div>
    </div>
  );
}
