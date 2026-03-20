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
    return data[0].thumb_url || data[0].media_url || null;
  } catch {
    return null;
  }
}

async function fetchStorageImage(storagePath) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.CHALLENGES_SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !SUPABASE_KEY || !storagePath) return null;

  // If it's already a full URL, fetch directly with auth
  const isFullUrl = storagePath.startsWith("http://") || storagePath.startsWith("https://");

  // Build the authenticated storage endpoint for private bucket access
  // Format: /storage/v1/object/{bucketName}/{objectPath}
  // storagePath is e.g. "challenges/uuid/thumb/file.webp" — first segment is bucket name
  let fetchUrl;
  if (isFullUrl) {
    fetchUrl = storagePath;
  } else {
    // The path includes the bucket as the first segment
    fetchUrl = `${SUPABASE_URL}/storage/v1/object/${storagePath}`;
  }

  console.log(`[challenge-og-image] fetching storage: ${fetchUrl}`);

  try {
    const res = await fetch(fetchUrl, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    console.log(`[challenge-og-image] storage status: ${res.status}`);
    if (!res.ok) return null;
    return res;
  } catch (e) {
    console.error(`[challenge-og-image] storage fetch error: ${e.message}`);
    return null;
  }
}

module.exports = async function handler(req, res) {
  const id = (req.query.id || "").trim();
  console.log(`[challenge-og-image] request — id="${id}"`);

  // Validate UUID
  if (!UUID_REGEX.test(id)) {
    console.log(`[challenge-og-image] invalid uuid — redirecting to fallback`);
    res.setHeader("Location", FALLBACK_REDIRECT);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.status(302).send("");
    return;
  }

  // Step 1: Fetch the storage path from Supabase
  const storagePath = await fetchChallengeThumb(id);
  console.log(`[challenge-og-image] thumb path="${storagePath}"`);

  if (!storagePath) {
    console.log(`[challenge-og-image] no thumb found — redirecting to fallback`);
    res.setHeader("Location", FALLBACK_REDIRECT);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(302).send("");
    return;
  }

  // Step 2: Fetch the image from private Supabase Storage using server credentials
  const imageRes = await fetchStorageImage(storagePath);

  if (!imageRes) {
    console.log(`[challenge-og-image] storage fetch failed — redirecting to fallback`);
    res.setHeader("Location", FALLBACK_REDIRECT);
    res.setHeader("Cache-Control", "public, max-age=300");
    res.status(302).send("");
    return;
  }

  // Step 3: Pipe the image back to the crawler/browser
  const contentType = imageRes.headers.get("content-type") || "image/jpeg";
  console.log(`[challenge-og-image] serving image — content-type="${contentType}"`);

  const buffer = Buffer.from(await imageRes.arrayBuffer());

  res.setHeader("Content-Type", contentType);
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).send(buffer);
};
