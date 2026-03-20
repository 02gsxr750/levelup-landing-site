const CANONICAL_ORIGIN = "https://joinlevelupapp.com";
const FALLBACK_IMAGE = `${CANONICAL_ORIGIN}/og-image.png`;

function escapeHtmlAttr(str) {
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
  const SUPABASE_KEY =
    process.env.CHALLENGES_SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

  const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_REGEX.test(id) || !SUPABASE_URL || !SUPABASE_KEY) return null;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/challenges?id=eq.${encodeURIComponent(id)}&select=title,description,thumb_url,media_url&limit=1`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}

async function getBaseHtml() {
  try {
    const res = await fetch("https://www.joinlevelupapp.com/", {
      headers: { "User-Agent": "Vercel-OG-Bot/1.0" },
    });
    return await res.text();
  } catch {
    return null;
  }
}

function injectOGTags(html, { title, description, image, url }) {
  const t = escapeHtmlAttr(title);
  const d = escapeHtmlAttr(description);
  const img = escapeHtmlAttr(image);
  const u = escapeHtmlAttr(url);

  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${d}" />`
    )
    .replace(
      /<meta property="og:title"[^>]*>/,
      `<meta property="og:title" content="${t}" />`
    )
    .replace(
      /<meta property="og:description"[^>]*>/,
      `<meta property="og:description" content="${d}" />`
    )
    .replace(
      /<meta property="og:type"[^>]*>/,
      `<meta property="og:type" content="website" />`
    )
    .replace(
      /<meta property="og:image"[^>]*>/,
      `<meta property="og:image" content="${img}" />`
    )
    .replace(/<meta property="og:image:width"[^>]*>\s*/g, "")
    .replace(/<meta property="og:image:height"[^>]*>\s*/g, "")
    .replace(
      /<meta name="twitter:card"[^>]*>/,
      `<meta name="twitter:card" content="summary_large_image" />`
    )
    .replace(
      /<meta name="twitter:image"[^>]*>/,
      `<meta name="twitter:image" content="${img}" />`
    )
    .replace(
      "</head>",
      `  <meta property="og:url" content="${u}" />\n` +
        `  <meta name="twitter:title" content="${t}" />\n` +
        `  <meta name="twitter:description" content="${d}" />\n` +
        `  <link rel="canonical" href="${u}" />\n` +
        `</head>`
    );
}

module.exports = async function handler(req, res) {
  const id = req.query.id || "";

  console.log(`[challenge-og] vercel fn invoked id="${id}"`);

  let title = "Level Up Challenge";
  let description =
    "Join this challenge on Level Up. Compete, vote, and earn coins & XP.";
  let image = FALLBACK_IMAGE;
  const url = `${CANONICAL_ORIGIN}/challenge/${id}`;

  const challenge = await fetchChallenge(id);
  if (challenge) {
    if (challenge.title) title = `${challenge.title} · Level Up`;
    if (challenge.description) description = challenge.description;
    const rawImg = challenge.thumb_url || challenge.media_url;
    const resolved = resolveStorageUrl(rawImg, process.env.SUPABASE_URL || "");
    if (resolved) image = resolved;
    console.log(`[challenge-og] found: title="${title}" image="${image}"`);
  } else {
    console.log(`[challenge-og] challenge not found or invalid id="${id}" — using fallback`);
  }

  let html = await getBaseHtml();

  if (!html) {
    html = `<!DOCTYPE html><html lang="en"><head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${escapeHtmlAttr(title)}</title>
      <meta name="description" content="${escapeHtmlAttr(description)}" />
      <meta property="og:title" content="${escapeHtmlAttr(title)}" />
      <meta property="og:description" content="${escapeHtmlAttr(description)}" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="${escapeHtmlAttr(image)}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="${escapeHtmlAttr(image)}" />
    </head><body><script>window.location.replace('/challenge/${id}');</script></body></html>`;
  } else {
    html = injectOGTags(html, { title, description, image, url });
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
  res.status(200).send(html);
};
