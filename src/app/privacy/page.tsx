import { Metadata } from "next";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | WATCHMIRROR",
  description: "WATCHMIRROR Privacy Policy — how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-14 md:pt-28 pb-20 md:pb-0">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-6 h-6 text-[#F5C542]" />
          <h1 className="text-3xl font-bold text-[#F9FAFB]">Privacy Policy</h1>
        </div>
        <div className="space-y-6 text-sm text-[#9CA3AF] leading-relaxed">
          <p>
            WATCHMIRROR respects your privacy. This policy outlines how we collect, use, and protect your information when you use our streaming platform.
          </p>
          <h2 className="text-lg font-semibold text-[#F9FAFB]">Information We Collect</h2>
          <p>
            We collect minimal information required to provide our service: your viewing preferences (watchlist, continue watching) stored locally in your browser, and basic usage analytics to improve our platform.
          </p>
          <h2 className="text-lg font-semibold text-[#F9FAFB]">Data Storage</h2>
          <p>
            Watchlist and continue watching data is stored locally on your device via localStorage. We do not collect, store, or transmit personal information to third parties.
          </p>
          <h2 className="text-lg font-semibold text-[#F9FAFB]">Third-Party Services</h2>
          <p>
            WATCHMIRROR uses TMDB for metadata (posters, descriptions, cast) and Mux for video streaming. These services have their own privacy policies. We do not share your personal data with them.
          </p>
          <h2 className="text-lg font-semibold text-[#F9FAFB]">Cookies</h2>
          <p>
            We do not use tracking cookies. Essential local storage is used solely for platform functionality.
          </p>
          <h2 className="text-lg font-semibold text-[#F9FAFB]">Contact</h2>
          <p>
            For privacy concerns, please reach out through our GitHub repository.
          </p>
          <p className="text-xs text-[#6B7280] pt-4">
            Last updated: May 2026
          </p>
        </div>
      </div>
    </main>
  );
}
