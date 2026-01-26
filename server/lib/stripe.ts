import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY not set - Stripe functionality will be unavailable");
}

export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const SPONSOR_PRICES = {
  starter: process.env.STRIPE_SPONSOR_STARTER_PRICE_ID,
  pro: process.env.STRIPE_SPONSOR_PRO_PRICE_ID,
  elite: process.env.STRIPE_SPONSOR_ELITE_PRICE_ID,
} as const;

export type SponsorTier = keyof typeof SPONSOR_PRICES;

export function isValidTier(tier: string): tier is SponsorTier {
  return tier === "starter" || tier === "pro" || tier === "elite";
}
