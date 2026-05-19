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
}

export default function WatchClient({ item, related, audio }: WatchClientProps) {
  const dispatch = useDispatch();

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
    <main className="min-h-screen pt-14 md:pt-28 pb-20 md:pb-0 bg-[#050608]">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-6">
        <Link
          href={`/movie/${item.slug}`}
          className="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-[#F5C542] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to details
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#F9FAFB] mb-4">{item.title}</h1>
          {audio && (
            <div className="flex items-center gap-2 text-sm text-[#F5C542] mb-4">
              <Headphones className="w-4 h-4" />
              Audio: {audio}
            </div>
          )}
          {subtitles.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Subtitles className="w-4 h-4 text-[#9CA3AF]" />
              <select value={subLang} onChange={(e) => setSubLang(e.target.value)} className="h-8 px-2 rounded bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] text-xs focus:outline-none focus:border-[#F5C542] appearance-none cursor-pointer">
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
                <HLSPlayer src={hlsSrc} poster={item.banner} subtitleUrl={subUrl} subtitleLang={subLang} autoPlay audioTrack={audio || undefined} onProgress={saveProgress} />
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
            <div className="w-full aspect-video rounded-2xl bg-[#0E1015] border border-[#1F232D] flex items-center justify-center">
              <div className="text-center">
                <Film className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
                <p className="text-[#F5C542] text-lg font-semibold">Streaming Not Available</p>
                <p className="text-[#9CA3AF] text-sm mt-1">
                  This content does not have a stream source yet.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-[#9CA3AF] mb-8">
          <span className="px-2 py-0.5 rounded bg-[#F5C542] text-[#050608] text-xs font-semibold">
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
            <ContentRow title="Related Movies" items={related} />
          </div>
        )}
      </div>
    </main>
  );
}
