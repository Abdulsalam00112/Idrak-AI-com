export const IDRAK_PRODUCTS = {
  essential: {
    id: 'essential',
    name: 'Idrak Essential',
    description: 'Focused practice, analytics, and adaptive study plans.',
    priceInCents: 1200,
    currency: 'usd',
  },
  premium: {
    id: 'premium',
    name: 'Idrak Premium',
    description: 'Full AI tutoring, advanced readiness, and unlimited learning insights.',
    priceInCents: 2400,
    currency: 'usd',
  },
} as const

export type IdrakPlan = keyof typeof IDRAK_PRODUCTS
