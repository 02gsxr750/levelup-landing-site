import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: 'Email required to access billing portal. Please contact support@joinlevelupapp.com for assistance.' 
      });
    }

    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return res.status(404).json({ 
        error: 'No subscription found for this email. Please contact support@joinlevelupapp.com for assistance.' 
      });
    }

    const customerId = customers.data[0].id;
    const SITE_URL = process.env.SITE_URL || 'https://joinlevelupapp.com';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${SITE_URL}/sponsors`,
    });

    return res.json({ url: portalSession.url });
  } catch (error: any) {
    console.error('Stripe portal error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create portal session' });
  }
}
