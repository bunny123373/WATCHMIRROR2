"use client";

import { Monitor } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center p-4">
      <div className="text-center">
        <Monitor className="w-16 h-16 text-[#F5C542] mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-[#F9FAFB] mb-2">Something went wrong</h1>
        <p className="text-[#9CA3AF] mb-8">An unexpected error occurred</p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl gold-gradient text-[#050608] font-semibold hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
