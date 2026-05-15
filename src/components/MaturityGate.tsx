"use client";

import { useEffect, useState } from "react";
import { MATURITY_LEVELS, RATING_HIERARCHY } from "@/lib/constants";

interface MaturityGateProps {
  contentRating?: string;
  children: React.ReactNode;
}

export default function MaturityGate({ contentRating, children }: MaturityGateProps) {
  const [isRestricted, setIsRestricted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("watchmirror_maturity");
    if (!stored || stored === "all" || !contentRating) {
      setIsRestricted(false);
      return;
    }
    const maxLevel = MATURITY_LEVELS.find((m) => m.value === stored)?.value;
    const userLevel = RATING_HIERARCHY[maxLevel || "all"] ?? 99;
    const contentLevel = RATING_HIERARCHY[contentRating] ?? 0;
    setIsRestricted(contentLevel > userLevel);
  }, [contentRating]);

  if (!isRestricted) return <>{children}</>;

  return (
    <div className="relative group">
      <div className="relative blur-sm pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050608]/70 gap-2">
        <span className="text-xs font-bold text-[#F5C542] px-3 py-1 bg-[#050608]/90 border border-[#F5C542]/30">
          {contentRating}
        </span>
        <span className="text-[10px] text-[#9CA3AF]">Mature Content</span>
      </div>
    </div>
  );
}
