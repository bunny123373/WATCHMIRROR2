"use client";

import { useMemo, useCallback, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Film, Headphones, Subtitles } from "lucide-react";
import { useDispatch } from "react-redux";
import { addContinueWatching } from "@/store/slices/continueSlice";
import HLSPlayer from "@/components/HLSPlayer";
import IframePlayer from "@/components/IframePlayer";
import { PeachifyPlayer } from "@/components/PeachifyPlayer";
import DownloadButton from "@/components/DownloadButton";
import ContentRow from "@/components/ContentRow";
import { IContent } from "@/types";

interface WatchClientProps {
  item: IContent;
  related: IContent[];
  audio?: string;
  variant?: "default" | "prime";
  detailsHref?: string;
  relatedTitle?: string;
}

export default function WatchClient({ item, related, audio, variant = "default", detailsHref, relatedTitle = "Related Movies" }: WatchClientProps) {
  const dispatch = useDispatch();
  const isPrime = variant === "prime";
  const accentText = isPrime ? "text-[#00A8E1]" : "text-[#F5C542]";
  const accentHover = isPrime ? "hover:text-[#00A8E1]" : "hover:text-[#F5C542]";
  const detailsUrl = detailsHref || `/movie/${item.slug}`;

  const stream = useMemo(() => {
    if (audio && item.streams) {
      return item.streams.find((s) => s.language === audio);
    }
    return null;
  }, [audio, item.streams]);

  const [subLang, setSubLang] = useState("");
  const subtitles = stream?.subtitles || [];
  const subUrl = subtitles.find((s) => s.language === subLang)?.url || "";

  const hlsSrc = stream?.hlsLink || item.hlsLink || "";
  const embedSrc = stream?.embedIframeLink || item.embedIframeLink || "";
  const peachifySrc = item.peachifyId || (item.tmdbId ? String(item.tmdbId) : "");
  const hasHls = !!hlsSrc.trim();
  const hasEmbed = !!embedSrc.trim();
  const hasPeachify = !!peachifySrc.trim();
  const canStream = hasHls || hasPeachify || hasEmbed;

  const saveProgress = useCallback((currentTime: number, duration: number) => {
    if (duration > 0 && currentTime / duration > 0.9) return;
    if (currentTime < 30) return;

    dispatch(
      addContinueWatching({
        slug: item.slug,
        type: "movie",
        title: item.title,
        poster: item.poster,
        currentTime,
        duration,
        updatedAt: Date.now(),
      })
    );
  }, [dispatch, item.slug, item.title, item.poster]);

  return (
    <main className={`min-h-screen pt-14 md:pt-28 pb-20 md:pb-0 ${isPrime ? "bg-[#0F171E]" : "bg-[#050608]"}`}>
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-6">
        <Link
          href={detailsUrl}
          className={`inline-flex items-center gap-2 text-[#9CA3AF] ${accentHover} transition-colors mb-4`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to details
        </Link>

        <div className="mb-6">
          {isPrime && <p className="text-xs font-bold tracking-wide text-[#00A8E1] mb-2">PRIME VIDEO</p>}
          <h1 className="text-2xl font-bold text-[#F9FAFB] mb-4">{item.title}</h1>
          {audio && (
            <div className={`flex items-center gap-2 text-sm ${accentText} mb-4`}>
              <Headphones className="w-4 h-4" />
              Audio: {audio}
            </div>
          )}
          {subtitles.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Subtitles className="w-4 h-4 text-[#9CA3AF]" />
              <select value={subLang} onChange={(e) => setSubLang(e.target.value)} className={`h-8 px-2 rounded text-[#F9FAFB] text-xs focus:outline-none appearance-none cursor-pointer ${isPrime ? "bg-[#1A242D] border border-[#2D3A45] focus:border-[#00A8E1]" : "bg-[#0E1015] border border-[#1F232D] focus:border-[#F5C542]"}`}>
                <option value="" className="bg-[#0E1015]">No subtitles</option>
                {subtitles.map((s) => (
                  <option key={s.language} value={s.language} className="bg-[#0E1015]">{s.language}</option>
                ))}
              </select>
            </div>
          )}
          {canStream ? (
            hasHls ? (
              <>
                <HLSPlayer src={hlsSrc} poster={item.banner} subtitleUrl={subUrl} subtitleLang={subLang} autoPlay audioTrack={audio || undefined} onProgress={saveProgress} variant={variant} />
                <div className="mt-3">
                  <DownloadButton slug={item.slug} />
                </div>
              </>
            ) : hasPeachify ? (
              <PeachifyPlayer type="movie" mediaId={peachifySrc} dub={audio} hide={["servers"]} />
            ) : (
              <IframePlayer src={embedSrc} />
            )
          ) : (
            <div className={`w-full aspect-video rounded-2xl flex items-center justify-center ${isPrime ? "bg-[#1A242D] border border-[#2D3A45]" : "bg-[#0E1015] border border-[#1F232D]"}`}>
              <div className="text-center">
                <Film className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
                <p className={`${accentText} text-lg font-semibold`}>Streaming Not Available</p>
                <p className="text-[#9CA3AF] text-sm mt-1">
                  This content does not have a stream source yet.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-[#9CA3AF] mb-8">
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${isPrime ? "bg-[#00A8E1] text-white" : "bg-[#F5C542] text-[#050608]"}`}>
            {item.quality}
          </span>
          <span>{item.year}</span>
          <span className="capitalize">{item.category}</span>
          {item.rating > 0 && <span>★ {item.rating.toFixed(1)}</span>}
        </div>

        <p className="text-[#9CA3AF] leading-relaxed max-w-3xl mb-8">
          {item.description}
        </p>

        {related.length > 0 && (
          <div className="mt-8">
            <ContentRow title={relatedTitle} items={related} />
          </div>
        )}
      </div>
    </main>
  );
}
