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

async function fetchChallengeForMeta(id: string): Promise<{
  title: string;
  description: string;
  image: string;
  creator: string | null;
}> {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
  const FALLBACK_IMAGE = "https://joinlevelupapp.com/og-image.png";

  const defaults = {
    title: "Level Up Challenge",
    description: "Join this challenge on Level Up. Compete, vote, and earn coins & XP.",
    image: FALLBACK_IMAGE,
    creator: null,
  };

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return defaults;

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/challenges?id=eq.${encodeURIComponent(id)}&select=id,title,description,thumbnail_url,video_thumbnail_url,creator_name,username&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) return defaults;

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return defaults;

    const c = data[0];
    return {
      title: c.title ? `${c.title} · Level Up` : defaults.title,
      description: c.description || defaults.description,
      image: c.thumbnail_url || c.video_thumbnail_url || FALLBACK_IMAGE,
      creator: c.creator_name || c.username || null,
    };
  } catch {
    return defaults;
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
