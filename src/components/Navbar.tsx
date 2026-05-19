"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { openSearch } from "@/store/slices/searchSlice";
import { Home, Search, Film } from "lucide-react";
import Image from "next/image";
import { WatchMirrorLogo } from "./LogoMark";
import MaturitySettings from "./MaturitySettings";

export function getStoredProfile(): "netflix" | "prime" {
  if (typeof window === "undefined") return "prime";
  return (localStorage.getItem("wm_profile") as "netflix" | "prime") || "prime";
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/series", label: "TV Shows" },
  { href: "/trending", label: "Trending" },
];

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [profile, setProfile] = useState<"netflix" | "prime">("prime");

  const saveProfile = (p: "netflix" | "prime") => {
    setProfile(p);
    localStorage.setItem("wm_profile", p);
  };

  useEffect(() => {
    if (pathname.startsWith("/prime-video")) {
      saveProfile("netflix");
    } else {
      saveProfile("prime");
    }
  }, [pathname]);

  const switchProfile = () => {
    if (profile === "prime") {
      saveProfile("netflix");
      window.location.href = "/prime-video";
    } else {
      saveProfile("prime");
      window.location.href = "/";
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navbar — pill style */}
      <nav className="hidden md:block fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="flex items-center justify-between px-3 py-2 rounded-[28px] border border-white/10 bg-black/80 backdrop-blur-2xl shadow-2xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <WatchMirrorLogo width={24} height={24} />
            <h1 className="text-base font-bold tracking-[0.15em]">
              <span className="bg-gradient-to-r from-[#C084FC] via-[#8B5CF6] to-[#6D28D9] bg-clip-text text-transparent">WATCH</span>
              <span className="text-white">MIRROR</span>
            </h1>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-5 text-xs font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative transition ${
                  isActive(link.href) ? "text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-[#F5C542] rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-1.5">
            {/* Search */}
            <button
              onClick={() => dispatch(openSearch())}
              className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center hover:bg-zinc-800 transition"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 text-white" />
            </button>

            {/* Maturity Settings */}
            <MaturitySettings className="w-8 h-8" iconClassName="w-3.5 h-3.5" />

            {/* Profile Switcher */}
            <button
              onClick={switchProfile}
              className="ml-1 px-2.5 py-1.5 rounded-full hover:bg-white/5 transition cursor-pointer"
              title={profile === "netflix" ? "Switch to Prime Video" : "Switch to Netflix"}
            >
              <Image
                src={profile === "netflix" ? "/netflix.png" : "/primevideo.svg"}
                alt={profile === "netflix" ? "Netflix" : "Prime Video"}
                width={52}
                height={13}
                className="w-11 h-auto"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Top Navbar — pill style */}
      <nav className="md:hidden fixed top-2 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-2xl">
          <Link href="/" className="flex items-center gap-1.5">
            <WatchMirrorLogo width={18} height={18} />
            <span className="text-xs font-bold tracking-[0.15em] whitespace-nowrap">
              <span className="bg-gradient-to-r from-[#C084FC] via-[#8B5CF6] to-[#6D28D9] bg-clip-text text-transparent">WATCH</span>
              <span className="text-white">MIRROR</span>
            </span>
          </Link>
        </div>
      </nav>

      {/* Mobile Bottom Nav — floating pill */}
      <nav className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[93%] max-w-sm">
        <div className="relative flex items-center justify-between px-4 py-3 rounded-[28px] border border-white/10 bg-black/75 backdrop-blur-3xl shadow-[0_0_40px_rgba(0,0,0,0.75)] overflow-visible">
          <div className="absolute inset-0 rounded-[28px] bg-[linear-gradient(to_top,rgba(139,92,246,0.08),transparent)] pointer-events-none" />

          {/* Home */}
          <Link href="/" className="flex flex-col items-center gap-0.5 relative z-10">
            <Home size={22} strokeWidth={2.5} className={pathname === "/" ? "text-violet-500" : "text-zinc-300"} />
            <span className={`text-[11px] font-medium ${pathname === "/" ? "text-violet-500" : "text-zinc-300"}`}>Home</span>
          </Link>

          {/* Search */}
          <button onClick={() => dispatch(openSearch())} className="flex flex-col items-center gap-0.5 relative z-10">
            <Search size={22} strokeWidth={2.5} className="text-zinc-300" />
            <span className="text-[11px] font-medium text-zinc-300">Search</span>
          </button>

          {/* Center Floating Button */}
          <button className="relative -mt-12 z-20">
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-violet-500 blur-xl opacity-40" />
              <div className="relative w-16 h-16 rounded-full border border-white/10 bg-gradient-to-b from-violet-400 via-violet-500 to-violet-700 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.7)]">
                <div className="absolute inset-[4px] rounded-full border border-white/10" />
                <svg width="26" height="26" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="wm-gradient-mobile" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#E9D5FF" />
                    </linearGradient>
                  </defs>
                  <path d="M8 15L28 92C30 102 42 102 45 92L58 42" stroke="url(#wm-gradient-mobile)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M58 42L72 92C75 102 87 102 89 92L110 15" stroke="url(#wm-gradient-mobile)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </button>

          {/* Movies */}
          <Link href="/movies" className="flex flex-col items-center gap-0.5 relative z-10">
            <Film size={22} strokeWidth={2.5} className={pathname.startsWith("/movies") ? "text-violet-500" : "text-zinc-300"} />
            <span className={`text-[11px] font-medium ${pathname.startsWith("/movies") ? "text-violet-500" : "text-zinc-300"}`}>Movies</span>
          </Link>

          {/* Profile Switcher */}
          <button onClick={switchProfile} className="flex flex-col items-center gap-0.5 relative z-10 cursor-pointer">
            <Image
              src={profile === "netflix" ? "/netflix.png" : "/primevideo.svg"}
              alt={profile === "netflix" ? "Netflix" : "Prime Video"}
              width={profile === "netflix" ? 32 : 28}
              height={8}
              className="mt-1"
            />
            <span className={`text-[11px] font-medium ${profile === "netflix" ? (pathname === "/" ? "text-violet-500" : "text-zinc-300") : (pathname.startsWith("/prime-video") ? "text-violet-500" : "text-zinc-300")}`}>
              {profile === "netflix" ? "Netflix" : "Prime"}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
