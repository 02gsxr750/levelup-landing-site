/**
 * /api/challenge-og-image?id={uuid}
 *
 * Secure image proxy for challenge thumbnails.
 *
 * Storage layout: thumb_url / media_url in the DB store relative paths like
 *   "challenges/{creator_id}/thumb/{file}.webp"
 * The FIRST segment is the Supabase Storage bucket name, the rest is the object path.
 *
 * Priority for key selection (highest privilege first):
 *   SUPABASE_SERVICE_KEY  → service_role, can access any private bucket
 *   CHALLENGES_SUPABASE_KEY / SUPABASE_ANON_KEY → anon, only public buckets
 *
 * If storage is on a different Supabase project than the database, set:
 *   SUPABASE_STORAGE_URL  → that project's URL (falls back to SUPABASE_URL)
 *   SUPABASE_STORAGE_KEY  → that project's anon/service key (falls back to above keys)
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FALLBACK_REDIRECT = "https://joinlevelupapp.com/og-image.png";

async function fetchChallengeThumb(id) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.CHALLENGES_SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log("[challenge-og-image] DB env vars missing — cannot fetch challenge");
    return null;
  }
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/challenges?id=eq.${encodeURIComponent(id)}&select=thumb_url,media_url&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!res.ok) {
      console.log(`[challenge-og-image] DB query failed: ${res.status}`);
      return null;
    }
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      console.log(`[challenge-og-image] challenge not found in DB`);
      return null;
    }
    const row = data[0];
    const chosen = row.thumb_url || row.media_url || null;
    console.log(`[challenge-og-image] DB row — thumb_url="${row.thumb_url}" media_url="${row.media_url}"`);
    console.log(`[challenge-og-image] selected source="${chosen}" (${row.thumb_url ? "thumb_url" : row.media_url ? "media_url" : "none"})`);
    return chosen;
  } catch (e) {
    console.error(`[challenge-og-image] DB fetch exception: ${e.message}`);
    return null;
  }
}

async function tryFetch(url, headers) {
  try {
    console.log(`[challenge-og-image] trying: ${url}`);
    const res = await fetch(url, { headers });
    const ct = res.headers.get("content-type") || "";
    console.log(`[challenge-og-image] → ${res.status} "${ct}"`);
    if (res.ok && ct.startsWith("image/")) return res;
    return null;
  } catch (e) {
    console.log(`[challenge-og-image] → error: ${e.message}`);
    return null;
  }
}

async function fetchStorageImage(storagePath) {
  const DB_URL    = process.env.SUPABASE_URL || "";
  const STORE_URL = process.env.SUPABASE_STORAGE_URL || DB_URL;

  // Key priority: service key (private buckets) → storage-specific key → anon key
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";
  const ANON_KEY    = process.env.SUPABASE_STORAGE_KEY ||
                      process.env.CHALLENGES_SUPABASE_KEY ||
                      process.env.SUPABASE_ANON_KEY || "";

  const isFullUrl = storagePath.startsWith("http://") || storagePath.startsWith("https://");

  const candidates = isFullUrl
    ? [
        { label: "direct+service", url: storagePath,
          headers: SERVICE_KEY ? { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } : null },
        { label: "direct+anon",   url: storagePath,
          headers: ANON_KEY ? { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } : {} },
        { label: "direct-no-auth", url: storagePath, headers: {} },
      ]
    : [
        // Service role key — can access private buckets
        SERVICE_KEY && { label: "service-auth on storage-url",
          url: `${STORE_URL}/storage/v1/object/${storagePath}`,
          headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } },
        SERVICE_KEY && STORE_URL !== DB_URL && { label: "service-auth on db-url",
          url: `${DB_URL}/storage/v1/object/${storagePath}`,
          headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } },

        // Public URL (works when bucket is public)
        { label: "public on storage-url",
          url: `${STORE_URL}/storage/v1/object/public/${storagePath}`,
          headers: {} },
        STORE_URL !== DB_URL && { label: "public on db-url",
          url: `${DB_URL}/storage/v1/object/public/${storagePath}`,
          headers: {} },

        // Anon auth (works when bucket has anon read policy)
        ANON_KEY && { label: "anon-auth on storage-url",
          url: `${STORE_URL}/storage/v1/object/${storagePath}`,
          headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } },
        ANON_KEY && STORE_URL !== DB_URL && { label: "anon-auth on db-url",
          url: `${DB_URL}/storage/v1/object/${storagePath}`,
          headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } },
      ].filter(Boolean);

  for (const { label, url, headers } of candidates) {
    if (!headers) continue; // key not set, skip
    const res = await tryFetch(url, headers);
    if (res) {
      console.log(`[challenge-og-image] ✓ succeeded with: ${label}`);
      return res;
    }
  }
  return null;
}

export default async function handler(req, res) {
  const id = (req.query.id || "").trim();

  console.log(`[challenge-og-image] ──── request id="${id}" ────`);
  console.log(`[challenge-og-image] SUPABASE_URL="${process.env.SUPABASE_URL || "(not set)"}"`);
  console.log(`[challenge-og-image] SUPABASE_STORAGE_URL="${process.env.SUPABASE_STORAGE_URL || "(using SUPABASE_URL)"}"`);
  console.log(`[challenge-og-image] SUPABASE_SERVICE_KEY="${process.env.SUPABASE_SERVICE_KEY ? "set" : "(not set — private bucket access limited)"}"`);
  console.log(`[challenge-og-image] CHALLENGES_SUPABASE_KEY="${process.env.CHALLENGES_SUPABASE_KEY ? "set" : "(not set)"}"`);

  if (!UUID_REGEX.test(id)) {
    console.log(`[challenge-og-image] invalid uuid → fallback`);
    res.setHeader("Location", FALLBACK_REDIRECT);
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.status(302).send("");
  }

  const storagePath = await fetchChallengeThumb(id);

  if (!storagePath) {
    console.log(`[challenge-og-image] no storage path → fallback`);
    res.setHeader("Location", FALLBACK_REDIRECT);
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(302).send("");
  }

  const imageRes = await fetchStorageImage(storagePath);

  if (!imageRes) {
    console.log(`[challenge-og-image] all storage attempts failed → fallback`);
    console.log(`[challenge-og-image] ACTION REQUIRED: set SUPABASE_SERVICE_KEY (same project) or SUPABASE_STORAGE_URL (different project)`);
    res.setHeader("Location", FALLBACK_REDIRECT);
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.status(302).send("");
  }

  const contentType = imageRes.headers.get("content-type") || "image/jpeg";
  const buffer = Buffer.from(await imageRes.arrayBuffer());
  console.log(`[challenge-og-image] ✓ serving ${buffer.length} bytes "${contentType}"`);

  res.setHeader("Content-Type", contentType);
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).send(buffer);
}
