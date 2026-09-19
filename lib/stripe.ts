import 'server-only'

import Stripe from 'stripe'

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) throw new Error('Stripe is not configured')
  return new Stripe(secretKey, { apiVersion: '2026-08-26.dahlia' })
}
