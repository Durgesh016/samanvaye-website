import { About } from "@/components/sections/About";
import { Blog } from "@/components/sections/Blog";
import { Causes } from "@/components/sections/Causes";
import { Events } from "@/components/sections/Events";
import { Gallery } from "@/components/sections/Gallery";
import { Give } from "@/components/sections/Give";
import { ConstellationLink, Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Programmes } from "@/components/sections/Programmes";
import { Volunteer } from "@/components/sections/Volunteer";
import { SITE_DESCRIPTION, pageMeta } from "@/lib/seo";

/* The search result for the homepage says what the foundation is and where: Samanvaye, NGO, Rajahmundry. */
export const metadata = pageMeta({
  title: "Samanvaye Foundation | NGO in Rajahmundry, Andhra Pradesh",
  description: SITE_DESCRIPTION,
  path: "/",
});

/** The homepage. Header and footer come from app/layout.tsx. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ConstellationLink variant={0} />
      <Volunteer />
      <Programmes />
      <ConstellationLink variant={1} />
      <About />
      <ConstellationLink variant={0} />
      <Marquee />
      <Causes />
      <ConstellationLink variant={1} />
      <Give />
      <ConstellationLink variant={0} />
      <Events />
      <ConstellationLink variant={1} />
      <Gallery />
      <ConstellationLink variant={0} />
      <Blog />
    </>
  );
}
