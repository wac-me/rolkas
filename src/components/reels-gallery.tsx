import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Play } from "lucide-react";

const fallback = [
  { id: "f1", title: "Hot drop", tagline: "Zobacz zanim zniknie", cover_url: "", link_url: null },
  { id: "f2", title: "Smaki lata", tagline: "30 sekund, które smakują", cover_url: "", link_url: null },
  { id: "f3", title: "Brand launch", tagline: "Wejście, którego nie zignorujesz", cover_url: "", link_url: null },
  { id: "f4", title: "Behind the scenes", tagline: "Tak powstaje viral", cover_url: "", link_url: null },
  { id: "f5", title: "Mini serial", tagline: "5 odsłon, 5M wyświetleń", cover_url: "", link_url: null },
  { id: "f6", title: "User Generated", tagline: "Społeczność robi robotę", cover_url: "", link_url: null },
];

const palettes = [
  "from-[oklch(0.7_0.2_165)] to-[oklch(0.5_0.2_280)]",
  "from-[oklch(0.7_0.22_30)] to-[oklch(0.5_0.2_330)]",
  "from-[oklch(0.75_0.18_90)] to-[oklch(0.55_0.22_30)]",
  "from-[oklch(0.7_0.2_200)] to-[oklch(0.5_0.2_260)]",
  "from-[oklch(0.7_0.22_340)] to-[oklch(0.55_0.2_30)]",
  "from-[oklch(0.7_0.2_150)] to-[oklch(0.5_0.2_200)]",
];

export function ReelsGallery() {
  const { data } = useQuery({
    queryKey: ["reels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reels")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const items = (data && data.length > 0 ? data : fallback) as typeof fallback;
  const loop = [...items, ...items];

  return (
    <section id="przyklady" className="border-b border-border/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-widest text-brand">Portfolio</div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl">Rolki, które działają</h2>
          </div>
          <p className="hidden max-w-sm text-sm text-muted-foreground sm:block">Wybór z naszych ostatnich kampanii. Przewiń, żeby zobaczyć więcej.</p>
        </div>
      </div>

      <div className="group/marquee mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max gap-5 animate-marquee group-hover/marquee:[animation-play-state:paused]">
          {loop.map((r, i) => {
            const palette = palettes[i % palettes.length];
            return (
              <a
                key={`${r.id}-${i}`}
                href={r.link_url || "#"}
                target={r.link_url ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group relative block aspect-[9/16] w-[220px] shrink-0 overflow-hidden rounded-xl border border-border bg-card sm:w-[260px]"
              >
                {r.cover_url ? (
                  <img src={r.cover_url} alt={r.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${palette}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute right-3 top-3 rounded-full bg-black/40 p-2 backdrop-blur">
                  <Play className="h-3.5 w-3.5 fill-white text-white" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="font-display text-lg font-bold leading-tight text-white">{r.title}</div>
                  {r.tagline && <div className="mt-1 text-xs text-white/70">{r.tagline}</div>}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
