import { Metadata } from "next";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "DMCA | WATCHMIRROR",
  description: "WATCHMIRROR DMCA policy — copyright infringement notice procedures.",
};

export default function DmcaPage() {
  return (
    <main className="min-h-screen pt-14 md:pt-28 pb-20 md:pb-0">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <AlertTriangle className="w-6 h-6 text-[#F5C542]" />
          <h1 className="text-3xl font-bold text-[#F9FAFB]">DMCA Notice</h1>
        </div>
        <div className="space-y-6 text-sm text-[#9CA3AF] leading-relaxed">
          <p>
            WATCHMIRROR respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA).
          </p>
          <h2 className="text-lg font-semibold text-[#F9FAFB]">Notice of Infringement</h2>
          <p>
            If you believe that material available on WATCHMIRROR infringes your copyright, please submit a written notice with the following information:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Identification of the material that is claimed to be infringing, including a URL.</li>
            <li>Your contact information (address, phone number, email).</li>
            <li>A statement that you have a good faith belief that use of the material is not authorized.</li>
            <li>A statement that the information in the notice is accurate, under penalty of perjury.</li>
            <li>Your physical or electronic signature.</li>
          </ul>
          <h2 className="text-lg font-semibold text-[#F9FAFB]">Submission</h2>
          <p>
            Send DMCA notices to our GitHub repository issues section. We will respond promptly to valid infringement claims and remove or disable access to the allegedly infringing material.
          </p>
          <h2 className="text-lg font-semibold text-[#F9FAFB]">Counter-Notice</h2>
          <p>
            If you believe material was removed in error, you may submit a counter-notice with your contact information, identification of the removed material, and a statement under penalty of perjury that you have a good faith belief the material was removed by mistake.
          </p>
          <p className="text-xs text-[#6B7280] pt-4">
            Last updated: May 2026
          </p>
        </div>
      </div>
    </main>
  );
}
