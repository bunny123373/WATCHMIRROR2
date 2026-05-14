const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID || "";
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET || "";
const AUTH = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString("base64");
const BASE = "https://api.mux.com/video/v1";

interface MuxUploadResponse {
  id: string;
  url: string;
  asset_id?: string;
  status: string;
}

interface MuxAssetResponse {
  id: string;
  status: string;
  playback_ids?: { id: string; policy: string }[];
}

export async function createDirectUpload(): Promise<MuxUploadResponse> {
  const res = await fetch(`${BASE}/uploads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${AUTH}`,
    },
    body: JSON.stringify({
      cors_origin: "*",
      new_asset_settings: {
        playback_policy: ["public"],
        video_quality: "basic",
      },
    }),
  });
  if (!res.ok) throw new Error(`Mux upload create failed: ${res.status}`);
  const data = await res.json();
  return { id: data.data.id, url: data.data.url, status: data.data.status };
}

export async function getAssetStatus(assetId: string): Promise<MuxAssetResponse> {
  const res = await fetch(`${BASE}/assets/${assetId}`, {
    headers: { Authorization: `Basic ${AUTH}` },
  });
  if (!res.ok) throw new Error(`Mux asset fetch failed: ${res.status}`);
  const data = await res.json();
  return {
    id: data.data.id,
    status: data.data.status,
    playback_ids: data.data.playback_ids,
  };
}

export async function getUploadStatus(uploadId: string): Promise<{ status: string; asset_id?: string }> {
  const res = await fetch(`${BASE}/uploads/${uploadId}`, {
    headers: { Authorization: `Basic ${AUTH}` },
  });
  if (!res.ok) throw new Error(`Mux upload fetch failed: ${res.status}`);
  const data = await res.json();
  return { status: data.data.status, asset_id: data.data.asset_id };
}

export async function addAudioTrack(assetId: string, url: string, languageCode: string, name: string): Promise<void> {
  const res = await fetch(`${BASE}/assets/${assetId}/tracks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${AUTH}`,
    },
    body: JSON.stringify({
      url,
      type: "audio",
      language_code: languageCode,
      name,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Mux add track failed (${res.status}): ${err}`);
  }
}

export function playbackUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}
