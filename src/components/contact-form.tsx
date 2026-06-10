import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send } from "lucide-react";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error("Nie udało się wysłać. Spróbuj ponownie.");
      return;
    }
    toast.success("Wiadomość wysłana! Odezwiemy się wkrótce.");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <section id="kontakt" className="relative border-b border-border/60 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="text-xs font-medium uppercase tracking-widest text-brand">Kontakt</div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl">Napisz do nas</h2>
          <p className="mt-4 max-w-md text-muted-foreground">Powiedz, co chcesz osiągnąć. Odpowiadamy w ciągu 24h z konkretnym planem i wyceną.</p>

          <div className="mt-10 space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 bg-brand" />
              <a href="mailto:hej@rolkas.beer" className="text-muted-foreground transition-colors hover:text-foreground">hej@rolkas.beer</a>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 bg-brand/40" />
              <span className="text-muted-foreground">Warszawa · Online · Cały świat</span>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card/50 p-6 shadow-[var(--shadow-card)] backdrop-blur sm:p-8">
          <div className="grid gap-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Imię</span>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border border-border bg-input/40 px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand/40" placeholder="Jan Kowalski" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</span>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-md border border-border bg-input/40 px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand/40" placeholder="jan@firma.pl" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Wiadomość</span>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full resize-none rounded-md border border-border bg-input/40 px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand/40" placeholder="Opowiedz o projekcie..." />
            </label>
            <button type="submit" disabled={loading} className="group inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
              {loading ? "Wysyłanie..." : "Wyślij wiadomość"}
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
