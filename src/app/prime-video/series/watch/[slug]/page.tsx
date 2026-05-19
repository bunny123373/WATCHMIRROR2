import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Content } from "@/lib/models/Content";
import { IContent } from "@/types";
import SeriesWatchClient from "@/app/series/watch/[slug]/SeriesWatchClient";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ season?: string; episode?: string; audio?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectDB();
    const item = await Content.findOne({ slug, type: "series", primeVideo: true }).lean() as IContent | null;
    if (!item) return { title: "Not Found" };

    return {
      title: `Watch ${item.title} | Prime Video | WATCHMIRROR`,
      description: item.metaDescription || `Watch ${item.title} on Prime Video in HD on WATCHMIRROR.`,
    };
  } catch {
    return { title: "Not Found" };
  }
}

async function getPrimeSeries(slug: string) {
  try {
    const db = await connectDB();
    if (!db) return null;
    const item = await Content.findOne({ slug, type: "series", primeVideo: true }).lean() as IContent | null;
    if (!item) return null;
    return JSON.parse(JSON.stringify(item)) as IContent;
  } catch {
    return null;
  }
}

export default async function PrimeSeriesWatchPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const item = await getPrimeSeries(slug);
  if (!item) notFound();

  const seasonNum = parseInt(sp.season || "1");
  const episodeNum = parseInt(sp.episode || "1");
  const currentSeason = item.seasons?.find((s) => s.seasonNumber === seasonNum);
  const currentEpisode = currentSeason?.episodes?.find((e) => e.episodeNumber === episodeNum);

  return (
    <SeriesWatchClient
      item={item}
      currentEpisode={currentEpisode || null}
      currentSeason={seasonNum}
      currentEpisodeNum={episodeNum}
      seasons={item.seasons || []}
      audio={sp.audio}
      variant="prime"
      detailsHref={`/prime-video/series/${slug}`}
      watchBasePath="/prime-video/series/watch"
    />
  );
}
