import { pool } from '@/db'
import { getStripe } from '@/lib/stripe'
import Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!signature || !secret) return new Response('Webhook configuration missing', { status: 400 })

  let event: Stripe.Event
  let stripe: ReturnType<typeof getStripe>
  try {
    stripe = getStripe()
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.payment_status !== 'unpaid' && session.mode === 'subscription' && session.client_reference_id) {
        const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id
        let periodEnd: Date | null = null
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const end = subscription.items.data[0]?.current_period_end
          periodEnd = end ? new Date(end * 1000) : null
        }
        await pool.query(`INSERT INTO idrak_subscriptions (user_id, plan_code, status, current_period_end, provider, provider_reference, updated_at) VALUES ($1, $2, 'active', $3, 'stripe', $4, now()) ON CONFLICT (user_id) DO UPDATE SET plan_code = EXCLUDED.plan_code, status = EXCLUDED.status, current_period_end = EXCLUDED.current_period_end, provider = EXCLUDED.provider, provider_reference = EXCLUDED.provider_reference, updated_at = now()`, [session.client_reference_id, session.metadata?.planCode ?? 'premium', periodEnd, subscriptionId ?? session.id])
      }
    }
    if (event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.client_reference_id) await pool.query(`UPDATE idrak_subscriptions SET status = 'expired', updated_at = now() WHERE user_id = $1`, [session.client_reference_id])
    }
    if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription
      const status = subscription.status === 'active' || subscription.status === 'trialing' ? 'active' : subscription.status === 'canceled' ? 'cancelled' : 'expired'
      const periodEnd = subscription.items.data[0]?.current_period_end
      await pool.query(`UPDATE idrak_subscriptions SET status = $1, plan_code = COALESCE($2, plan_code), current_period_end = $3, updated_at = now() WHERE provider_reference = $4`, [status, subscription.metadata?.planCode ?? null, periodEnd ? new Date(periodEnd * 1000) : null, subscription.id])
    }
    return Response.json({ received: true })
  } catch {
    return new Response('Webhook processing failed', { status: 500 })
  }
}
