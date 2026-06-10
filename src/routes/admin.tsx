import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus, LogOut, ShieldAlert } from "lucide-react";
import { Nav } from "@/components/nav";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Rolkas" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user.id ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user.id ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (userId === undefined) return;
    if (userId === null) { nav({ to: "/auth" }); return; }
    supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [userId, nav]);

  const { data: reels, refetch } = useQuery({
    queryKey: ["admin-reels"],
    enabled: !!isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from("reels").select("*").order("sort_order").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState({ title: "", tagline: "", cover_url: "", link_url: "", sort_order: 0 });
  const [saving, setSaving] = useState(false);

  async function addReel(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("reels").insert({
      title: form.title.trim(),
      tagline: form.tagline.trim() || null,
      cover_url: form.cover_url.trim(),
      link_url: form.link_url.trim() || null,
      sort_order: Number(form.sort_order) || 0,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Rolka dodana");
    setForm({ title: "", tagline: "", cover_url: "", link_url: "", sort_order: 0 });
    refetch();
    qc.invalidateQueries({ queryKey: ["reels"] });
  }

  async function removeReel(id: string) {
    const { error } = await supabase.from("reels").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Usunięto");
    refetch();
    qc.invalidateQueries({ queryKey: ["reels"] });
  }

  async function logout() {
    await supabase.auth.signOut();
    nav({ to: "/auth" });
  }

  if (userId === undefined || (userId && isAdmin === undefined)) {
    return <div className="min-h-screen bg-background"><Nav /><div className="p-10 text-center text-muted-foreground">Ładowanie...</div></div>;
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-brand" />
          <h1 className="mt-4 font-display text-2xl font-bold">Brak uprawnień</h1>
          <p className="mt-2 text-sm text-muted-foreground">Twoje konto nie ma roli administratora. Skontaktuj się z zespołem Rolkas, aby uzyskać dostęp.</p>
          <button onClick={logout} className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-accent"><LogOut className="h-4 w-4" />Wyloguj</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-widest text-brand">Panel</div>
            <h1 className="mt-1 font-display text-3xl font-bold">Galeria rolek</h1>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"><LogOut className="h-4 w-4" />Wyloguj</button>
        </div>

        <form onSubmit={addReel} className="mt-8 rounded-2xl border border-border bg-card/60 p-6">
          <h2 className="font-display text-lg font-semibold">Dodaj rolkę</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Tytuł *"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} /></Field>
            <Field label="Hasło / tagline"><input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={input} /></Field>
            <Field label="URL okładki *"><input required type="url" placeholder="https://..." value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} className={input} /></Field>
            <Field label="Link do rolki"><input type="url" placeholder="https://tiktok.com/..." value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} className={input} /></Field>
            <Field label="Kolejność"><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className={input} /></Field>
          </div>
          <button disabled={saving} className="mt-4 inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
            <Plus className="h-4 w-4" />{saving ? "Dodawanie..." : "Dodaj"}
          </button>
        </form>

        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold">Twoje rolki ({reels?.length ?? 0})</h2>
          <div className="mt-4 grid gap-3">
            {reels?.map((r) => (
              <div key={r.id} className="flex items-center gap-4 rounded-xl border border-border bg-card/40 p-3">
                <img src={r.cover_url} alt={r.title} className="h-16 w-12 rounded-md object-cover" onError={(e) => ((e.target as HTMLImageElement).style.opacity = "0.2")} />
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{r.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{r.tagline || r.cover_url}</div>
                </div>
                <div className="text-xs text-muted-foreground">#{r.sort_order}</div>
                <button onClick={() => removeReel(r.id)} className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            {reels && reels.length === 0 && <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Brak rolek. Dodaj pierwszą powyżej.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

const input = "w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
