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
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!res.ok) return NextResponse.redirect(url);

    let html = await res.text();

    // Use <base> tag so all relative URLs (/_next/static/, /cdn-cgi/, etc.)
    // resolve to peachify.top instead of localhost:5000
    const blockerScript = `
<script>
window.open = function(){ return null; };

(function(){
  function killBlank(root){
    if(!root) root = document;
    (root.querySelectorAll ? root.querySelectorAll('a[target="_blank"]') : []).forEach(function(a){
      a.setAttribute('target', '_self');
      if(a.href && !a.href.includes('peachify.top')) a.href = 'javascript:void(0)';
    });
  }
  if(document.body){ killBlank(document); }
  else { document.addEventListener('DOMContentLoaded', function(){ killBlank(document); }); }

  var _obs = new MutationObserver(function(ms){
    ms.forEach(function(m){
      m.addedNodes.forEach(function(n){
        if(n.tagName === 'A' && n.getAttribute('target') === '_blank'){
          n.setAttribute('target', '_self');
          if(n.href && !n.href.includes('peachify.top')) n.href = 'javascript:void(0)';
        } else if(n.querySelectorAll){
          n.querySelectorAll('a[target="_blank"]').forEach(function(a){
            a.setAttribute('target', '_self');
            if(a.href && !a.href.includes('peachify.top')) a.href = 'javascript:void(0)';
          });
        }
      });
    });
  });
  _obs.observe(document.documentElement, {childList:true, subtree:true});
})();
</script>
`;

    html = html.replace("<head>", `<head>${blockerScript}<base href="https://peachify.top/">`);

    html = html.replace(
      /<script[^>]*src="https:\/\/stats\.peachify\.top[^>]*><\/script>/g,
      ""
    );
    html = html.replace(
      /<script[^>]*data-website-id[^>]*><\/script>/g,
      ""
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
