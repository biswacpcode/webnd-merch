import { HeroSection } from "@/components/home/hero-section"
import { FeaturedSection } from "@/components/home/featured"
import { TeamSection } from "@/components/home/team"
//import { RandomPopup } from "@/components/random-popup"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* <HeroSection /> */}
      <FeaturedSection />
      <TeamSection />
    </main>
  )
}
