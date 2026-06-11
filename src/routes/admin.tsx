import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus, LogOut, ShieldAlert, Eye, EyeOff, Pencil, Save, X, Upload, Loader2 } from "lucide-react";
import { Nav } from "@/components/nav";
import { resolveMediaUrl, uploadReelMedia, removeReelMedia, isHttpUrl } from "@/lib/reel-media";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Rolkas" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Reel = {
  id: string;
  title: string;
  tagline: string | null;
  cover_url: string | null;
  link_url: string | null;
  sort_order: number;
  is_visible: boolean;
};

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
      return data as Reel[];
    },
  });

  function invalidate() {
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

        <AddReelForm onAdded={invalidate} nextOrder={(reels?.length ?? 0) * 10 + 10} />

        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold">Twoje rolki ({reels?.length ?? 0})</h2>
          <div className="mt-4 grid gap-3">
            {reels?.map((r) => (
              <ReelRow key={r.id} reel={r} onChanged={invalidate} />
            ))}
            {reels && reels.length === 0 && <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Brak rolek. Dodaj pierwszą powyżej.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddReelForm({ onAdded, nextOrder }: { onAdded: () => void; nextOrder: number }) {
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [empty, setEmpty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [order, setOrder] = useState(nextOrder);

  useEffect(() => setOrder(nextOrder), [nextOrder]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return toast.error("Tytuł jest wymagany");
    setSaving(true);
    try {
      let cover_url: string | null = null;
      let link_url: string | null = null;
      if (!empty) {
        if (cover) cover_url = await uploadReelMedia("reel-covers", cover);
        if (video) link_url = await uploadReelMedia("reel-videos", video);
        else if (link.trim()) link_url = link.trim();
      }
      const { error } = await supabase.from("reels").insert({
        title: title.trim(),
        tagline: tagline.trim() || null,
        cover_url,
        link_url,
        sort_order: Number(order) || 0,
        is_visible: true,
      });
      if (error) throw error;
      toast.success("Rolka dodana");
      setTitle(""); setTagline(""); setCover(null); setVideo(null); setLink(""); setEmpty(false);
      onAdded();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd zapisu");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 rounded-2xl border border-border bg-card/60 p-6">
      <h2 className="font-display text-lg font-semibold">Dodaj rolkę</h2>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <input id="empty" type="checkbox" checked={empty} onChange={(e) => setEmpty(e.target.checked)} className="h-4 w-4 accent-brand" />
        <label htmlFor="empty" className="cursor-pointer text-muted-foreground">Pusta rolka (tylko tytuł + hasło, tło kolorowe)</label>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Tytuł *"><input required value={title} onChange={(e) => setTitle(e.target.value)} className={input} /></Field>
        <Field label="Hasło / tagline"><input value={tagline} onChange={(e) => setTagline(e.target.value)} className={input} /></Field>
        {!empty && (
          <>
            <Field label="Plik okładki (jpg/png)">
              <FileInput accept="image/*" file={cover} onChange={setCover} />
            </Field>
            <Field label="Plik rolki (mp4/webm)">
              <FileInput accept="video/*" file={video} onChange={setVideo} />
            </Field>
            <Field label="…lub link zewnętrzny (TikTok, Instagram)">
              <input type="url" placeholder="https://tiktok.com/..." value={link} onChange={(e) => setLink(e.target.value)} className={input} />
            </Field>
          </>
        )}
        <Field label="Kolejność"><input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className={input} /></Field>
      </div>
      <button disabled={saving} className="mt-4 inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}{saving ? "Zapisywanie..." : "Dodaj"}
      </button>
    </form>
  );
}

function FileInput({ accept, file, onChange }: { accept: string; file: File | null; onChange: (f: File | null) => void }) {
  return (
    <label className={`${input} flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground`}>
      <Upload className="h-4 w-4" />
      <span className="truncate">{file ? file.name : "Wybierz plik..."}</span>
      <input type="file" accept={accept} className="hidden" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
    </label>
  );
}

function ReelRow({ reel, onChanged }: { reel: Reel; onChanged: () => void }) {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState(reel.title);
  const [tagline, setTagline] = useState(reel.tagline ?? "");
  const [link, setLink] = useState(reel.link_url ?? "");
  const [order, setOrder] = useState(reel.sort_order);
  const [newCover, setNewCover] = useState<File | null>(null);
  const [newVideo, setNewVideo] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    resolveMediaUrl("reel-covers", reel.cover_url).then(setCoverPreview);
  }, [reel.cover_url]);

  async function toggleVisible() {
    setBusy(true);
    const { error } = await supabase.from("reels").update({ is_visible: !reel.is_visible }).eq("id", reel.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(reel.is_visible ? "Ukryto" : "Pokazano");
    onChanged();
  }

  async function remove() {
    if (!confirm(`Usunąć rolkę "${reel.title}"?`)) return;
    setBusy(true);
    await removeReelMedia("reel-covers", reel.cover_url);
    await removeReelMedia("reel-videos", reel.link_url);
    const { error } = await supabase.from("reels").delete().eq("id", reel.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Usunięto");
    onChanged();
  }

  async function save() {
    setBusy(true);
    try {
      let cover_url = reel.cover_url;
      let link_url: string | null = link.trim() || null;
      if (newCover) {
        if (reel.cover_url) await removeReelMedia("reel-covers", reel.cover_url);
        cover_url = await uploadReelMedia("reel-covers", newCover);
      }
      if (newVideo) {
        if (reel.link_url && !isHttpUrl(reel.link_url)) await removeReelMedia("reel-videos", reel.link_url);
        link_url = await uploadReelMedia("reel-videos", newVideo);
      }
      const { error } = await supabase.from("reels").update({
        title: title.trim(),
        tagline: tagline.trim() || null,
        cover_url,
        link_url,
        sort_order: Number(order) || 0,
      }).eq("id", reel.id);
      if (error) throw error;
      toast.success("Zapisano");
      setEditing(false); setNewCover(null); setNewVideo(null);
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd zapisu");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`rounded-xl border ${reel.is_visible ? "border-border bg-card/40" : "border-border/40 bg-card/20 opacity-60"} p-3`}>
      <div className="flex items-center gap-4">
        <div className="h-16 w-12 shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-brand/30 to-brand/10">
          {coverPreview && <img src={coverPreview} alt={reel.title} className="h-full w-full object-cover" />}
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={input} />
          ) : (
            <div className="truncate font-medium">{reel.title}</div>
          )}
          {editing ? (
            <input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="hasło / tagline" className={`${input} mt-1`} />
          ) : (
            <div className="truncate text-xs text-muted-foreground">{reel.tagline || "—"}</div>
          )}
        </div>
        {!editing && <div className="text-xs text-muted-foreground">#{reel.sort_order}</div>}
        <div className="flex items-center gap-1">
          <IconBtn title={reel.is_visible ? "Ukryj" : "Pokaż"} onClick={toggleVisible} disabled={busy}>
            {reel.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </IconBtn>
          {editing ? (
            <>
              <IconBtn title="Zapisz" onClick={save} disabled={busy} variant="brand">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              </IconBtn>
              <IconBtn title="Anuluj" onClick={() => { setEditing(false); setNewCover(null); setNewVideo(null); }}>
                <X className="h-4 w-4" />
              </IconBtn>
            </>
          ) : (
            <IconBtn title="Edytuj" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" /></IconBtn>
          )}
          <IconBtn title="Usuń" onClick={remove} disabled={busy} variant="danger"><Trash2 className="h-4 w-4" /></IconBtn>
        </div>
      </div>

      {editing && (
        <div className="mt-3 grid gap-3 border-t border-border/60 pt-3 sm:grid-cols-2">
          <Field label="Nowa okładka (zostaw puste, by nie zmieniać)">
            <FileInput accept="image/*" file={newCover} onChange={setNewCover} />
          </Field>
          <Field label="Nowy plik rolki">
            <FileInput accept="video/*" file={newVideo} onChange={setNewVideo} />
          </Field>
          <Field label="Link zewnętrzny do rolki (TikTok/IG) — nadpisuje plik">
            <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." className={input} />
          </Field>
          <Field label="Kolejność">
            <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className={input} />
          </Field>
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, onClick, title, disabled, variant }: { children: React.ReactNode; onClick: () => void; title: string; disabled?: boolean; variant?: "brand" | "danger" }) {
  const styles =
    variant === "brand" ? "border-brand/40 bg-brand/10 text-brand hover:bg-brand/20" :
    variant === "danger" ? "border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive" :
    "border-border text-muted-foreground hover:bg-accent hover:text-foreground";
  return (
    <button type="button" title={title} onClick={onClick} disabled={disabled} className={`rounded-md border p-2 transition-colors disabled:opacity-50 ${styles}`}>
      {children}
    </button>
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
