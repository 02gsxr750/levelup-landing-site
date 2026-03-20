/**
 * Image proxy for challenge thumbnails.
 *
 * Storage layout: thumb_url in DB stores a relative path like
 *   "challenges/{creator_id}/thumb/{file}.webp"
 * The FIRST segment is the bucket name, the rest is the object path.
 *
 * The mobile app's Supabase project may differ from SUPABASE_URL (the DB project).
 * Set SUPABASE_STORAGE_URL to the mobile app's Supabase project URL to enable
 * real image fetching. Falls back to SUPABASE_URL.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FALLBACK_REDIRECT = "https://joinlevelupapp.com/og-image.png";

async function fetchChallengeThumb(id) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.CHALLENGES_SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/challenges?id=eq.${encodeURIComponent(id)}&select=thumb_url,media_url&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    // Prefer thumb_url (WebP thumbnail) over media_url (full media)
    return data[0].thumb_url || data[0].media_url || null;
  } catch {
    return null;
  }
}

/**
 * Try to fetch an image from Supabase Storage.
 * Tries (in order):
 *   1. Public URL on SUPABASE_STORAGE_URL (mobile app project)
 *   2. Public URL on SUPABASE_URL (DB project, in case storage was added)
 *   3. Authenticated URL on SUPABASE_STORAGE_URL
 *   4. Authenticated URL on SUPABASE_URL
 * Returns the first successful fetch Response, or null.
 */
async function fetchStorageImage(storagePath) {
  const DB_URL = process.env.SUPABASE_URL || "";
  const STORAGE_URL = process.env.SUPABASE_STORAGE_URL || DB_URL;
  const KEY = process.env.CHALLENGES_SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || "";

  const isFullUrl = storagePath.startsWith("http://") || storagePath.startsWith("https://");

  // Candidates to try in priority order
  const candidates = isFullUrl
    ? [
        // Already an absolute URL — try with and without auth
        { url: storagePath, headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } },
        { url: storagePath, headers: {} },
      ]
    : [
        // 1. Public on storage project
        { url: `${STORAGE_URL}/storage/v1/object/public/${storagePath}`, headers: {} },
        // 2. Public on DB project (fallback if same project)
        ...(STORAGE_URL !== DB_URL
          ? [{ url: `${DB_URL}/storage/v1/object/public/${storagePath}`, headers: {} }]
          : []),
        // 3. Authenticated on storage project
        { url: `${STORAGE_URL}/storage/v1/object/${storagePath}`,
          headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } },
        // 4. Authenticated on DB project
        ...(STORAGE_URL !== DB_URL
          ? [{ url: `${DB_URL}/storage/v1/object/${storagePath}`,
              headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }]
          : []),
      ];

  for (const { url, headers } of candidates) {
    try {
      console.log(`[challenge-og-image] trying: ${url}`);
      const res = await fetch(url, { headers });
      console.log(`[challenge-og-image] → status ${res.status} content-type="${res.headers.get("content-type")}"`);
      if (res.ok) {
        const ct = res.headers.get("content-type") || "";
        // Only accept image responses
        if (ct.startsWith("image/")) return res;
        console.log(`[challenge-og-image] non-image content-type — skipping`);
      }
    } catch (e) {
      console.log(`[challenge-og-image] fetch error: ${e.message}`);
    }
  }
  return null;
}

export default async function handler(req, res) {
  const id = (req.query.id || "").trim();
  console.log(`[challenge-og-image] request — id="${id}"`);
  console.log(`[challenge-og-image] SUPABASE_URL="${process.env.SUPABASE_URL}"`);
  console.log(`[challenge-og-image] SUPABASE_STORAGE_URL="${process.env.SUPABASE_STORAGE_URL || "(not set — using SUPABASE_URL)"}"`);

  if (!UUID_REGEX.test(id)) {
    res.setHeader("Location", FALLBACK_REDIRECT);
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.status(302).send("");
  }

  const storagePath = await fetchChallengeThumb(id);
  console.log(`[challenge-og-image] storage path="${storagePath}"`);

  if (!storagePath) {
    console.log(`[challenge-og-image] no path found — fallback`);
    res.setHeader("Location", FALLBACK_REDIRECT);
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(302).send("");
  }

  const imageRes = await fetchStorageImage(storagePath);

  if (!imageRes) {
    console.log(`[challenge-og-image] all attempts failed — fallback`);
    res.setHeader("Location", FALLBACK_REDIRECT);
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.status(302).send("");
  }

  const contentType = imageRes.headers.get("content-type") || "image/jpeg";
  const buffer = Buffer.from(await imageRes.arrayBuffer());
  console.log(`[challenge-og-image] serving ${buffer.length} bytes as "${contentType}"`);

  res.setHeader("Content-Type", contentType);
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).send(buffer);
}
