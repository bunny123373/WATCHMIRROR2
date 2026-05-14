"use client";

import Image from "next/image";
import { Cast } from "@/types";
import { TMDB_IMAGE_W500 } from "@/lib/constants";

interface CastCarouselProps {
  cast: Cast[];
}

export default function CastCarousel({ cast }: CastCarouselProps) {
  if (!cast.length) return null;

  return (
    <section>
      <h2 className="text-xl md:text-2xl font-bold text-[#F9FAFB] mb-4">Cast</h2>
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {cast.map((member, index) => (
          <div key={index} className="flex-shrink-0 text-center w-28">
            <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden bg-[#0E1015] border-2 border-[#1F232D]">
              {member.profileImage ? (
                <Image
                  src={member.profileImage}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#9CA3AF] text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
            <p className="mt-2 text-sm font-medium text-[#F9FAFB] truncate">{member.name}</p>
            <p className="text-xs text-[#9CA3AF] truncate">{member.character}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
