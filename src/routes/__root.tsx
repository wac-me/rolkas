import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <p className="mt-4 text-muted-foreground">Strona nie istnieje.</p>
        <a href="/" className="mt-6 inline-block rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground">Wróć na stronę główną</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Coś poszło nie tak</h1>
        <p className="mt-2 text-sm text-muted-foreground">Spróbuj odświeżyć stronę.</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground">Spróbuj ponownie</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Rolkas — Profesjonalne kampanie w social media" },
      { name: "description", content: "Rolkas tworzy profesjonalne rolki, kampanie promocyjne i wizerunek marki w TikTok, Instagram, Facebook i nie tylko." },
      { property: "og:title", content: "Rolkas — Profesjonalne kampanie w social media" },
      { property: "og:description", content: "Rolkas tworzy profesjonalne rolki, kampanie promocyjne i wizerunek marki w TikTok, Instagram, Facebook i nie tylko." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Rolkas — Profesjonalne kampanie w social media" },
      { name: "twitter:description", content: "Rolkas tworzy profesjonalne rolki, kampanie promocyjne i wizerunek marki w TikTok, Instagram, Facebook i nie tylko." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d890d0a9-4e7d-40e8-8670-f121ce58092f" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d890d0a9-4e7d-40e8-8670-f121ce58092f" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
