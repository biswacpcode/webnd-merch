'use client'
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import { useState } from "react"

export function FeaturedSection() {

  
  const [imageLoaded, setImageLoaded] = useState(false)
  return (
    <section id="featured" className="w-full py-16 md:py-24 lg:py-32 bg-gray-50 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#1a3857]/10 rounded-bl-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#1a3857]/10 rounded-tr-full -z-10"></div>

      <div className="container max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Heading */}
          <div className="space-y-5">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="h-6 w-6 text-[#1a3857]" />
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">Featured Products</h2>
              <Sparkles className="h-6 w-6 text-[#1a3857]" />
            </div>
            <p className="max-w-2xl text-muted-foreground text-lg md:text-xl">
              Check out our latest merchandise collection, crafted with love!
            </p>
          </div>

          {/* Products */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-10 mt-12 md:w-[30dvw] w-[80dvw]">
            {/* Product 1 */}
            <Link href="/buy/webnd-merch" className="group">
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image
                    src="/ver2webnd.png"
                    alt="WebnD Merch T-shirt"
                    fill
                    className="object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
                  />

{!imageLoaded && <Skeleton className="w-full h-full absolute inset-0" />}
            <Image
              src="/ver2webnd.png"
              alt="WebnD Merch T-shirt"
              fill
              className="object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
              onLoad={() => setImageLoaded(true)}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
                  <Badge className="absolute top-4 right-4 bg-[#1a3857] text-white text-xs py-1 px-3 rounded-full shadow-md">
                    Bestseller
                  </Badge>
                </div>
                <CardContent className="p-6 bg-white space-y-2 rounded-b-2xl">
                  <h3 className="text-2xl font-bold text-gray-900">WebnD Merch</h3>
                  <p className="text-gray-500 text-sm">Oversized T-shirt</p>
                  <p className="text-xl font-bold text-[#1a3857] mt-3">₹520</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
