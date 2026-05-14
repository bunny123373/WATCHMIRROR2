import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || "https://watchmirror.vercel.app";

  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/movies`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/series`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/trending`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
  ];

  let contentRoutes: MetadataRoute.Sitemap = [];

  try {
    const { connectDB } = await import("@/lib/db");
    const { Content } = await import("@/lib/models/Content");
    const db = await connectDB();
    if (!db) return [...staticRoutes];
    const items = await Content.find({}, { slug: 1, type: 1, updatedAt: 1 })
      .sort({ popularity: -1 })
      .limit(500)
      .lean();

    contentRoutes = items.map((item: any) => {
      if (item.type === "movie") {
        return {
          url: `${baseUrl}/movie/${item.slug}`,
          lastModified: item.updatedAt || new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        };
      }
      return {
        url: `${baseUrl}/series/${item.slug}`,
        lastModified: item.updatedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    });
  } catch {
    /* Database unavailable */
  }

  return [...staticRoutes, ...contentRoutes];
}
