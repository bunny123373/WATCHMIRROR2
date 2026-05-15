import Link from "next/link";
import { Monitor } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#1F232D] bg-[#050608] mt-16">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Monitor className="w-6 h-6 text-[#F5C542]" />
              <span className="text-xl font-bold text-gradient">WATCHMIRROR</span>
            </Link>
            <p className="text-sm text-[#9CA3AF] max-w-xs">
              Stream Without Limits. Premium movies and web series in stunning HD quality.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#F9FAFB] mb-3">Browse</h3>
            <div className="space-y-2">
              <Link href="/movies" className="block text-sm text-[#9CA3AF] hover:text-[#F5C542] transition-colors">Movies</Link>
              <Link href="/series" className="block text-sm text-[#9CA3AF] hover:text-[#F5C542] transition-colors">Series</Link>
              <Link href="/trending" className="block text-sm text-[#9CA3AF] hover:text-[#F5C542] transition-colors">Trending</Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#F9FAFB] mb-3">Categories</h3>
            <div className="space-y-2">
              <Link href="/category/action" className="block text-sm text-[#9CA3AF] hover:text-[#F5C542] transition-colors">Action</Link>
              <Link href="/category/drama" className="block text-sm text-[#9CA3AF] hover:text-[#F5C542] transition-colors">Drama</Link>
              <Link href="/category/comedy" className="block text-sm text-[#9CA3AF] hover:text-[#F5C542] transition-colors">Comedy</Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#F9FAFB] mb-3">Legal</h3>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-sm text-[#9CA3AF] hover:text-[#F5C542] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="block text-sm text-[#9CA3AF] hover:text-[#F5C542] transition-colors">Terms of Service</Link>
              <Link href="/dmca" className="block text-sm text-[#9CA3AF] hover:text-[#F5C542] transition-colors">DMCA</Link>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-[#1F232D] text-center">
          <p className="text-sm text-[#9CA3AF]">
            WATCHMIRROR © {currentYear}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
