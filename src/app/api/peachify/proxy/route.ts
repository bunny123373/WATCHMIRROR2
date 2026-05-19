import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  if (!url.startsWith("https://peachify.top/")) {
    return NextResponse.redirect(url);
  }

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!res.ok) return NextResponse.redirect(url);

    let html = await res.text();

    // Override window.open before any other script runs
    html = html.replace(
      "<head>",
      `<head><script>window.open = function(){ return null; };</script>`
    );

    // Strip document.onclick / ontouchend assignments
    html = html.replace(/document\.onclick\s*=\s*\w+\s*;?/g, "document.onclick = null;");
    html = html.replace(/document\.ontouchend\s*=\s*\w+\s*;?/g, "document.ontouchend = null;");

    // Strip sandbox/iframe detection checks that show error messages
    html = html.replace(
      /if\s*\(\s*document\[[\s\S]{0,200}?sandbox[\s\S]{0,500}?\)\s*\{[\s\S]{0,200}?\}/gi,
      "if(false){}"
    );

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch {
    return NextResponse.redirect(url);
  }
}
