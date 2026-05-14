const BASE = "https://api.mux.com/video/v1";

function auth(tokenId?: string, tokenSecret?: string): string {
  const id = tokenId || process.env.MUX_TOKEN_ID || "";
  const secret = tokenSecret || process.env.MUX_TOKEN_SECRET || "";
  return Buffer.from(`${id}:${secret}`).toString("base64");
}

function headers(tokenId?: string, tokenSecret?: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Basic ${auth(tokenId, tokenSecret)}`,
  };
}

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

export async function createDirectUpload(tokenId?: string, tokenSecret?: string): Promise<MuxUploadResponse> {
  const res = await fetch(`${BASE}/uploads`, {
    method: "POST",
    headers: headers(tokenId, tokenSecret),
    body: JSON.stringify({
      cors_origin: "*",
      new_asset_settings: { playback_policy: ["public"], video_quality: "basic" },
    }),
  });
  if (!res.ok) throw new Error(`Mux upload create failed: ${res.status}`);
  const data = await res.json();
  return { id: data.data.id, url: data.data.url, status: data.data.status };
}

export async function getAssetStatus(assetId: string, tokenId?: string, tokenSecret?: string): Promise<MuxAssetResponse> {
  const res = await fetch(`${BASE}/assets/${assetId}`, {
    headers: headers(tokenId, tokenSecret),
  });
  if (!res.ok) throw new Error(`Mux asset fetch failed: ${res.status}`);
  const data = await res.json();
  return { id: data.data.id, status: data.data.status, playback_ids: data.data.playback_ids };
}

export async function getUploadStatus(uploadId: string, tokenId?: string, tokenSecret?: string): Promise<{ status: string; asset_id?: string }> {
  const res = await fetch(`${BASE}/uploads/${uploadId}`, {
    headers: headers(tokenId, tokenSecret),
  });
  if (!res.ok) throw new Error(`Mux upload fetch failed: ${res.status}`);
  const data = await res.json();
  return { status: data.data.status, asset_id: data.data.asset_id };
}

export async function addAudioTrack(assetId: string, url: string, languageCode: string, name: string, tokenId?: string, tokenSecret?: string): Promise<void> {
  const res = await fetch(`${BASE}/assets/${assetId}/tracks`, {
    method: "POST",
    headers: headers(tokenId, tokenSecret),
    body: JSON.stringify({ url, type: "audio", language_code: languageCode, name }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Mux add track failed (${res.status}): ${err}`);
  }
}

export async function addTextTrack(assetId: string, url: string, languageCode: string, name: string, tokenId?: string, tokenSecret?: string): Promise<void> {
  const res = await fetch(`${BASE}/assets/${assetId}/tracks`, {
    method: "POST",
    headers: headers(tokenId, tokenSecret),
    body: JSON.stringify({ url, type: "text", language_code: languageCode, name, closed_captions: false, text_type: "subtitles" }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Mux add track failed (${res.status}): ${err}`);
  }
}

export function playbackUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}
