import { IContent } from "@/types";
import ContentCard from "./ContentCard";

interface ContentGridProps {
  items: IContent[];
}

export default function ContentGrid({ items }: ContentGridProps) {
  if (!items.length) {
    return (
      <div className="text-center py-20 text-[#9CA3AF]">
        <p className="text-lg">No content available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
      {items.map((item) => (
        <ContentCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
