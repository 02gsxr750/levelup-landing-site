/**
 * /api/challenge-og-image?id={uuid}
 *
 * Secure server-side image proxy for challenge thumbnails.
 *
 * CORRECT storage layout (confirmed via Supabase query):
 *   thumb_url field value  → full object path inside bucket "thumbs"
 *   media_url field value  → full object path inside bucket "media"
 *   "challenges" is a DIRECTORY prefix inside those buckets, NOT a bucket name.
 *
 * Examples:
 *   thumb_url = "challenges/{id}/thumb/file.webp"  → bucket="thumbs",  object="challenges/{id}/thumb/file.webp"
 *   media_url = "challenges/{id}/file.jpeg"         → bucket="media",   object="challenges/{id}/file.jpeg"
 *
 * Supabase Storage download endpoints:
 *   Public bucket:   GET /storage/v1/object/public/{bucket}/{objectPath}
 *   Private bucket:  GET /storage/v1/object/authenticated/{bucket}/{objectPath}
 *                    (requires Authorization: Bearer {key} + apikey header)
 *
 * Required env vars:
 *   SUPABASE_URL              DB project URL — used for challenge row lookup
 *   CHALLENGES_SUPABASE_KEY   DB project anon/service key
 *
 * Optional env vars (for image fetch from a different Supabase project):
 *   SUPABASE_STORAGE_URL        Storage project URL (if different from DB project)
 *   SUPABASE_SERVICE_ROLE_KEY   Service-role key — preferred; bypasses RLS on any bucket
 *   SUPABASE_SERVICE_KEY        Alias for SUPABASE_SERVICE_ROLE_KEY (legacy)
 *   SUPABASE_STORAGE_KEY        Anon/service key for the storage project
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FALLBACK_REDIRECT = "https://joinlevelupapp.com/og-image.png";
const DEBUG_ID = "0b925a18-c7c2-4aa8-8691-a8acc1dc1be7";

/**
 * Returns { source, bucket, objectPath } or null.
 *
 * source:     "thumb_url" | "media_url"
 * bucket:     Supabase Storage bucket name ("thumbs" or "media")
 * objectPath: full object path within that bucket (the raw DB field value)
 */
async function fetchChallengeStorage(id) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.CHALLENGES_SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log("[proxy] SUPABASE_URL or CHALLENGES_SUPABASE_KEY not set — cannot fetch row");
    return null;
  }
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/challenges?id=eq.${encodeURIComponent(id)}&select=thumb_url,media_url&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!res.ok) {
      console.log(`[proxy] DB query failed: HTTP ${res.status} — ${(await res.text()).slice(0, 120)}`);
      return null;
    }
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      console.log("[proxy] challenge row not found in DB");
      return null;
    }
    const row = data[0];
    const thumbUrl = row.thumb_url || null;
    const mediaUrl = row.media_url || null;

    console.log(`[proxy] DB row  thumb_url="${thumbUrl}"`);
    console.log(`[proxy] DB row  media_url="${mediaUrl}"`);

    if (thumbUrl) {
      // thumb_url is an object path within the "thumbs" bucket
      const result = { source: "thumb_url", bucket: "thumbs", objectPath: thumbUrl };
      console.log(`[proxy] selected source="${result.source}" bucket="${result.bucket}" objectPath="${result.objectPath}"`);
      return result;
    }
    if (mediaUrl) {
      // media_url is an object path within the "media" bucket
      const result = { source: "media_url", bucket: "media", objectPath: mediaUrl };
      console.log(`[proxy] selected source="${result.source}" bucket="${result.bucket}" objectPath="${result.objectPath}"`);
      return result;
    }

    console.log("[proxy] both thumb_url and media_url are null/empty");
    return null;
  } catch (e) {
    console.error(`[proxy] DB fetch exception: ${e.message}`);
    return null;
  }
}

async function tryFetch(label, url, headers) {
  try {
    console.log(`[proxy] → trying [${label}]`);
    console.log(`[proxy]   url: ${url}`);
    const res = await fetch(url, { headers });
    const ct = res.headers.get("content-type") || "";
    if (res.ok && ct.startsWith("image/")) {
      console.log(`[proxy]   ✓ HTTP ${res.status} "${ct}" — success`);
      return res;
    }
    let body = "";
    try { body = (await res.text()).slice(0, 160); } catch {}
    console.log(`[proxy]   ✗ HTTP ${res.status} "${ct}" — ${body}`);
    return null;
  } catch (e) {
    console.log(`[proxy]   ✗ fetch error: ${e.message}`);
    return null;
  }
}

/**
 * @param {{ bucket: string, objectPath: string }} storage
 */
async function fetchStorageImage({ bucket, objectPath }) {
  const DB_URL    = process.env.SUPABASE_URL || "";
  const STORE_URL = process.env.SUPABASE_STORAGE_URL || DB_URL;

  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ||
                      process.env.SUPABASE_SERVICE_KEY || "";
  const ANON_KEY    = process.env.SUPABASE_STORAGE_KEY ||
                      process.env.CHALLENGES_SUPABASE_KEY ||
                      process.env.SUPABASE_ANON_KEY || "";

  // Build canonical Supabase Storage paths
  // /storage/v1/object/public/{bucket}/{objectPath}
  // /storage/v1/object/authenticated/{bucket}/{objectPath}
  const publicUrl        = `${STORE_URL}/storage/v1/object/public/${bucket}/${objectPath}`;
  const authenticatedUrl = `${STORE_URL}/storage/v1/object/authenticated/${bucket}/${objectPath}`;

  console.log(`[proxy] storage config  STORE_URL="${STORE_URL}"`);
  console.log(`[proxy] storage config  bucket="${bucket}"  objectPath="${objectPath}"`);
  console.log(`[proxy] storage config  SERVICE_KEY=${SERVICE_KEY ? "set" : "(not set)"}`);
  console.log(`[proxy] storage config  ANON_KEY=${ANON_KEY ? "set" : "(not set)"}`);
  console.log(`[proxy] effective urls:`);
  console.log(`[proxy]   public        → ${publicUrl}`);
  console.log(`[proxy]   authenticated → ${authenticatedUrl}`);

  const candidates = [];

  // 1. Service-role key via authenticated endpoint (best — bypasses RLS)
  if (SERVICE_KEY) {
    candidates.push({
      label: "service-role + authenticated",
      url: authenticatedUrl,
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    });
  }

  // 2. Public endpoint (works if bucket is set to public)
  candidates.push({ label: "public", url: publicUrl, headers: {} });

  // 3. Anon/storage key via authenticated endpoint (works if bucket has anon-read RLS policy)
  if (ANON_KEY) {
    candidates.push({
      label: "anon + authenticated",
      url: authenticatedUrl,
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
  }

  for (const { label, url, headers } of candidates) {
    const res = await tryFetch(label, url, headers);
    if (res) return res;
  }
  return null;
}

export default async function handler(req, res) {
  const id = (req.query.id || "").trim();
  const isDebugId = id === DEBUG_ID;

  console.log(`[proxy] ════════════════════════════════`);
  console.log(`[proxy] request id="${id}"${isDebugId ? " ← DEBUG CHALLENGE" : ""}`);
  console.log(`[proxy] env SUPABASE_URL="${process.env.SUPABASE_URL ? process.env.SUPABASE_URL.slice(0, 50) : "(not set)"}"`);
  console.log(`[proxy] env CHALLENGES_SUPABASE_KEY=${process.env.CHALLENGES_SUPABASE_KEY ? "set" : "(not set)"}`);
  console.log(`[proxy] env SUPABASE_STORAGE_URL="${process.env.SUPABASE_STORAGE_URL || "(not set — falling back to SUPABASE_URL)"}"`);
  console.log(`[proxy] env SUPABASE_STORAGE_KEY=${process.env.SUPABASE_STORAGE_KEY ? "set" : "(not set)"}`);
  console.log(`[proxy] env SUPABASE_SERVICE_ROLE_KEY=${process.env.SUPABASE_SERVICE_ROLE_KEY ? "set ← preferred" : "(not set)"}`);
  console.log(`[proxy] env SUPABASE_SERVICE_KEY=${process.env.SUPABASE_SERVICE_KEY ? "set ← alias" : "(not set)"}`);

  if (!UUID_REGEX.test(id)) {
    console.log("[proxy] invalid uuid → fallback");
    res.setHeader("Location", FALLBACK_REDIRECT);
    res.setHeader("Cache-Control", "no-store");
    return res.status(302).send("");
  }

  const storageInfo = await fetchChallengeStorage(id);

  if (!storageInfo) {
    console.log("[proxy] no storage info → fallback");
    res.setHeader("Location", FALLBACK_REDIRECT);
    res.setHeader("Cache-Control", "no-store");
    return res.status(302).send("");
  }

  const imageRes = await fetchStorageImage(storageInfo);

  if (!imageRes) {
    console.log("[proxy] all storage attempts failed → fallback");
    console.log(`[proxy] ── DIAGNOSIS ────────────────────────────────────────────`);
    console.log(`[proxy] bucket="${storageInfo.bucket}" objectPath="${storageInfo.objectPath}"`);
    console.log(`[proxy] Check: does SUPABASE_STORAGE_URL point to the mobile app Supabase project?`);
    console.log(`[proxy] Check: does SUPABASE_SERVICE_ROLE_KEY belong to that same project?`);
    console.log(`[proxy] ─────────────────────────────────────────────────────────`);
    res.setHeader("Location", FALLBACK_REDIRECT);
    res.setHeader("Cache-Control", "no-store");
    return res.status(302).send("");
  }

  const contentType = imageRes.headers.get("content-type") || "image/jpeg";
  const buffer = Buffer.from(await imageRes.arrayBuffer());
  console.log(`[proxy] ✓ serving ${buffer.length} bytes "${contentType}" (source=${storageInfo.source})`);

  res.setHeader("Content-Type", contentType);
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).send(buffer);
}
