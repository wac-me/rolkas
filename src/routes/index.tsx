import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Products } from "@/components/products";
import { ReelsGallery } from "@/components/reels-gallery";
import { Pricing } from "@/components/pricing";
import { Clients } from "@/components/clients";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rolkas — Pro rolki, kampanie i wizerunek w social media" },
      { name: "description", content: "Tworzymy pro rolki na TikToka, Instagrama, Facebooka oraz kompleksowe kampanie promocyjne dla marek." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <Clients />
        <Products />
        <ReelsGallery />
        <Pricing />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
