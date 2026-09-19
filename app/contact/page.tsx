import Link from 'next/link'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-cream px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-black uppercase tracking-widest text-coral">Contact Idrak</p>
        <h1 className="text-4xl font-black text-navy">Let&apos;s build better learning.</h1>
        <p className="mt-4 leading-7 text-ink-soft">For school partnerships, sponsored seats, or product questions, email our team at hello@idrak.ai.</p>
        <Link href="/" className="mt-8 inline-flex font-bold text-coral">Back to Idrak</Link>
      </div>
    </main>
  )
}
