/**
 * /api/challenge-og-image?id={uuid}
 *
 * Secure server-side image proxy for challenge thumbnails.
 *
 * Storage path format stored in DB:
 *   thumb_url / media_url = "challenges/{creator_id}/thumb/{file}.webp"
 *   First segment = bucket name ("challenges")
 *   Remainder     = object path within that bucket
 *
 * Supabase Storage download endpoints:
 *   Public bucket:   GET /storage/v1/object/public/{bucket}/{objectPath}
 *   Private bucket:  GET /storage/v1/object/authenticated/{bucket}/{objectPath}
 *                    (requires Authorization: Bearer {key} + apikey header)
 *
 * Required env vars:
 *   SUPABASE_URL              DB project URL — used for challenge row lookup
 *   CHALLENGES_SUPABASE_KEY   DB project anon key
 *
 * Optional env vars (for image fetch from a different Supabase project):
 *   SUPABASE_STORAGE_URL        Storage project URL (if different from DB project)
 *   SUPABASE_SERVICE_ROLE_KEY   Service-role key — preferred; can access any private bucket
 *   SUPABASE_SERVICE_KEY        Alias for SUPABASE_SERVICE_ROLE_KEY (legacy)
 *   SUPABASE_STORAGE_KEY        Anon/service key for the storage project
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FALLBACK_REDIRECT = "https://joinlevelupapp.com/og-image.png";

async function fetchChallengeThumb(id) {
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
    const chosen = thumbUrl || mediaUrl;
    const source = thumbUrl ? "thumb_url" : mediaUrl ? "media_url" : "none";

    console.log(`[proxy] DB row  thumb_url="${thumbUrl}"`);
    console.log(`[proxy] DB row  media_url="${mediaUrl}"`);
    console.log(`[proxy] selected source="${source}" value="${chosen}"`);

    if (chosen) {
      const slashIdx = chosen.indexOf("/");
      const bucket = slashIdx !== -1 ? chosen.slice(0, slashIdx) : chosen;
      const objectPath = slashIdx !== -1 ? chosen.slice(slashIdx + 1) : "";
      console.log(`[proxy] path parsed  bucket="${bucket}"  objectPath="${objectPath}"`);
    }
    return chosen;
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

async function fetchStorageImage(storagePath) {
  const DB_URL    = process.env.SUPABASE_URL || "";
  const STORE_URL = process.env.SUPABASE_STORAGE_URL || DB_URL;

  // SUPABASE_SERVICE_ROLE_KEY is the canonical name; SUPABASE_SERVICE_KEY is the legacy alias
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ||
                      process.env.SUPABASE_SERVICE_KEY || "";
  // Anon/service key for the storage project (separate from DB project credentials)
  const ANON_KEY = process.env.SUPABASE_STORAGE_KEY ||
                   process.env.CHALLENGES_SUPABASE_KEY ||
                   process.env.SUPABASE_ANON_KEY || "";

  const isFullUrl = storagePath.startsWith("http://") || storagePath.startsWith("https://");

  // Path parsing (for log clarity only — storagePath is used directly in URLs below)
  if (!isFullUrl) {
    const slashIdx = storagePath.indexOf("/");
    const bucket = storagePath.slice(0, slashIdx);
    const objectPath = storagePath.slice(slashIdx + 1);
    // Correct Supabase Storage URL layouts:
    //   public:        {STORE_URL}/storage/v1/object/public/{bucket}/{objectPath}
    //   authenticated: {STORE_URL}/storage/v1/object/authenticated/{bucket}/{objectPath}
    // storagePath = "{bucket}/{objectPath}" so it maps directly onto both URL forms.
    console.log(`[proxy] storage config  STORE_URL="${STORE_URL}"`);
    console.log(`[proxy] storage config  SERVICE_KEY=${SERVICE_KEY ? "set" : "(not set)"}`);
    console.log(`[proxy] storage config  ANON_KEY=${ANON_KEY ? "set" : "(not set)"}`);
    console.log(`[proxy] effective urls:`);
    console.log(`[proxy]   public        → ${STORE_URL}/storage/v1/object/public/${storagePath}`);
    console.log(`[proxy]   authenticated → ${STORE_URL}/storage/v1/object/authenticated/${storagePath}`);
  }

  const candidates = [];

  if (isFullUrl) {
    if (SERVICE_KEY) candidates.push({
      label: "full-url + service-role",
      url: storagePath,
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    });
    if (ANON_KEY) candidates.push({
      label: "full-url + anon",
      url: storagePath,
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    candidates.push({ label: "full-url + no-auth", url: storagePath, headers: {} });
  } else {
    // 1. Service-role key: /object/authenticated/ endpoint (private bucket access)
    if (SERVICE_KEY) {
      candidates.push({
        label: "service-role + authenticated (STORE_URL)",
        url: `${STORE_URL}/storage/v1/object/authenticated/${storagePath}`,
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
      });
      if (STORE_URL !== DB_URL) {
        candidates.push({
          label: "service-role + authenticated (DB_URL)",
          url: `${DB_URL}/storage/v1/object/authenticated/${storagePath}`,
          headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
        });
      }
    }

    // 2. Public URL (works if bucket is set to public)
    candidates.push({
      label: "public (STORE_URL)",
      url: `${STORE_URL}/storage/v1/object/public/${storagePath}`,
      headers: {},
    });
    if (STORE_URL !== DB_URL) {
      candidates.push({
        label: "public (DB_URL)",
        url: `${DB_URL}/storage/v1/object/public/${storagePath}`,
        headers: {},
      });
    }

    // 3. Anon key: /object/authenticated/ endpoint (works if bucket has anon read policy)
    if (ANON_KEY) {
      candidates.push({
        label: "anon + authenticated (STORE_URL)",
        url: `${STORE_URL}/storage/v1/object/authenticated/${storagePath}`,
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
      });
      if (STORE_URL !== DB_URL) {
        candidates.push({
          label: "anon + authenticated (DB_URL)",
          url: `${DB_URL}/storage/v1/object/authenticated/${storagePath}`,
          headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
        });
      }
    }
  }

  for (const { label, url, headers } of candidates) {
    const res = await tryFetch(label, url, headers);
    if (res) return res;
  }
  return null;
}

export default async function handler(req, res) {
  const id = (req.query.id || "").trim();

  console.log(`[proxy] ════════════════════════════════`);
  console.log(`[proxy] request id="${id}"`);
  console.log(`[proxy] env SUPABASE_URL="${process.env.SUPABASE_URL ? process.env.SUPABASE_URL.slice(0, 50) : "(not set)"}"`);
  console.log(`[proxy] env CHALLENGES_SUPABASE_KEY=${process.env.CHALLENGES_SUPABASE_KEY ? "set" : "(not set)"}`);
  console.log(`[proxy] env SUPABASE_STORAGE_URL="${process.env.SUPABASE_STORAGE_URL || "(not set — falling back to SUPABASE_URL)"}"`);
  console.log(`[proxy] env SUPABASE_STORAGE_KEY=${process.env.SUPABASE_STORAGE_KEY ? "set" : "(not set)"}`);
  console.log(`[proxy] env SUPABASE_SERVICE_ROLE_KEY=${process.env.SUPABASE_SERVICE_ROLE_KEY ? "set ← preferred" : "(not set)"}`);
  console.log(`[proxy] env SUPABASE_SERVICE_KEY=${process.env.SUPABASE_SERVICE_KEY ? "set ← alias" : "(not set)"}`);

  if (!UUID_REGEX.test(id)) {
    console.log("[proxy] invalid uuid → fallback");
    res.setHeader("Location", FALLBACK_REDIRECT);
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.status(302).send("");
  }

  const storagePath = await fetchChallengeThumb(id);

  if (!storagePath) {
    console.log("[proxy] no storage path → fallback");
    res.setHeader("Location", FALLBACK_REDIRECT);
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(302).send("");
  }

  const imageRes = await fetchStorageImage(storagePath);

  if (!imageRes) {
    console.log("[proxy] all storage attempts failed → fallback");
    console.log("[proxy] ── ACTION REQUIRED ──────────────────────────────────────");
    console.log("[proxy] The 'challenges' bucket is not in the current SUPABASE_URL project.");
    console.log("[proxy] Add to Vercel env vars:");
    console.log("[proxy]   SUPABASE_STORAGE_URL = <mobile app Supabase project URL>");
    console.log("[proxy]   SUPABASE_SERVICE_ROLE_KEY = <service-role key for that project>");
    console.log("[proxy] ─────────────────────────────────────────────────────────");
    res.setHeader("Location", FALLBACK_REDIRECT);
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.status(302).send("");
  }

  const contentType = imageRes.headers.get("content-type") || "image/jpeg";
  const buffer = Buffer.from(await imageRes.arrayBuffer());
  console.log(`[proxy] ✓ serving ${buffer.length} bytes "${contentType}"`);

  res.setHeader("Content-Type", contentType);
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).send(buffer);
}
