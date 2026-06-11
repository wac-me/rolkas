import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import AutoScroll from "embla-carousel-auto-scroll";
import { supabase } from "@/integrations/supabase/client";
import { Play } from "lucide-react";
import { resolveMediaUrl } from "@/lib/reel-media";

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
        .eq("is_visible", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      const resolved = await Promise.all(
        (data ?? []).map(async (r) => ({
          ...r,
          coverSrc: await resolveMediaUrl("reel-covers", r.cover_url),
          videoSrc: await resolveMediaUrl("reel-videos", r.link_url),
        })),
      );
      return resolved;
    },
  });

  const [emblaRef] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      dragFree: true,
    },
    [
      WheelGesturesPlugin(),
      AutoScroll({ speed: 0.8, startDelay: 0, stopOnInteraction: false, stopOnMouseEnter: true }),
    ],
  );

  const items = data ?? [];
  if (items.length === 0) return null;

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

      <div className="mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div ref={emblaRef} className="cursor-grab active:cursor-grabbing">
          <div className="flex gap-5">
            {items.map((r, i) => {
              const palette = palettes[i % palettes.length];
              const isVideo = r.videoSrc && !/^https?:\/\/(www\.)?(tiktok|instagram|facebook|youtube|youtu)/i.test(r.videoSrc);
              const href = r.videoSrc && /^https?:/i.test(r.videoSrc) ? r.videoSrc : undefined;
              return (
                <a
                  key={r.id}
                  href={href || "#"}
                  target={href ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group relative block aspect-[9/16] w-[220px] shrink-0 select-none overflow-hidden rounded-xl border border-border bg-card sm:w-[260px]"
                  draggable={false}
                >
                  {isVideo ? (
                    <video src={r.videoSrc!} poster={r.coverSrc ?? undefined} muted loop playsInline autoPlay className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
                  ) : r.coverSrc ? (
                    <img src={r.coverSrc} alt={r.title} draggable={false} className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
      </div>
    </section>
  );
}
