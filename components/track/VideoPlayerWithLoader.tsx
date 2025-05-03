'use client'
import { useState } from "react"

export function VideoPlayerWithLoader({ src }: { src: string }) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="w-full max-w-[240px] mx-auto aspect-[9/16] relative rounded-xl overflow-hidden border border-gray-200 bg-black/5">
      {isLoading && <VideoLoaderAnimation />}
      <video
        src={src}
        controls
        className={`w-full rounded-md ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
        onCanPlayThrough={() => setIsLoading(false)}
        muted
      />
    </div>
  )
}

function VideoLoaderAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
    <div className="flex space-x-2">
      <span className="h-3 w-3 bg-[#1a3857] rounded-full animate-bounce [animati on-delay:-0.3s]" />
      <span className="h-3 w-3 bg-[#1a3857] rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="h-3 w-3 bg-[#1a3857] rounded-full animate-bounce" />
    </div>
  </div>
  )
}
