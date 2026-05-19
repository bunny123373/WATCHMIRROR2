"use client";

import {
  useRef, useState, useEffect, useCallback, useMemo,
} from "react";
import Hls from "hls.js";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  PictureInPicture2, SkipBack, SkipForward, Loader2, Settings,
} from "lucide-react";

interface HLSPlayerProps {
  src: string;
  poster?: string;
  subtitleUrl?: string;
  subtitleLang?: string;
  autoPlay?: boolean;
  audioTrack?: string;
  onProgress?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function HLSPlayer({
  src, poster, subtitleUrl, subtitleLang,
  autoPlay = true, audioTrack: initialAudioTrack,
  onProgress, onEnded,
}: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(true);
  const [ended, setEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState<TimeRanges | null>(null);
  const [showVolume, setShowVolume] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [audioTracks, setAudioTracks] = useState<{ index: number; name: string; lang?: string }[]>([]);
  const [selectedAudioTrack, setSelectedAudioTrack] = useState(-1);
  const [qualityLevels, setQualityLevels] = useState<{ index: number; height: number; name: string }[]>([]);
  const [currentQuality, setCurrentQuality] = useState(-1);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsMenuRef = useRef<HTMLDivElement>(null);

  const canStream = !!src?.trim();

  const bufferedPercent = useMemo(() => {
    if (!buffered || !duration) return 0;
    for (let i = 0; i < buffered.length; i++) {
      if (buffered.start(i) <= currentTime && buffered.end(i) >= currentTime) {
        return (buffered.end(i) / duration) * 100;
      }
    }
    return 0;
  }, [buffered, currentTime, duration]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (playing && !paused) {
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 3000);
    }
  }, [playing, paused]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !canStream) return;

    setReady(false);
    setLoading(true);
    setError("");
    setEnded(false);
    setCurrentTime(0);
    setDuration(0);
    setPaused(true);
    setPlaying(false);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
      });
      hlsRef.current = hls;
      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => hls.loadSource(src));
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setReady(true);
        setLoading(false);
        if (hls.levels?.length > 0) {
          const levels = hls.levels.map((l: any, i: number) => ({
            index: i,
            height: l.height || 0,
            name: l.height ? `${l.height}p` : l.name || `Quality ${i}`,
          }));
          setQualityLevels(levels);
          setCurrentQuality(hls.currentLevel);
        }
        if (hls.audioTracks?.length > 0) {
          const tracks = hls.audioTracks.map((t: any, i: number) => ({
            index: i,
            name: t.name || t.label || `Track ${i + 1}`,
            lang: t.lang,
          }));
          setAudioTracks(tracks);
          if (initialAudioTrack) {
            const match = tracks.find(
              (t) => t.name.toLowerCase() === initialAudioTrack.toLowerCase() || t.lang?.toLowerCase() === initialAudioTrack.toLowerCase()
            );
            if (match && match.index !== hls.audioTrack) {
              hls.audioTrack = match.index;
              setSelectedAudioTrack(match.index);
            }
          } else {
            setSelectedAudioTrack(hls.audioTrack);
          }
        }
        if (autoPlay) {
          video.play().catch(() => {});
        }
      });
      hls.on(Hls.Events.LEVEL_SWITCHED, (_evt, data) => {
        setCurrentQuality(data.level);
      });
      hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (_evt, data) => {
        const tracks = data.audioTracks.map((t: any, i: number) => ({
          index: i,
          name: t.name || t.label || `Track ${i + 1}`,
          lang: t.lang,
        }));
        setAudioTracks(tracks);
      });
      hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, (_evt, data) => {
        setSelectedAudioTrack(data.id);
      });
      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (data.fatal) {
          setError("Failed to load stream. Please try again.");
          setLoading(false);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        setReady(true);
        setLoading(false);
      });
      video.addEventListener("error", () => {
        setError("Failed to load stream.");
        setLoading(false);
      });
    } else {
      setError("HLS playback is not supported on this browser.");
      setLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, canStream]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) {
      video.play();
    } else {
      video.pause();
    }
  }, []);

  const seek = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, duration));
  }, [duration]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const el = progressRef.current;
    if (!video || !el || !duration) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    video.currentTime = x * duration;
  }, [duration]);

  useEffect(() => {
    if (!seeking) return;
    const handleMouseUp = () => setSeeking(false);
    const handleMouseMove = (e: MouseEvent) => {
      const video = videoRef.current;
      const el = progressRef.current;
      if (!video || !el || !duration) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      video.currentTime = x * duration;
    };
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [seeking, duration]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const val = parseFloat(e.target.value);
    video.volume = val;
    video.muted = val === 0;
    setVolume(val);
    setMuted(val === 0);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await el.requestFullscreen();
    }
  }, []);

  const togglePip = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
      }
    } catch {
      // PIP not supported
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => { setPlaying(true); setPaused(false); setEnded(false); showControls(); };
    const onPause = () => { setPlaying(false); setPaused(true); setControlsVisible(true); };
    const onEnded = () => { setEnded(true); setPlaying(false); setPaused(true); setControlsVisible(true); onEnded?.(); };
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration) setDuration(video.duration);
      onProgress?.(video.currentTime, video.duration);
    };
    const onLoaded = () => { setDuration(video.duration); setReady(true); setLoading(false); };
    const onWaiting = () => setLoading(true);
    const onCanPlay = () => setLoading(false);
    const onProgressEvt = () => setBuffered(video.buffered);
    const onVolumeChange = () => { setVolume(video.volume); setMuted(video.muted); };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("progress", onProgressEvt);
    video.addEventListener("volumechange", onVolumeChange);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("progress", onProgressEvt);
      video.removeEventListener("volumechange", onVolumeChange);
    };
  }, [onProgress, onEnded, showControls]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") return;
      if (!containerRef.current?.contains(target)) return;
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "ArrowLeft":
          e.preventDefault();
          seek(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          seek(10);
          break;
        case "ArrowUp": {
          e.preventDefault();
          const video = videoRef.current;
          if (video) {
            const newVol = Math.min(1, volume + 0.1);
            video.volume = newVol;
            video.muted = newVol === 0;
            setVolume(newVol);
            setMuted(newVol === 0);
          }
          break;
        }
        case "ArrowDown": {
          e.preventDefault();
          const video = videoRef.current;
          if (video) {
            const newVol = Math.max(0, volume - 0.1);
            video.volume = newVol;
            video.muted = newVol === 0;
            setVolume(newVol);
            setMuted(newVol === 0);
          }
          break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, toggleFullscreen, toggleMute, seek, volume, handleVolumeChange]);

  const [hoverTime, setHoverTime] = useState(0);
  const [hoverX, setHoverX] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(e.target as Node)) {
        setShowSettingsMenu(false);
      }
    };
    if (showSettingsMenu) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [showSettingsMenu]);

  const switchAudioTrack = useCallback((index: number) => {
    if (hlsRef.current) {
      hlsRef.current.audioTrack = index;
      setSelectedAudioTrack(index);
    }
    setShowSettingsMenu(false);
  }, []);

  const switchQuality = useCallback((index: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = index;
      setCurrentQuality(index);
    }
    setShowSettingsMenu(false);
  }, []);

  const handleProgressHover = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = progressRef.current;
    if (!el || !duration) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    setHoverTime(x * duration);
    setHoverX(e.clientX - rect.left);
  }, [duration]);

  if (!canStream) {
    return (
      <div className="w-full aspect-video rounded-none bg-[#0E1015] border border-[#1F232D] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#F5C542] text-lg font-semibold">Stream Error</p>
          <p className="text-[#9CA3AF] text-sm mt-1">Unable to load stream</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black overflow-hidden group select-none"
      onMouseMove={showControls}
      onMouseLeave={() => { if (playing && !paused) setControlsVisible(false); }}
      onClick={(e) => { if (e.target === containerRef.current) togglePlay(); }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain cursor-pointer"
        poster={poster}
        playsInline
        preload="auto"
        onClick={togglePlay}
      >
        {subtitleUrl && (
          <track
            kind="subtitles"
            src={subtitleUrl}
            srcLang={subtitleLang || "en"}
            label={subtitleLang || "Subtitles"}
            default
          />
        )}
      </video>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
          <Loader2 className="w-10 h-10 text-[#F5C542] animate-spin" />
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="text-center px-6">
            <p className="text-[#F5C542] text-lg font-semibold">Playback Error</p>
            <p className="text-[#9CA3AF] text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Top gradient */}
      <div
        className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none transition-opacity duration-300 ${
          controlsVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Center play button - shows when paused and controls visible */}
      {(paused || ended) && controlsVisible && !loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={togglePlay}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200 pointer-events-auto"
            aria-label={ended ? "Replay" : "Play"}
          >
            <Play className="w-7 h-7 md:w-9 md:h-9 text-white ml-0.5 md:ml-1" fill="white" />
          </button>
        </div>
      )}

      {/* Bottom controls bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${
          controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-3 md:pb-4 px-3 md:px-5">
          {/* Progress bar */}
          <div
            ref={progressRef}
            className="relative w-full h-1 md:h-1.5 group/progress cursor-pointer mb-3 md:mb-4"
            onMouseDown={(e) => { setSeeking(true); handleProgressClick(e); }}
            onMouseMove={(e) => { handleProgressHover(e); setHovering(true); }}
            onMouseLeave={() => setHovering(false)}
          >
            {/* Hover time tooltip */}
            {hovering && duration > 0 && (
              <div
                className="absolute -top-8 -translate-x-1/2 bg-black/80 text-white text-[11px] font-medium px-1.5 py-0.5 rounded pointer-events-none z-10"
                style={{ left: `${hoverX}px` }}
              >
                {formatTime(hoverTime)}
              </div>
            )}
            {/* Track */}
            <div className="absolute inset-0 rounded-full bg-white/20 pointer-events-none" />
            {/* Buffered */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white/30 pointer-events-none"
              style={{ width: `${bufferedPercent}%` }}
            />
            {/* Played */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[#F5C542] pointer-events-none"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Hover preview */}
            {hovering && (
              <div
                className="absolute inset-y-0 w-0.5 bg-white/60 pointer-events-none"
                style={{ left: `${hoverX}px` }}
              />
            )}
            {/* Thumb */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#F5C542] shadow-lg pointer-events-none transition-opacity ${
                hovering || seeking ? "opacity-100" : "opacity-0 group-hover/progress:opacity-100"
              }`}
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-1 md:gap-2 text-white">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition"
              aria-label={playing ? "Pause" : "Play"}
            >
              {ended ? (
                <Play className="w-3.5 h-3.5 md:w-5 md:h-5" fill="white" />
              ) : playing ? (
                <Pause className="w-3.5 h-3.5 md:w-5 md:h-5" />
              ) : (
                <Play className="w-3.5 h-3.5 md:w-5 md:h-5" fill="white" />
              )}
            </button>

            {/* Skip Back 10s */}
            <button
              onClick={() => seek(-10)}
              className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition"
              aria-label="Rewind 10 seconds"
            >
              <SkipBack className="w-3.5 h-3.5 md:w-5 md:h-5" />
            </button>

            {/* Skip Forward 10s */}
            <button
              onClick={() => seek(10)}
              className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition"
              aria-label="Forward 10 seconds"
            >
              <SkipForward className="w-3.5 h-3.5 md:w-5 md:h-5" />
            </button>

            {/* Time display */}
            <div className="text-[11px] md:text-sm font-medium text-white/80 ml-1 md:ml-2 tabular-nums whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <div className="flex-1" />

            {/* Volume */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowVolume(true)}
              onMouseLeave={() => setShowVolume(false)}
            >
              <button
                onClick={toggleMute}
                className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted || volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 md:w-5 md:h-5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 md:w-5 md:h-5" />
                )}
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  showVolume ? "w-20 md:w-24 opacity-100" : "w-0 opacity-0"
                }`}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 appearance-none bg-white/20 rounded-full cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                    [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
                  aria-label="Volume"
                />
              </div>
            </div>

            {/* Settings (Quality + Audio) */}
            {(qualityLevels.length > 1 || audioTracks.length > 1) && (
              <div ref={settingsMenuRef} className="relative">
                <button
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition"
                  aria-label="Settings"
                >
                  <Settings className="w-3.5 h-3.5 md:w-5 md:h-5" />
                </button>
                {showSettingsMenu && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-black/95 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden shadow-2xl">
                    {qualityLevels.length > 1 && (
                      <>
                        <p className="px-3 py-2 text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium border-b border-white/5">
                          Quality{currentQuality >= 0 ? ` — ${(() => { const h = qualityLevels.find((l) => l.index === currentQuality)?.height; if (!h) return "Auto"; return h >= 2160 ? "4K" : h >= 1080 ? "1080p" : h >= 720 ? "720p" : h >= 480 ? "480p" : h >= 360 ? "360p" : `${h}p`; })()}` : ""}
                        </p>
                        <button
                          onClick={() => switchQuality(-1)}
                          className={`w-full text-left px-3 py-2 text-xs transition flex items-center gap-2 ${
                            currentQuality === -1
                              ? "text-[#F5C542] bg-[#F5C542]/10"
                              : "text-[#F9FAFB] hover:bg-white/5"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${currentQuality === -1 ? "bg-[#F5C542]" : "bg-white/20"}`} />
                          Auto
                        </button>
                        {qualityLevels.map((level) => (
                          <button
                            key={level.index}
                            onClick={() => switchQuality(level.index)}
                            className={`w-full text-left px-3 py-2 text-xs transition flex items-center gap-2 ${
                              currentQuality === level.index
                                ? "text-[#F5C542] bg-[#F5C542]/10"
                                : "text-[#F9FAFB] hover:bg-white/5"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${currentQuality === level.index ? "bg-[#F5C542]" : "bg-white/20"}`} />
                            {level.height >= 2160 ? "4K" : level.height >= 1440 ? "2K" : level.height >= 1080 ? "1080p" : level.height >= 720 ? "720p" : level.height >= 480 ? "480p" : level.height >= 360 ? "360p" : `${level.height}p`}
                          </button>
                        ))}
                      </>
                    )}
                    {audioTracks.length > 1 && (
                      <>
                        <p className={`px-3 py-2 text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium border-b border-white/5 ${qualityLevels.length > 1 ? "mt-1" : ""}`}>
                          Audio Track
                        </p>
                        {audioTracks.map((track) => (
                          <button
                            key={track.index}
                            onClick={() => switchAudioTrack(track.index)}
                            className={`w-full text-left px-3 py-2 text-xs transition flex items-center gap-2 ${
                              selectedAudioTrack === track.index
                                ? "text-[#F5C542] bg-[#F5C542]/10"
                                : "text-[#F9FAFB] hover:bg-white/5"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${selectedAudioTrack === track.index ? "bg-[#F5C542]" : "bg-white/20"}`} />
                            {track.name}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Picture-in-Picture */}
            <button
              onClick={togglePip}
              className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition"
              aria-label="Picture in Picture"
            >
              <PictureInPicture2 className="w-3.5 h-3.5 md:w-5 md:h-5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition"
              aria-label={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {fullscreen ? (
                <Minimize className="w-3.5 h-3.5 md:w-5 md:h-5" />
              ) : (
                <Maximize className="w-3.5 h-3.5 md:w-5 md:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
