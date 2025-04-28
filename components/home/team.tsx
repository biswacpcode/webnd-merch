"use client"

import Image from "next/image"

interface TeamMember {
  name: string
  position: string
  image: string
}

const teamMembers: TeamMember[] = [
  {
    name: "Biswajit Rout",
    position: "Secretary",
    image: "/biswajit.jpg",
  },
  {
    name: "Rakshit Vel",
    position: "Lead Designer",
    image: "/rakshit.jpg",
  },
  {
    name: "Anshika Jain",
    position: "Design Lead",
    image: "/anshika.jpg",
  },
  {
    name: "Shriya Panda",
    position: "Maiyat Poster Maker",
    image: "/shriya.jpg",
  },
]

export function TeamSection() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-12 left-12 w-24 h-24 bg-[#1a3857]/5 rounded-full -z-10"></div>
      <div className="absolute bottom-12 right-12 w-32 h-32 bg-[#1a3857]/5 rounded-full -z-10"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-[#1a3857]/5 rounded-full -z-10"></div>

      <div className="container max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Heading */}
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
              Minds Behind All These
            </h2>
            <p className="max-w-2xl text-muted-foreground text-lg md:text-xl">
              Meet our amazing team members
            </p>
          </div>

          {/* Team Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-10 w-full">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-top object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Text section visible by default on mobile, hidden on larger screens until hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f2540] via-[#0f2540]/30 to-transparent opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white text-xl font-bold">{member.name}</h3>
                  <p className="text-gray-300 text-sm">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
