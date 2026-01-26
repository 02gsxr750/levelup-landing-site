import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const SPONSOR_PRICES: Record<string, string | undefined> = {
  starter: process.env.STRIPE_SPONSOR_STARTER_PRICE_ID,
  pro: process.env.STRIPE_SPONSOR_PRO_PRICE_ID,
  elite: process.env.STRIPE_SPONSOR_ELITE_PRICE_ID,
};

function isValidTier(tier: string): tier is 'starter' | 'pro' | 'elite' {
  return ['starter', 'pro', 'elite'].includes(tier);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const { tier, returnPath } = req.body;

    if (!tier || !isValidTier(tier)) {
      return res.status(400).json({ error: 'Invalid tier. Must be starter, pro, or elite.' });
    }

    const priceId = SPONSOR_PRICES[tier];
    if (!priceId) {
      return res.status(500).json({ error: `Price ID not configured for tier: ${tier}` });
    }

    const SITE_URL = process.env.SITE_URL || 'https://joinlevelupapp.com';
    const successUrl = `${SITE_URL}/sponsors/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = returnPath ? `${SITE_URL}${returnPath}` : `${SITE_URL}/sponsors`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
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
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
}
