"use client";

import { useState, useRef } from "react";
import { Upload, Copy, Check, Loader2, Music, Link as LinkIcon, Monitor } from "lucide-react";

export default function MuxUploadSection() {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "done" | "error">("idle");
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadId, setUploadId] = useState("");
  const [assetId, setAssetId] = useState("");
  const [playbackId, setPlaybackId] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  // Add track form
  const [trackAssetId, setTrackAssetId] = useState("");
  const [trackUrl, setTrackUrl] = useState("");
  const [trackLang, setTrackLang] = useState("");
  const [trackName, setTrackName] = useState("");
  const [addingTrack, setAddingTrack] = useState(false);
  const [trackMsg, setTrackMsg] = useState("");

  const handleStartUpload = async () => {
    setError("");
    setUploadUrl("");
    setUploadId("");
    setAssetId("");
    setPlaybackId("");
    setStatus("idle");
    setProgress(0);

    if (!fileRef.current?.files?.length) {
      setError("Select a video file first");
      return;
    }

    setUploading(true);
    setStatus("uploading");
    try {
      const res = await fetch("/api/mux/create-upload", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create upload");
      setUploadUrl(data.url);
      setUploadId(data.id);

      // Upload file to Mux
      const file = fileRef.current.files[0];
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      });
      await new Promise<void>((resolve, reject) => {
        xhr.addEventListener("load", () => resolve());
        xhr.addEventListener("error", () => reject(new Error("Upload failed")));
        xhr.open("PUT", data.url);
        xhr.setRequestHeader("Content-Type", "video/mp4");
        xhr.send(file);
      });

      setStatus("processing");

      // Poll for asset
      const poll = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/mux/asset-status?uploadId=${data.id}`);
          const statusData = await statusRes.json();
          if (statusData.asset_id) {
            clearInterval(poll);
            setAssetId(statusData.asset_id);
            // Get asset details for playback ID
            const assetRes = await fetch(`/api/mux/asset-status?assetId=${statusData.asset_id}`);
            const assetData = await assetRes.json();
            if (assetData.playback_ids?.length) {
              setPlaybackId(assetData.playback_ids[0].id);
            }
            setStatus("done");
          }
        } catch {}
      }, 3000);

      // Safety timeout
      setTimeout(() => clearInterval(poll), 120000);
    } catch (e: any) {
      setError(e.message);
      setStatus("error");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleAddTrack = async () => {
    if (!trackAssetId || !trackUrl || !trackLang) return;
    setAddingTrack(true);
    setTrackMsg("");
    try {
      const res = await fetch("/api/mux/add-track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId: trackAssetId, url: trackUrl, languageCode: trackLang, name: trackName || trackLang }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed");
      }
      setTrackMsg("Audio track added successfully!");
      setTrackUrl("");
      setTrackLang("");
      setTrackName("");
    } catch (e: any) {
      setTrackMsg(e.message);
    } finally {
      setAddingTrack(false);
    }
  };

  return (
    <div className="mt-8 p-5 rounded-none bg-[#0E1015] border border-[#1F232D]">
      <div className="flex items-center gap-2 mb-5">
        <Monitor className="w-5 h-5 text-[#F5C542]" />
        <h2 className="text-base font-bold text-[#F9FAFB]">Mux Video Upload</h2>
      </div>

      {/* Upload section */}
      <div className="space-y-4 mb-8 p-4 rounded-none bg-[#050608] border border-[#1F232D]">
        <p className="text-xs text-[#9CA3AF]">Upload a video to Mux and get a playback ID for your stream source.</p>
        <input ref={fileRef} type="file" accept="video/*" className="w-full text-xs text-[#9CA3AF] file:mr-3 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-medium file:bg-[#1F232D] file:text-[#F9FAFB] hover:file:bg-[#2a2f3a]" />
        <button onClick={handleStartUpload} disabled={uploading} className="flex items-center gap-2 px-5 h-10 rounded-none gold-gradient text-[#050608] font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity text-sm">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading..." : "Upload to Mux"}
        </button>
        {status === "uploading" && progress > 0 && (
          <div className="w-full h-1.5 bg-[#1F232D] rounded-none overflow-hidden">
            <div className="h-full bg-[#F5C542] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        )}
        {status === "processing" && (
          <div className="flex items-center gap-2 text-xs text-[#F5C542]">
            <Loader2 className="w-3 h-3 animate-spin" /> Processing video...
          </div>
        )}
        {status === "done" && (
          <div className="space-y-2">
            <p className="text-xs text-[#22C55E] flex items-center gap-1"><Check className="w-3 h-3" /> Upload complete</p>
            <div className="flex items-center gap-2">
              <input readOnly value={`https://stream.mux.com/${playbackId}.m3u8`} className="flex-1 h-9 px-3 rounded-none bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] text-xs" />
              <button onClick={() => copyToClipboard(`https://stream.mux.com/${playbackId}.m3u8`)} className="p-2 rounded-none bg-[#1F232D] hover:bg-[#2a2f3a] transition-colors">
                <Copy className="w-4 h-4 text-[#9CA3AF]" />
              </button>
            </div>
            <p className="text-[10px] text-[#9CA3AF]">Asset ID: {assetId} | Playback ID: {playbackId}</p>
          </div>
        )}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>

      {/* Add Audio Track section */}
      <div className="space-y-4 p-4 rounded-none bg-[#050608] border border-[#1F232D]">
        <p className="text-xs text-[#9CA3AF]">Add an alternate audio track to an existing Mux asset.</p>
        <input type="text" value={trackAssetId} onChange={(e) => setTrackAssetId(e.target.value)} placeholder="Mux Asset ID" className="w-full h-9 px-3 rounded-none bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] text-xs placeholder-[#9CA3AF] focus:outline-none focus:border-[#F5C542]" />
        <input type="text" value={trackUrl} onChange={(e) => setTrackUrl(e.target.value)} placeholder="Audio file URL (m4a, wav, mp3)" className="w-full h-9 px-3 rounded-none bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] text-xs placeholder-[#9CA3AF] focus:outline-none focus:border-[#F5C542]" />
        <div className="flex gap-2">
          <input type="text" value={trackLang} onChange={(e) => setTrackLang(e.target.value)} placeholder="Language code (e.g. fr, es, hi)" className="flex-1 h-9 px-3 rounded-none bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] text-xs placeholder-[#9CA3AF] focus:outline-none focus:border-[#F5C542]" />
          <input type="text" value={trackName} onChange={(e) => setTrackName(e.target.value)} placeholder="Track name (optional)" className="flex-1 h-9 px-3 rounded-none bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] text-xs placeholder-[#9CA3AF] focus:outline-none focus:border-[#F5C542]" />
        </div>
        <button onClick={handleAddTrack} disabled={addingTrack || !trackAssetId || !trackUrl || !trackLang} className="flex items-center gap-2 px-5 h-10 rounded-none bg-[#F5C542] text-[#050608] font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity text-sm">
          {addingTrack ? <Loader2 className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />}
          {addingTrack ? "Adding..." : "Add Audio Track"}
        </button>
        {trackMsg && (
          <p className={`text-xs ${trackMsg.includes("success") ? "text-[#22C55E]" : "text-red-400"}`}>{trackMsg}</p>
        )}
        {playbackId && (
          <p className="text-[10px] text-[#9CA3AF]">Tip: After adding audio tracks, use Asset ID <span className="text-[#F5C542]">{assetId}</span> above to add more.</p>
        )}
      </div>
    </div>
  );
}
