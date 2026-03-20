import type { Express } from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";
import { storage } from "./storage";
import { stripe, SPONSOR_PRICES, isValidTier } from "./lib/stripe";

function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

type ChallengeMetaResult = {
  title: string;
  description: string;
  image: string;
  creator: string | null;
  _debug?: string;
};

async function fetchChallengeForMeta(id: string): Promise<ChallengeMetaResult> {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  // Prefer CHALLENGES_SUPABASE_KEY (dedicated key) over the general SUPABASE_ANON_KEY
  const SUPABASE_ANON_KEY = process.env.CHALLENGES_SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
  const FALLBACK_IMAGE = "https://joinlevelupapp.com/og-image.png";

  const defaults: ChallengeMetaResult = {
    title: "Level Up Challenge",
    description: "Join this challenge on Level Up. Compete, vote, and earn coins & XP.",
    image: FALLBACK_IMAGE,
    creator: null,
  };

  console.log(`[challenge-meta] fetching id="${id}"`);
  console.log(`[challenge-meta] SUPABASE_URL=${SUPABASE_URL ? `set (${SUPABASE_URL.substring(0, 30)}...)` : "MISSING"}`);
  console.log(`[challenge-meta] SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY ? `set (length=${SUPABASE_ANON_KEY.length})` : "MISSING"}`);

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("[challenge-meta] WARN: Supabase env vars not configured — serving fallback metadata");
    return { ...defaults, _debug: "env_vars_missing" };
  }

  // Validate UUID format before querying to avoid 400 errors
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_REGEX.test(id)) {
    console.log(`[challenge-meta] id="${id}" is not a valid UUID — skipping DB query`);
    return { ...defaults, _debug: "invalid_uuid" };
  }

  const url = `${SUPABASE_URL}/rest/v1/challenges?id=eq.${encodeURIComponent(id)}&select=*&limit=1`;
  console.log(`[challenge-meta] querying: ${url}`);

  // Detect new publishable key format (sb_publishable_*) vs legacy JWT (eyJ*)
  const isNewKeyFormat = SUPABASE_ANON_KEY.startsWith("sb_publishable_") || SUPABASE_ANON_KEY.startsWith("sb_secret_");
  const headers: Record<string, string> = {
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };
  if (!isNewKeyFormat) {
    // Legacy JWT keys also need the apikey header
    headers["apikey"] = SUPABASE_ANON_KEY;
  }
  console.log(`[challenge-meta] using ${isNewKeyFormat ? "new publishable" : "legacy JWT"} key format`);

  try {
    const response = await fetch(url, { headers });

    console.log(`[challenge-meta] Supabase HTTP status: ${response.status}`);

    if (response.status === 401 || response.status === 403) {
      const body = await response.text();
      console.error(`[challenge-meta] AUTH ERROR ${response.status}: ${body}`);
      console.error("[challenge-meta] HINT: SUPABASE_ANON_KEY may not match the project at SUPABASE_URL, or RLS is blocking anon access");
      return { ...defaults, _debug: `auth_error_${response.status}` };
    }

    if (response.status === 400) {
      const body = await response.text();
      console.error(`[challenge-meta] QUERY ERROR 400: ${body}`);
      console.error("[challenge-meta] HINT: A selected column may not exist on the challenges table");
      return { ...defaults, _debug: "query_error_400" };
    }

    if (!response.ok) {
      const body = await response.text();
      console.error(`[challenge-meta] UNEXPECTED ERROR ${response.status}: ${body}`);
      return { ...defaults, _debug: `http_error_${response.status}` };
    }

    const data = await response.json();
    console.log(`[challenge-meta] rows returned: ${Array.isArray(data) ? data.length : "not an array"}`);

    if (!Array.isArray(data) || data.length === 0) {
      console.log(`[challenge-meta] challenge id="${id}" not found in database`);
      return { ...defaults, _debug: "not_found" };
    }

    const c = data[0];
    console.log(`[challenge-meta] found challenge. Available keys: ${Object.keys(c).join(", ")}`);

    // Resolve a Supabase Storage relative path to a full public URL
    function resolveStorageUrl(raw: string | null | undefined): string | null {
      if (!raw) return null;
      if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
      // Relative storage path — prepend the Supabase Storage public URL base
      return `${SUPABASE_URL}/storage/v1/object/public/${raw}`;
    }

    // Pick best thumbnail using actual column names from the schema
    const rawImage =
      c.thumb_url ||
      c.sponsor_banner_thumb_url ||
      c.sponsor_intro_thumb_url ||
      c.media_url ||
      null;
    const image = resolveStorageUrl(rawImage) || FALLBACK_IMAGE;

    const creator: string | null = null; // creator_id is a UUID ref; no name column on challenges table

    const result: ChallengeMetaResult = {
      title: c.title ? `${c.title} · Level Up` : defaults.title,
      description: c.description || defaults.description,
      image,
      creator,
    };

    console.log(`[challenge-meta] resolved → title="${result.title}" image="${result.image}"`);
    return result;
  } catch (err: any) {
    console.error(`[challenge-meta] NETWORK/PARSE ERROR: ${err?.message ?? err}`);
    return { ...defaults, _debug: "fetch_exception" };
  }
}

function injectChallengeMeta(html: string, meta: {
  title: string;
  description: string;
  image: string;
  canonicalUrl: string;
}): string {
  const t = escapeHtmlAttr(meta.title);
  const d = escapeHtmlAttr(meta.description);
  const img = escapeHtmlAttr(meta.image);
  const url = escapeHtmlAttr(meta.canonicalUrl);

  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/<meta name="description"[^>]*>/,
      `<meta name="description" content="${d}" />`)
    .replace(/<meta property="og:title"[^>]*>/,
      `<meta property="og:title" content="${t}" />`)
    .replace(/<meta property="og:description"[^>]*>/,
      `<meta property="og:description" content="${d}" />`)
    .replace(/<meta property="og:type"[^>]*>/,
      `<meta property="og:type" content="website" />`)
    .replace(/<meta property="og:image"[^>]*>/,
      `<meta property="og:image" content="${img}" />`)
    .replace(/<meta property="og:image:width"[^>]*>\s*/g, "")
    .replace(/<meta property="og:image:height"[^>]*>\s*/g, "")
    .replace(/<meta name="twitter:card"[^>]*>/,
      `<meta name="twitter:card" content="summary_large_image" />`)
    .replace(/<meta name="twitter:image"[^>]*>/,
      `<meta name="twitter:image" content="${img}" />`)
    .replace("</head>",
      `  <meta property="og:url" content="${url}" />\n` +
      `  <meta name="twitter:title" content="${t}" />\n` +
      `  <meta name="twitter:description" content="${d}" />\n` +
      `  <link rel="canonical" href="${url}" />\n` +
      `</head>`
    );
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  const SITE_URL = process.env.SITE_URL ?? (
    process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : "http://localhost:5000"
  );

  // Challenge image proxy — serves private Supabase Storage images publicly
  // Mirrors api/challenge-og-image.js (Vercel) for local dev parity
  app.get("/api/challenge-og-image", async (req, res) => {
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const FALLBACK = "https://joinlevelupapp.com/og-image.png";
    const id = ((req.query.id as string) || "").trim();

    if (!UUID_RE.test(id)) {
      return res.redirect(302, FALLBACK);
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.CHALLENGES_SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!SUPABASE_URL || !SUPABASE_KEY) return res.redirect(302, FALLBACK);

    let storagePath: string | null = null;
    try {
      const dbRes = await fetch(
        `${SUPABASE_URL}/rest/v1/challenges?id=eq.${encodeURIComponent(id)}&select=thumb_url,media_url&limit=1`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      if (dbRes.ok) {
        const rows = await dbRes.json();
        if (Array.isArray(rows) && rows.length > 0) {
          storagePath = rows[0].thumb_url || rows[0].media_url || null;
          console.log(`[img-proxy] selected="${storagePath}" (${rows[0].thumb_url ? "thumb_url" : "media_url"})`);
        }
      }
    } catch { /* fall through to fallback */ }

    if (!storagePath) return res.redirect(302, FALLBACK);

    const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";
    const STORE_URL   = process.env.SUPABASE_STORAGE_URL || SUPABASE_URL;
    const isFullUrl   = storagePath.startsWith("http");

    const candidates = [
      SERVICE_KEY && { url: isFullUrl ? storagePath : `${STORE_URL}/storage/v1/object/${storagePath}`,
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } },
      { url: isFullUrl ? storagePath : `${STORE_URL}/storage/v1/object/public/${storagePath}`, headers: {} },
      SUPABASE_KEY && { url: isFullUrl ? storagePath : `${STORE_URL}/storage/v1/object/${storagePath}`,
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    ].filter(Boolean) as { url: string; headers: Record<string, string> }[];

    for (const { url, headers } of candidates) {
      try {
        const imgRes = await fetch(url, { headers });
        const ct = imgRes.headers.get("content-type") || "";
        if (imgRes.ok && ct.startsWith("image/")) {
          const buf = Buffer.from(await imgRes.arrayBuffer());
          res.setHeader("Content-Type", ct);
          res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
          return res.status(200).send(buf);
        }
      } catch { /* try next */ }
    }

    return res.redirect(302, FALLBACK);
  });

  // Challenge page — server-side OG meta injection for social crawlers
  app.get("/challenge/:id", async (req, res, next) => {
    const { id } = req.params;
    const canonicalUrl = `https://joinlevelupapp.com/challenge/${id}`;

    try {
      const meta = await fetchChallengeForMeta(id);

      let templatePath: string;
      if (process.env.NODE_ENV === "production") {
        templatePath = path.resolve(__dirname, "public", "index.html");
      } else {
        templatePath = path.resolve("client", "index.html");
      }

      if (!fs.existsSync(templatePath)) {
        return next();
      }

      let html = fs.readFileSync(templatePath, "utf-8");
      html = injectChallengeMeta(html, { ...meta, canonicalUrl });

      return res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch {
      return next();
    }
  });

  // Stripe Sponsor Checkout Session
  app.post("/api/stripe/sponsors/checkout", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: "Stripe not configured" });
      }

      const { tier, returnPath } = req.body;

      if (!tier || !isValidTier(tier)) {
        return res.status(400).json({ error: "Invalid tier. Must be starter, pro, or elite." });
      }

      const priceId = SPONSOR_PRICES[tier];
      if (!priceId) {
        return res.status(500).json({ error: `Price ID not configured for tier: ${tier}` });
      }

      const successUrl = `${SITE_URL}/sponsors/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = returnPath ? `${SITE_URL}${returnPath}` : `${SITE_URL}/sponsors`;

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        allow_promotion_codes: true,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          tier,
        },
      });

      return res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe checkout error:", error);
      return res.status(500).json({ error: error.message || "Failed to create checkout session" });
    }
  });

  // Stripe Billing Portal Session
  app.post("/api/stripe/sponsors/portal", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: "Stripe not configured" });
      }

      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ 
          error: "Email required to access billing portal. Please contact support@joinlevelupapp.com for assistance." 
        });
      }

      const customers = await stripe.customers.list({
        email: email,
        limit: 1,
      });

      if (customers.data.length === 0) {
        return res.status(404).json({ 
          error: "No subscription found for this email. Please contact support@joinlevelupapp.com for assistance." 
        });
      }

      const customerId = customers.data[0].id;

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${SITE_URL}/sponsors`,
      });

      return res.json({ url: portalSession.url });
    } catch (error: any) {
      console.error("Stripe portal error:", error);
      return res.status(500).json({ error: error.message || "Failed to create portal session" });
    }
  });

  return httpServer;
}
