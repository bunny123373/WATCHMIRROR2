import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Content } from "@/lib/models/Content";
import { IContent } from "@/types";
import WatchClient from "./WatchClient";

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
      title: `Watch ${item.title} Online | WATCHMIRROR`,
      description: item.metaDescription || `Watch ${item.title} online in HD on WATCHMIRROR.`,
      openGraph: {
        title: `Watch ${item.title} Online | WATCHMIRROR`,
        description: item.metaDescription,
        images: [{ url: item.banner }],
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

    const related = await Content.find({
      _id: { $ne: item._id },
      type: "movie",
      category: item.category,
    })
      .sort({ popularity: -1 })
      .limit(10)
      .lean();

    return {
      item: JSON.parse(JSON.stringify(item)),
      related: JSON.parse(JSON.stringify(related)),
    };
  } catch {
    return null;
  }
}

export default async function WatchMoviePage({ params }: Props) {
  const { slug } = await params;
  const data = await getMovie(slug);
  if (!data) notFound();

  return <WatchClient item={data.item} related={data.related} />;
}
