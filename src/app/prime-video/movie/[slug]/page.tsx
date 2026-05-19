import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Globe, Headphones, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Content } from "@/lib/models/Content";
import { IContent } from "@/types";
import AudioSelector from "@/components/AudioSelector";
import CastCarousel from "@/components/CastCarousel";
import ContentRow from "@/components/ContentRow";
import SaveButton from "@/components/SaveButton";
import TrailerButton from "@/components/TrailerButton";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectDB();
    const item = await Content.findOne({ slug, type: "movie", primeVideo: true }).lean() as IContent | null;
    if (!item) return { title: "Not Found" };

    return {
      title: `${item.title} | Prime Video | WATCHMIRROR`,
      description: item.metaDescription || `Watch ${item.title} on Prime Video in HD on WATCHMIRROR.`,
      openGraph: {
        title: `${item.title} | Prime Video`,
        description: item.metaDescription,
        images: [{ url: item.banner }],
        type: "video.movie",
      },
    };
  } catch {
    return { title: "Not Found" };
  }
}

async function getPrimeMovie(slug: string) {
  try {
    const db = await connectDB();
    if (!db) return null;
    const item = await Content.findOne({ slug, type: "movie", primeVideo: true }).lean() as IContent | null;
    if (!item) return null;

    const similar = await Content.find({
      _id: { $ne: item._id },
      primeVideo: true,
      type: "movie",
      $or: [
        { tags: { $in: item.tags?.slice(0, 3) || [] } },
        { category: item.category },
      ],
    })
      .sort({ popularity: -1 })
      .limit(10)
      .lean();

    return {
      item: JSON.parse(JSON.stringify(item)),
      similar: JSON.parse(JSON.stringify(similar)),
    };
  } catch {
    return null;
  }
}

export default async function PrimeMovieDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await getPrimeMovie(slug);
  if (!data) notFound();

  const { item, similar } = data;

  return (
    <main className="min-h-screen bg-[#0F171E] pt-14 md:pt-20 pb-20 md:pb-0">
      <div className="relative w-full h-[42vh] md:h-[65vh]">
        <Image
          src={item.banner || item.poster}
          alt={item.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F171E] via-[#0F171E]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F171E]/90 via-[#0F171E]/35 to-transparent" />
      </div>

      <div className="max-w-[1800px] mx-auto px-4 md:px-8 -mt-28 md:-mt-44 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="flex-shrink-0 w-48 md:w-64">
            <div className="relative aspect-[2/3] overflow-hidden bg-[#1A242D] border border-[#2D3A45] shadow-2xl">
              <Image src={item.poster} alt={item.title} fill priority className="object-cover" sizes="256px" />
            </div>
          </div>

          <div className="flex-1 pt-4 md:pt-12">
            <Image src="/primevideo.svg" alt="Prime Video" width={126} height={32} className="w-28 md:w-32 mb-4" />
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 text-xs font-bold bg-[#00A8E1] text-white">PRIME</span>
              {item.contentRating && <span className="px-2 py-1 text-xs font-bold bg-[#1A242D] text-[#8197A4] border border-[#2D3A45]">{item.contentRating}</span>}
              <span className="px-3 py-1 text-xs font-semibold bg-[#00A8E1]/15 text-[#00A8E1] border border-[#00A8E1]/30">{item.quality}</span>
              {item.rating > 0 && <span className="flex items-center gap-1 text-sm text-[#00A8E1]"><Star className="w-4 h-4 fill-current" />{item.rating.toFixed(1)}</span>}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{item.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#8197A4] mb-6">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{item.year}</span>
              <span className="flex items-center gap-1"><Globe className="w-4 h-4" />{item.language}</span>
              {item.audioAvailable?.length > 0 && <span className="flex items-center gap-1"><Headphones className="w-4 h-4" />{item.audioAvailable.join(", ")}</span>}
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{item.quality}</span>
              <span className="capitalize px-2 py-0.5 bg-[#1A242D] text-xs">{item.category}</span>
            </div>

            <p className="text-[#B7C7D7] leading-relaxed mb-6 max-w-3xl">{item.description}</p>

            <div className="flex items-start gap-3">
              <div className="flex-1">
                <AudioSelector slug={item.slug} streams={item.streams} audioAvailable={item.audioAvailable} dubLanguage={item.dubLanguage} hasPeachify={!!(item.peachifyId || item.tmdbId)} />
              </div>
              <SaveButton slug={item.slug} type="movie" title={item.title} poster={item.poster} year={item.year} quality={item.quality} className="mt-1" />
            </div>

            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {item.tags.map((tag: string) => (
                  <Link key={tag} href={`/category/${tag.toLowerCase()}`} className="px-3 py-1 text-xs bg-[#1A242D] text-[#8197A4] hover:text-[#00A8E1] border border-[#2D3A45] transition-all">
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {item.trailerEmbedUrl && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-white mb-3">Trailer</h2>
                <TrailerButton url={item.trailerEmbedUrl} />
              </div>
            )}

            <div className="mt-8">
              <CastCarousel cast={item.cast || []} />
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-16">
            <ContentRow title="More Prime Movies" items={similar} />
          </div>
        )}
      </div>
    </main>
  );
}
