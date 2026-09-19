import { getCurrentUser, jsonError, jsonSuccess, withErrorHandling } from '@/lib/server'
import { getStripe } from '@/lib/stripe'
import { IDRAK_PRODUCTS, type IdrakPlan } from '@/lib/products'
import { randomBytes } from 'node:crypto'

export const runtime = 'nodejs'

export const POST = withErrorHandling(async (request: Request) => {
  const user = await getCurrentUser()
  if (!user) return jsonError('Authentication required', 401, 'UNAUTHORIZED')

  const body = await request.json() as { plan?: unknown }
  if (typeof body.plan !== 'string' || body.plan.length > 32) return jsonError('Invalid subscription plan', 400, 'INVALID_PLAN')
  const plan = body.plan as IdrakPlan
  const product = IDRAK_PRODUCTS[plan]
  if (!product) return jsonError('Invalid subscription plan', 400, 'INVALID_PLAN')

  const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price_data: { currency: product.currency, product_data: { name: product.name, description: product.description }, unit_amount: product.priceInCents, recurring: { interval: 'month' } }, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.id,
    metadata: { userId: user.id, planCode: product.id },
    subscription_data: { metadata: { userId: user.id, planCode: product.id } },
    success_url: `${origin}/subscription?checkout=success`,
    cancel_url: `${origin}/subscription?checkout=cancelled`,
    integration_identifier: `idrak-${randomBytes(4).toString('hex')}`,
  })
  return jsonSuccess({ url: session.url })
}, 'Unable to initialize payment', 'PAYMENT_INITIALIZATION_FAILED')
