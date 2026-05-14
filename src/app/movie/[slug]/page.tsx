import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, Calendar, Globe, Clock, Headphones } from "lucide-react";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Content } from "@/lib/models/Content";
import { IContent } from "@/types";
import CastCarousel from "@/components/CastCarousel";
import ContentRow from "@/components/ContentRow";
import AudioSelector from "@/components/AudioSelector";
import SaveButton from "@/components/SaveButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectDB();
    const item = await Content.findOne({ slug, type: "movie" }).lean() as IContent | null;
    if (!item) return { title: "Not Found" };

    return {
      title: item.metaTitle || `${item.title} | WATCHMIRROR`,
      description: item.metaDescription || `Watch ${item.title} online in HD on WATCHMIRROR.`,
      openGraph: {
        title: item.metaTitle || `${item.title} | WATCHMIRROR`,
        description: item.metaDescription || `Watch ${item.title} online in HD.`,
        images: [{ url: item.banner }],
        type: "video.movie",
      },
      twitter: {
        card: "summary_large_image",
        title: item.metaTitle || `${item.title} | WATCHMIRROR`,
        description: item.metaDescription,
        images: [item.banner],
      },
    };
  } catch {
    return { title: "Not Found" };
  }
}

async function getMovie(slug: string) {
  try {
    const db = await connectDB();
    if (!db) return null;
    const item = await Content.findOne({ slug, type: "movie" }).lean() as IContent | null;
    if (!item) return null;

    const similar = await Content.find({
      _id: { $ne: item._id },
      $or: [
        { tags: { $in: item.tags?.slice(0, 3) || [] } },
        { category: item.category },
      ],
      type: "movie",
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

export default async function MovieDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await getMovie(slug);

  if (!data) notFound();

  const { item, similar } = data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: item.title,
    description: item.description,
    image: item.banner,
    datePublished: item.year?.toString(),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: item.rating,
      bestRating: "10",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen pt-14 md:pt-16 pb-20 md:pb-0">
        {/* Banner */}
        <div className="relative w-full h-[40vh] md:h-[60vh]">
          <Image
            src={item.banner || item.poster}
            alt={item.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/40 to-transparent" />
        </div>

        <div className="max-w-[1800px] mx-auto px-4 md:px-8 -mt-32 md:-mt-48 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            {/* Poster */}
            <div className="flex-shrink-0 w-48 md:w-64">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#0E1015] border border-[#1F232D] shadow-2xl">
                <Image
                  src={item.poster}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="256px"
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 pt-4 md:pt-16">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#F5C542] text-[#050608]">
                  {item.quality}
                </span>
                {item.rating > 0 && (
                  <span className="flex items-center gap-1 text-sm text-[#F5C542]">
                    <Star className="w-4 h-4 fill-current" />
                    {item.rating.toFixed(1)}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-[#F9FAFB] mb-4">
                {item.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-[#9CA3AF] mb-6">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {item.year}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {item.language}
                </span>
                {item.audioAvailable && item.audioAvailable.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Headphones className="w-4 h-4" />
                    {item.audioAvailable.join(", ")}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {item.quality}
                </span>
                <span className="capitalize px-2 py-0.5 rounded bg-[#1F232D] text-xs">
                  {item.category}
                </span>
              </div>

              <p className="text-[#9CA3AF] leading-relaxed mb-6 max-w-3xl">
                {item.description}
              </p>

              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <AudioSelector slug={item.slug} streams={item.streams} audioAvailable={item.audioAvailable} dubLanguage={item.dubLanguage} />
                </div>
                <SaveButton slug={item.slug} type="movie" title={item.title} poster={item.poster} year={item.year} quality={item.quality} className="mt-1" />
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {item.tags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/category/${tag.toLowerCase()}`}
                      className="px-3 py-1 text-xs rounded-full bg-[#1F232D] text-[#9CA3AF] hover:text-[#F5C542] hover:border-[#F5C542]/30 border border-transparent transition-all"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Trailer */}
              {item.trailerEmbedUrl && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-[#F9FAFB] mb-3">Trailer</h2>
                  <div className="relative aspect-video max-w-2xl rounded-2xl overflow-hidden bg-[#0E1015] border border-[#1F232D]">
                    <iframe
                      src={item.trailerEmbedUrl}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      title="Trailer"
                    />
                  </div>
                </div>
              )}

              {/* Cast */}
              <div className="mt-8">
                <CastCarousel cast={item.cast || []} />
              </div>
            </div>
          </div>

          {/* Similar Movies */}
          {similar.length > 0 && (
            <div className="mt-16">
              <ContentRow title="Similar Movies" items={similar} />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
