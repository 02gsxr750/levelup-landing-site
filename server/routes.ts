import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { stripe, SPONSOR_PRICES, isValidTier } from "./lib/stripe";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  const SITE_URL = process.env.SITE_URL ?? (
    process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
      : "http://localhost:5000"
  );

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

      // Search for customer by email
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
