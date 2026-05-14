import { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Content } from "@/lib/models/Content";
import ContentGrid from "@/components/ContentGrid";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = slug.charAt(0).toUpperCase() + slug.slice(1);

  return {
    title: `${category} Movies & Series`,
    description: `Watch ${category} movies and web series online in HD. Stream without limits on WATCHMIRROR.`,
  };
}

async function getCategoryContent(slug: string) {
  try {
    const db = await connectDB();
    if (!db) return [];
    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
    const items = await Content.find({ tags: categoryName })
      .sort({ popularity: -1 })
      .limit(50)
      .lean();
    return JSON.parse(JSON.stringify(items));
  } catch {
    return [];
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = slug.charAt(0).toUpperCase() + slug.slice(1);
  const items = await getCategoryContent(slug);

  if (items.length === 0) notFound();

  return (
    <main className="min-h-screen pt-16 pb-20 md:pb-0">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-8">{category}</h1>
        <ContentGrid items={items} />
      </div>
    </main>
  );
}
