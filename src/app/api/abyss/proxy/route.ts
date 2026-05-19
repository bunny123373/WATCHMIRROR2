import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const playerUrl = `https://abyssplayer.com/${id}`;

  try {
    const res = await fetch(playerUrl, {
      signal: AbortSignal.timeout(10000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) {
      return NextResponse.redirect(playerUrl);
    }

    let html = await res.text();

    // Strip the ad/popup scripts
    // 1. Remove the popup URL array and abyssConfig popup assignment
    html = html.replace(
      /var\s+urls\s*=\s*\[[^\]]*\]\s*;([^;]*abyssConfig\s*=\s*\{[^}]*popups[^}]*\})?/g,
      "var urls = []; window.abyssConfig = {popups: []};"
    );

    // 2. Remove the request tracking script (popup attempts)
    html = html.replace(
      /loadScript\('https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/fuckadblock[^']*'\)[^;]*;?/g,
      ""
    );

    // 3. Null out the onclick/ontouchend assignments that trigger popups
    html = html.replace(
      /document\.onclick\s*=\s*JRD\s*;/g,
      "document.onclick = null;"
    );
    html = html.replace(
      /document\.ontouchend\s*=\s*JRD\s*;/g,
      "document.ontouchend = null;"
    );

    // 4. Remove the JRD function definition (the popup opener)
    html = html.replace(
      /const\s+JRD\s*=\s*\(\)\s*=>\s*\{[\s\S]*?document\.write\('<center[^>]*>[\s\S]*?<\/center>'\)\s*;[\s\S]*?\};/g,
      "const JRD = () => { document.onclick = null; document.ontouchend = null; const overlay = document.getElementById('overlay'); if(overlay) overlay.remove(); if(typeof jwplayer != 'undefined' && typeof jwplayer().play == 'function') { jwplayer().play(); } };"
    );

    // 5. Remove Google Analytics tracking
    html = html.replace(
      /<script\s+async\s+src="https:\/\/www\.googletagmanager\.com[^<]*<\/script>/g,
      ""
    );
    html = html.replace(
      /window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\];[\s\S]*?gtag\('config',\s*'[^']*'\);/g,
      ""
    );

    // 6. Remove the pixel/view tracking
    html = html.replace(
      /const\s+viewPlaying\s*=\s*setInterval[\s\S]*?\},\s*1e3\s*\);/g,
      ""
    );

    // 7. Remove the initial tracking pixel
    html = html.replace(
      /let\s+img\s*=\s*document\.createElement\('img'\)[\s\S]*?document\.body\.appendChild\(img\);/g,
      ""
    );

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch {
    return NextResponse.redirect(playerUrl);
  }
}
