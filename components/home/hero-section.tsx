import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#1a3857]/5 -z-10 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#1a3857]/5 -z-10 blur-3xl"></div>

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              WebnD Merch Store
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              Wear your passion for design. Exclusive merchandise from Web and Design Society.
            </p>
          </div>
          <div className="space-x-4">
            <Link href="#featured">
              <Button className="bg-[#1a3857] hover:bg-[#0f2540]">Shop Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
