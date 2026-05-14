"use client";

import { useState } from "react";
import { Monitor, ShieldAlert } from "lucide-react";

const ADMIN_KEY = "WATCHMIRROR123";

interface AdminGuardProps {
  children: React.ReactNode;
}

function getStoredAuth(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("watchmirror_admin") === "true";
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [key, setKey] = useState("");
  const [authenticated, setAuthenticated] = useState(getStoredAuth);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === ADMIN_KEY) {
      setAuthenticated(true);
      setError(false);
      sessionStorage.setItem("watchmirror_admin", "true");
    } else {
      setError(true);
    }
  };

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Monitor className="w-8 h-8 text-[#F5C542]" />
            <span className="text-2xl font-bold text-gradient">WATCHMIRROR</span>
          </div>
          <p className="text-[#9CA3AF] text-sm">Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="password"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setError(false);
              }}
              placeholder="Enter admin secret key"
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F5C542] transition-colors"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm text-center">Wrong key</p>
          )}
          <button
            type="submit"
            className="w-full h-12 rounded-2xl gold-gradient text-[#050608] font-semibold hover:opacity-90 transition-opacity"
          >
            Access Admin Panel
          </button>
        </form>
      </div>
    </div>
  );
}
