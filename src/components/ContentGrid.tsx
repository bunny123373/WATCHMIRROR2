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
    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
      {items.map((item) => (
        <div key={item.slug} className="w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] flex-shrink-0">
          <ContentCard item={item} />
        </div>
      ))}
    </div>
  );
}
