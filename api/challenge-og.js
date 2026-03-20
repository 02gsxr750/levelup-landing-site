const APEX = "https://joinlevelupapp.com";
const FALLBACK_IMAGE = `${APEX}/og-image.png`;
const APP_STORE = "https://apps.apple.com/us/app/level-up-challenges/id6754522127";
const GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=com.marshellventures.levelup";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function esc(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function resolveStorageUrl(raw, supabaseUrl) {
  if (!raw) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `${supabaseUrl}/storage/v1/object/public/${raw}`;
}

async function fetchChallenge(id) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.CHALLENGES_SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!UUID_REGEX.test(id) || !SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/challenges?id=eq.${encodeURIComponent(id)}&select=title,description,thumb_url,media_url&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!res.ok) {
      console.error(`[challenge-og] Supabase fetch failed: ${res.status}`);
      return null;
    }
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (e) {
    console.error(`[challenge-og] Supabase exception: ${e.message}`);
    return null;
  }
}

function buildHtml({ id, title, description, proxyImageUrl, found }) {
  const t = esc(title);
  const d = esc(description);
  const u = `${APEX}/challenge/${id}`;
  const img = esc(proxyImageUrl);
  const hasImage = proxyImageUrl !== FALLBACK_IMAGE;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t}</title>
  <meta name="description" content="${d}" />
  <meta property="og:title" content="${t}" />
  <meta property="og:description" content="${d}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="${img}" />
  <meta property="og:url" content="${esc(u)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${t}" />
  <meta name="twitter:description" content="${d}" />
  <meta name="twitter:image" content="${img}" />
  <link rel="canonical" href="${esc(u)}" />
  <link rel="icon" type="image/png" href="${APEX}/favicon.png" />
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body{min-height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
    body{
      min-height:100vh;
      display:flex;
      flex-direction:column;
      background:radial-gradient(ellipse at top,#1a0a2e 0%,#0d0518 40%,#050509 100%);
      color:#fff;
    }
    a{color:inherit;text-decoration:none}
    header{
      display:flex;align-items:center;justify-content:space-between;
      padding:16px;max-width:672px;margin:0 auto;width:100%;
    }
    .back-btn{
      display:flex;align-items:center;gap:8px;
      font-size:14px;color:#9ca3af;background:none;border:none;cursor:pointer;
      transition:color .15s;
    }
    .back-btn:hover{color:#fff}
    .back-arrow{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
    .logo-img{width:32px;height:32px;object-fit:contain}
    main{
      flex:1;display:flex;flex-direction:column;align-items:center;
      padding:16px 16px 64px;max-width:672px;margin:0 auto;width:100%;
    }
    .media-wrap{
      width:100%;margin-bottom:24px;border-radius:16px;overflow:hidden;
      background:rgba(0,0,0,.4);aspect-ratio:16/9;position:relative;
    }
    .media-wrap img{width:100%;height:100%;object-fit:cover;display:block}
    .media-placeholder{
      width:100%;aspect-ratio:16/9;border-radius:16px;
      border:1px solid rgba(255,255,255,.1);
      display:flex;align-items:center;justify-content:center;
      background:linear-gradient(135deg,#1a0a2e 0%,#0d0518 60%,#1a0a2e 100%);
      margin-bottom:24px;
    }
    .media-placeholder img{width:96px;height:96px;object-fit:contain;opacity:.6}
    .play-btn{
      position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
      background:rgba(0,0,0,.2);
    }
    .play-circle{
      width:56px;height:56px;border-radius:50%;
      background:rgba(0,0,0,.6);backdrop-filter:blur(4px);
      border:1px solid rgba(255,255,255,.2);
      display:flex;align-items:center;justify-content:center;
    }
    .play-icon{width:24px;height:24px;fill:#fff;margin-left:2px}
    .text-section{width:100%;margin-bottom:32px;text-align:center}
    h1{font-size:24px;font-weight:700;color:#fff;margin-bottom:8px;line-height:1.3}
    .meta-text{font-size:14px;color:#9ca3af;line-height:1.6}
    .cta-wrap{width:100%;max-width:384px;margin:0 auto 32px}
    .cta-label{font-size:12px;color:#9ca3af;text-align:center;margin-bottom:8px}
    .btn-open{
      display:block;width:100%;padding:14px;text-align:center;
      font-size:16px;font-weight:600;color:#000;border:none;cursor:pointer;
      border-radius:9999px;margin-bottom:12px;
      background:linear-gradient(135deg,#00d4ff 0%,#6366f1 50%,#a855f7 100%);
      box-shadow:0 0 30px rgba(99,102,241,.5);
      text-decoration:none;
    }
    .store-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .btn-store{
      display:flex;align-items:center;justify-content:center;gap:6px;
      padding:10px;font-size:14px;font-weight:600;border:none;cursor:pointer;
      border-radius:9999px;text-decoration:none;
    }
    .btn-ios{background:linear-gradient(135deg,#fff 0%,#e5e5ea 100%);color:#000;box-shadow:0 0 20px rgba(229,229,234,.3)}
    .btn-android{background:#22c55e;color:#000;box-shadow:0 0 20px rgba(34,197,94,.3)}
    .store-icon{width:16px;height:16px;flex-shrink:0}
    .brand{
      width:100%;max-width:384px;margin:0 auto;
      padding-top:24px;border-top:1px solid rgba(255,255,255,.1);
      text-align:center;
    }
    .brand-row{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:12px}
    .brand-name{font-weight:800;letter-spacing:.14em;font-size:14px}
    .brand-desc{font-size:12px;color:#9ca3af;line-height:1.6}
    footer{
      border-top:1px solid rgba(255,255,255,.1);
      padding:16px;text-align:center;
    }
    .footer-links{display:flex;justify-content:center;gap:16px;font-size:12px;color:#9ca3af}
    .footer-links a:hover{color:#fff}
  </style>
</head>
<body>
  <header>
    <a href="${APEX}" class="back-btn">
      <svg class="back-arrow" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
      Level Up
    </a>
    <img src="${APEX}/favicon.png" alt="Level Up" class="logo-img" />
  </header>

  <main>
    ${hasImage
      ? `<div class="media-wrap">
           <img src="${img}" alt="${t}" />
           <div class="play-btn">
             <div class="play-circle">
               <svg class="play-icon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
             </div>
           </div>
         </div>`
      : `<div class="media-placeholder">
           <img src="${APEX}/favicon.png" alt="Level Up" />
         </div>`
    }

    <div class="text-section">
      ${!found
        ? `<h1>Challenge Not Found</h1>
           <p class="meta-text">This challenge may have ended or been removed. Download Level Up to find more challenges.</p>`
        : `<h1>${t}</h1>
           <p class="meta-text">${d}</p>`
      }
    </div>

    <div class="cta-wrap">
      <p class="cta-label">Open the Level Up app to view this challenge</p>
      <a href="${APP_STORE}" class="btn-open">Open in App</a>
      <div class="store-row">
        <a href="${APP_STORE}" class="btn-store btn-ios" target="_blank" rel="noopener noreferrer">
          <svg class="store-icon" viewBox="0 0 814 1000" fill="currentColor">
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.6-150.3-107.2L74.6 740.6c-67.6-99.8-111.5-254.3-111.5-401 0-149.9 78.4-229.1 195.3-229.1 79.4 0 137.3 53.9 179.4 53.9 40.4 0 103.6-57.9 196.1-57.9 38.7 0 149.8 3.2 238.7 109.5zM549.5 64.3c36.4-42.8 63.1-102.7 63.1-162.6 0-8.3-.6-16.6-2-24.3-59.9 2.3-132.3 39.9-176.2 86.7-32.8 36.4-63.7 96.3-63.7 157.1 0 9 1.4 18 2 20.9 3.8.6 9.6 1.5 15.3 1.5 54.2 0 121.9-35.7 161.5-79.3z"/>
          </svg>
          App Store
        </a>
        <a href="${GOOGLE_PLAY}" class="btn-store btn-android" target="_blank" rel="noopener noreferrer">
          <svg class="store-icon" viewBox="0 0 512 512" fill="currentColor">
            <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l232.6-232.6L47 0zm425.7 225.8L371.7 168l-67.6 67.6L371.7 303l102.2-58.7c14.1-8.3 14.1-28.5-.2-37.5zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
          </svg>
          Google Play
        </a>
      </div>
    </div>

    <div class="brand">
      <div class="brand-row">
        <img src="${APEX}/favicon.png" alt="Level Up" class="logo-img" />
        <span class="brand-name">LEVEL UP</span>
      </div>
      <p class="brand-desc">The challenge-based social platform. Compete, vote, earn coins &amp; XP, and build your reputation.</p>
    </div>
  </main>

  <footer>
    <div class="footer-links">
      <a href="${APEX}">Home</a>
      <a href="${APEX}/privacy">Privacy</a>
      <a href="mailto:support@joinlevelupapp.com">Support</a>
    </div>
  </footer>
</body>
</html>`;
}

export default async function handler(req, res) {
  const id = (req.query.id || "").trim();
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";

  console.log(`[challenge-og] hit — id="${id}" host="${host}"`);

  // Defaults
  let title = "Level Up Challenge";
  let description = "Join this challenge on Level Up. Compete, vote, and earn coins & XP.";
  let proxyImageUrl = FALLBACK_IMAGE;
  let found = false;

  const validUuid = UUID_REGEX.test(id);
  if (validUuid) {
    const challenge = await fetchChallenge(id);
    if (challenge) {
      found = true;
      if (challenge.title) title = `${challenge.title} · Level Up`;
      if (challenge.description) description = challenge.description;
      // Point og:image at our proxy — keeps storage private
      proxyImageUrl = `${APEX}/api/challenge-og-image?id=${encodeURIComponent(id)}`;
      console.log(`[challenge-og] found challenge — title="${challenge.title}" proxy="${proxyImageUrl}"`);
    } else {
      console.log(`[challenge-og] challenge not found — id="${id}"`);
    }
  } else {
    console.log(`[challenge-og] invalid uuid — id="${id}"`);
  }

  console.log(`[challenge-og] final og:image="${proxyImageUrl}"`);

  const html = buildHtml({ id, title, description, proxyImageUrl, found });

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
  res.status(200).send(html);
};
