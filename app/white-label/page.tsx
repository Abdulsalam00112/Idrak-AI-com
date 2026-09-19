import Link from 'next/link';

export default function WhiteLabelPage() {
  return <main className="min-h-screen bg-background px-6 py-20 text-foreground"><div className="mx-auto max-w-3xl"><Link href="/" className="text-sm underline">Back to Idrak AI</Link><h1 className="mt-12 text-5xl font-bold tracking-tight">Idrak for institutions</h1><p className="mt-6 text-lg text-muted-foreground">Bring guided practice, topic intelligence, and evidence-based tutoring to your learning community.</p><p className="mt-8 text-muted-foreground">Institutional plans are currently invite-only. Contact the Idrak team to discuss access.</p></div></main>;
}
