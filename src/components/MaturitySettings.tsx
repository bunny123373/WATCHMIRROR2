"use client";

import { useEffect, useState, useRef } from "react";
import { Shield } from "lucide-react";
import { MATURITY_LEVELS } from "@/lib/constants";

interface MaturitySettingsProps {
  className?: string;
  iconClassName?: string;
}

export default function MaturitySettings({ className = "w-14 h-14", iconClassName = "w-6 h-6" }: MaturitySettingsProps) {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState("all");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("watchmirror_maturity");
    if (stored) setLevel(stored);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const select = (value: string) => {
    setLevel(value);
    localStorage.setItem("watchmirror_maturity", value);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`${className} rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center hover:bg-zinc-800 transition`}
        aria-label="Maturity settings"
      >
        <Shield className={`${iconClassName} text-[#F5C542]`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-3 w-56 rounded-none bg-[#0E1015] border border-[#1F232D] shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1F232D]">
            <p className="text-xs font-semibold text-[#F9FAFB]">Maturity Filter</p>
            <p className="text-[10px] text-[#9CA3AF] mt-0.5">Restrict mature content</p>
          </div>
          <div className="p-2 space-y-0.5">
            {MATURITY_LEVELS.map((m) => (
              <button
                key={m.value}
                onClick={() => select(m.value)}
                className={`w-full text-left px-3 py-2 rounded-none text-xs transition-all ${
                  level === m.value
                    ? "bg-[#F5C542]/10 text-[#F5C542] font-medium"
                    : "text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1F232D]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
