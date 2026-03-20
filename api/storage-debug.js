/**
 * TEMPORARY DIAGNOSTIC ENDPOINT — remove after debugging
 * GET /api/storage-debug?id={uuid}
 * Returns JSON showing which env vars are present and what each storage URL attempt returns.
 *
 * Correct storage layout:
 *   thumb_url field → object path inside bucket "thumbs"
 *   media_url field → object path inside bucket "media"
 */
export default async function handler(req, res) {
  const id = (req.query.id || "").trim();

  const out = {
    id,
    env: {
      SUPABASE_URL:               process.env.SUPABASE_URL ? process.env.SUPABASE_URL.slice(0, 60) : null,
      CHALLENGES_SUPABASE_KEY:    process.env.CHALLENGES_SUPABASE_KEY ? "set" : null,
      SUPABASE_STORAGE_URL:       process.env.SUPABASE_STORAGE_URL ? process.env.SUPABASE_STORAGE_URL.slice(0, 60) : null,
      SUPABASE_STORAGE_KEY:       process.env.SUPABASE_STORAGE_KEY ? "set" : null,
      SUPABASE_SERVICE_ROLE_KEY:  process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : null,
      SUPABASE_SERVICE_KEY:       process.env.SUPABASE_SERVICE_KEY ? "set" : null,
      SUPABASE_ANON_KEY:          process.env.SUPABASE_ANON_KEY ? "set" : null,
    },
    dbFetch: null,
    row: null,
    bucket: null,
    objectPath: null,
    source: null,
    storageAttempts: [],
  };

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.CHALLENGES_SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    out.dbFetch = "skipped — missing SUPABASE_URL or CHALLENGES_SUPABASE_KEY";
  } else {
    try {
      const dbRes = await fetch(
        `${SUPABASE_URL}/rest/v1/challenges?id=eq.${encodeURIComponent(id)}&select=thumb_url,media_url&limit=1`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      const data = await dbRes.json();
      out.dbFetch = `HTTP ${dbRes.status}`;
      if (Array.isArray(data) && data.length > 0) {
        const row = data[0];
        out.row = { thumb_url: row.thumb_url, media_url: row.media_url };

        // Correct bucket mapping:
        //   thumb_url → bucket "thumbs", objectPath = full thumb_url value
        //   media_url → bucket "media",  objectPath = full media_url value
        if (row.thumb_url) {
          out.source     = "thumb_url";
          out.bucket     = "thumbs";
          out.objectPath = row.thumb_url;
        } else if (row.media_url) {
          out.source     = "media_url";
          out.bucket     = "media";
          out.objectPath = row.media_url;
        }
      } else {
        out.dbFetch += " — no row returned";
      }
    } catch (e) {
      out.dbFetch = `ERROR: ${e.message}`;
    }
  }

  if (out.bucket && out.objectPath) {
    const DB_URL      = SUPABASE_URL || "";
    const STORE_URL   = process.env.SUPABASE_STORAGE_URL || DB_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";
    const ANON_KEY    = process.env.SUPABASE_STORAGE_KEY || SUPABASE_KEY || "";

    const publicUrl        = `${STORE_URL}/storage/v1/object/public/${out.bucket}/${out.objectPath}`;
    const authenticatedUrl = `${STORE_URL}/storage/v1/object/authenticated/${out.bucket}/${out.objectPath}`;

    const candidates = [
      SERVICE_KEY && { label: "service-role + authenticated", url: authenticatedUrl,
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } },
      { label: "public", url: publicUrl, headers: {} },
      ANON_KEY && { label: "anon + authenticated", url: authenticatedUrl,
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } },
    ].filter(Boolean);

    for (const { label, url, headers } of candidates) {
      try {
        const r = await fetch(url, { headers });
        const ct = r.headers.get("content-type") || "";
        let body = "";
        if (!r.ok || !ct.startsWith("image/")) {
          body = (await r.text()).slice(0, 200);
        }
        out.storageAttempts.push({
          label, url,
          status: r.status,
          contentType: ct,
          success: r.ok && ct.startsWith("image/"),
          error: body || undefined,
        });
        if (r.ok && ct.startsWith("image/")) break;
      } catch (e) {
        out.storageAttempts.push({ label, url, error: e.message });
      }
    }
  }

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json(out);
}
