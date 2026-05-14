import Link from "next/link";
import { Monitor } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center p-4">
      <div className="text-center">
        <Monitor className="w-16 h-16 text-[#F5C542] mx-auto mb-6" />
        <h1 className="text-6xl font-bold text-[#F9FAFB] mb-2">404</h1>
        <p className="text-xl text-[#9CA3AF] mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gold-gradient text-[#050608] font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
