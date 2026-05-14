"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Monitor, Film, TrendingUp, Clapperboard, Bookmark } from "lucide-react";
import { useDispatch } from "react-redux";
import { openSearch } from "@/store/slices/searchSlice";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/series", label: "Series" },
  { href: "/trending", label: "Trending" },
  { href: "/my-list", label: "My List" },
];

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 glass border-b border-[#1F232D]">
        <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2">
              <Monitor className="w-6 h-6 text-[#F5C542]" />
              <span className="text-xl font-bold text-gradient">WATCHMIRROR</span>
            </Link>
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? "text-[#F5C542] bg-[#F5C542]/10"
                      : "text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#0E1015]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(openSearch())}
              className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#0E1015] transition-all"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-[#1F232D] safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          <MobileNavItem href="/" icon={<Clapperboard className="w-5 h-5" />} label="Home" />
          <MobileNavItem href="/movies" icon={<Film className="w-5 h-5" />} label="Movies" />
          <MobileNavItem href="/series" icon={<Monitor className="w-5 h-5" />} label="Series" />
          <MobileNavItem href="/trending" icon={<TrendingUp className="w-5 h-5" />} label="Trending" />
          <button
            onClick={() => dispatch(openSearch())}
            className="flex flex-col items-center gap-1 pt-1 px-3"
          >
            <Search className="w-5 h-5 text-[#9CA3AF]" />
            <span className="text-[10px] text-[#9CA3AF]">Search</span>
          </button>
        </div>
      </nav>
    </>
  );
}

function MobileNavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 pt-1 px-3 transition-colors ${
        isActive ? "text-[#F5C542]" : "text-[#9CA3AF]"
      }`}
    >
      {icon}
      <span className="text-[10px]">{label}</span>
    </Link>
  );
}
