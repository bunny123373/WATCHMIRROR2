"use client";

import { useState, useEffect, useRef } from "react";
import { Download, ShieldCheck, Loader2, ExternalLink, Lock, Timer } from "lucide-react";

interface Props {
  url: string;
  label?: string;
}

const AD_URL = "https://www.profitablecpmratenetwork.com/d4cp6qn3?key=d02dd14587e874749866d9f432a7c519";
const VERIFY_SECONDS = 12;
const STORAGE_KEY = "watchmirror_verified";

function isVerified(downloadUrl: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return stored[downloadUrl] === true;
  } catch {
    return false;
  }
}

function markVerified(downloadUrl: string) {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    stored[downloadUrl] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {}
}

export default function DownloadButton({ url, label = "Download" }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<"ad" | "timer" | "verify" | "done">("ad");
  const [countdown, setCountdown] = useState(VERIFY_SECONDS);
  const [adOpened, setAdOpened] = useState(false);
  const timerRef = useRef<any>(null);

  const openModal = () => {
    if (isVerified(url)) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    setStep("ad");
    setCountdown(VERIFY_SECONDS);
    setAdOpened(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const openAd = () => {
    window.open(AD_URL, "_blank", "noopener,noreferrer");
    setAdOpened(true);
    setStep("timer");
    let count = VERIFY_SECONDS;
    timerRef.current = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(timerRef.current);
        setStep("verify");
      }
    }, 1000);
  };

  const handleVerify = () => {
    markVerified(url);
    setStep("done");
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!url?.trim()) return null;

  return (
    <>
      <button
        onClick={openModal}
        className="inline-flex items-center gap-2 px-5 h-10 rounded-none bg-[#1F232D] text-[#F9FAFB] font-semibold hover:bg-[#2a2f3a] transition-all text-sm border border-[#1F232D]"
      >
        <Download className="w-4 h-4" />
        {label}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[80] bg-[#050608]/95 flex items-center justify-center p-4" onClick={closeModal}>
          <div
            className="w-full max-w-lg bg-[#0E1015] border border-[#1F232D]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F232D]">
              <h3 className="text-sm font-bold text-[#F9FAFB]">Download Verification</h3>
              <button onClick={closeModal} className="text-[#9CA3AF] hover:text-[#F9FAFB] text-lg leading-none">&times;</button>
            </div>

            <div className="p-5">
              {step === "ad" && (
                <div className="space-y-4 text-center py-6">
                  <Lock className="w-10 h-10 text-[#F5C542] mx-auto" />
                  <p className="text-sm text-[#F9FAFB] font-semibold">Ad Verification Required</p>
                  <p className="text-xs text-[#9CA3AF]">Click the button below to open the ad page. Complete it and return here to verify.</p>
                  <button
                    onClick={openAd}
                    className="inline-flex items-center gap-2 px-8 h-11 rounded-none bg-[#F5C542] text-[#050608] font-semibold hover:opacity-90 transition-opacity text-sm"
                  >
                    <ExternalLink className="w-4 h-4" /> Open Ad Page
                  </button>
                </div>
              )}

              {step === "timer" && (
                <div className="space-y-4 text-center py-8">
                  <Timer className="w-10 h-10 text-[#F5C542] mx-auto" />
                  <p className="text-sm text-[#F9FAFB] font-semibold">Verifying...</p>
                  <p className="text-xs text-[#9CA3AF]">Please wait while we verify. Do not close this window.</p>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-none bg-[#050608] border-2 border-[#F5C542]">
                    <span className="text-2xl font-bold text-[#F5C542]">{countdown}</span>
                  </div>
                  <p className="text-xs text-[#9CA3AF]">seconds remaining</p>
                </div>
              )}

              {step === "verify" && (
                <div className="space-y-4 text-center py-8">
                  <ShieldCheck className="w-10 h-10 text-[#22C55E] mx-auto" />
                  <p className="text-sm text-[#F9FAFB] font-semibold">Verification Complete</p>
                  <p className="text-xs text-[#9CA3AF]">Click confirm to unlock your download.</p>
                  <button
                    onClick={handleVerify}
                    className="inline-flex items-center gap-2 px-8 h-11 rounded-none bg-[#22C55E] text-[#050608] font-semibold hover:opacity-90 transition-opacity text-sm"
                  >
                    <ShieldCheck className="w-4 h-4" /> Confirm & Download
                  </button>
                </div>
              )}

              {step === "done" && (
                <div className="space-y-4 text-center py-8">
                  <ShieldCheck className="w-10 h-10 text-[#22C55E] mx-auto" />
                  <p className="text-sm text-[#F9FAFB] font-semibold">Verified Successfully</p>
                  <p className="text-xs text-[#9CA3AF]">Your download link is ready.</p>
                  <a
                    href={url}
                    download
                    className="inline-flex items-center gap-2 px-8 h-11 rounded-none gold-gradient text-[#050608] font-semibold hover:opacity-90 transition-opacity text-sm"
                    onClick={closeModal}
                  >
                    <Download className="w-4 h-4" /> Download Now
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
