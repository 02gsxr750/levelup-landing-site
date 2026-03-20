/**
 * TEMPORARY DIAGNOSTIC ENDPOINT — remove after debugging
 * GET /api/storage-debug?id={uuid}
 * Returns JSON showing exactly which env vars are present and what each storage URL attempt returns.
 */
export default async function handler(req, res) {
  const id = (req.query.id || "").trim();

  const out = {
    id,
    env: {
      SUPABASE_URL:               process.env.SUPABASE_URL ? process.env.SUPABASE_URL.slice(0, 50) : null,
      CHALLENGES_SUPABASE_KEY:    process.env.CHALLENGES_SUPABASE_KEY ? "set" : null,
      SUPABASE_STORAGE_URL:       process.env.SUPABASE_STORAGE_URL ? process.env.SUPABASE_STORAGE_URL.slice(0, 50) : null,
      SUPABASE_STORAGE_KEY:       process.env.SUPABASE_STORAGE_KEY ? "set" : null,
      SUPABASE_SERVICE_ROLE_KEY:  process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : null,
      SUPABASE_SERVICE_KEY:       process.env.SUPABASE_SERVICE_KEY ? "set" : null,
      SUPABASE_ANON_KEY:          process.env.SUPABASE_ANON_KEY ? "set" : null,
    },
    dbFetch: null,
    row: null,
    storagePath: null,
    pathParse: null,
    storageAttempts: [],
  };

  // DB fetch
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
        out.row = { thumb_url: data[0].thumb_url, media_url: data[0].media_url };
        out.storagePath = data[0].thumb_url || data[0].media_url || null;
        out.selectedSource = data[0].thumb_url ? "thumb_url" : data[0].media_url ? "media_url" : "none";
      } else {
        out.dbFetch += " — no row returned";
      }
    } catch (e) {
      out.dbFetch = `ERROR: ${e.message}`;
    }
  }

  if (out.storagePath) {
    const sp = out.storagePath;
    const si = sp.indexOf("/");
    out.pathParse = {
      raw: sp,
      bucket: si !== -1 ? sp.slice(0, si) : sp,
      objectPath: si !== -1 ? sp.slice(si + 1) : "",
    };

    const DB_URL      = SUPABASE_URL || "";
    const STORE_URL   = process.env.SUPABASE_STORAGE_URL || DB_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";
    const ANON_KEY    = process.env.SUPABASE_STORAGE_KEY || SUPABASE_KEY || "";

    const candidates = [
      SERVICE_KEY && { label: "service-role+authenticated (STORE_URL)",
        url: `${STORE_URL}/storage/v1/object/authenticated/${sp}`,
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } },
      { label: "public (STORE_URL)",
        url: `${STORE_URL}/storage/v1/object/public/${sp}`, headers: {} },
      ANON_KEY && { label: "anon+authenticated (STORE_URL)",
        url: `${STORE_URL}/storage/v1/object/authenticated/${sp}`,
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } },
      STORE_URL !== DB_URL && { label: "service-role+authenticated (DB_URL)",
        url: `${DB_URL}/storage/v1/object/authenticated/${sp}`,
        headers: SERVICE_KEY ? { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } : {} },
      STORE_URL !== DB_URL && { label: "public (DB_URL)",
        url: `${DB_URL}/storage/v1/object/public/${sp}`, headers: {} },
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
