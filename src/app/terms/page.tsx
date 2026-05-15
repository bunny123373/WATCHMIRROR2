import { Metadata } from "next";
import { Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | WATCHMIRROR",
  description: "WATCHMIRROR Terms of Service — rules and guidelines for using our platform.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-14 md:pt-28 pb-20 md:pb-0">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Scale className="w-6 h-6 text-[#F5C542]" />
          <h1 className="text-3xl font-bold text-[#F9FAFB]">Terms of Service</h1>
        </div>
        <div className="space-y-6 text-sm text-[#9CA3AF] leading-relaxed">
          <p>
            By using WATCHMIRROR, you agree to these terms. Please read them carefully.
          </p>
          <h2 className="text-lg font-semibold text-[#F9FAFB]">Acceptance of Terms</h2>
          <p>
            By accessing WATCHMIRROR, you confirm that you accept these terms and agree to comply with them. If you do not agree, do not use the platform.
          </p>
          <h2 className="text-lg font-semibold text-[#F9FAFB]">Service Description</h2>
          <p>
            WATCHMIRROR is a streaming platform that provides access to movies and web series. Content is streamed via third-party providers. We do not host or upload any copyrighted material.
          </p>
          <h2 className="text-lg font-semibold text-[#F9FAFB]">User Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You must be at least 13 years of age to use this platform.</li>
            <li>You agree not to reproduce, distribute, or exploit any content without authorization.</li>
            <li>You agree not to attempt to disrupt or compromise the platform.</li>
          </ul>
          <h2 className="text-lg font-semibold text-[#F9FAFB]">Disclaimer</h2>
          <p>
            WATCHMIRROR is provided &quot;as is&quot; without warranties of any kind. We do not guarantee uninterrupted or error-free service. We reserve the right to modify or discontinue the service at any time.
          </p>
          <h2 className="text-lg font-semibold text-[#F9FAFB]">Contact</h2>
          <p>
            For inquiries, reach out through our GitHub repository.
          </p>
          <p className="text-xs text-[#6B7280] pt-4">
            Last updated: May 2026
          </p>
        </div>
      </div>
    </main>
  );
}
