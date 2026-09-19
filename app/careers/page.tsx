import Link from 'next/link';

export default function CareersPage() {
  return <main className="min-h-screen bg-background px-6 py-20 text-foreground"><div className="mx-auto max-w-3xl"><Link href="/" className="text-sm underline">Back to Idrak AI</Link><h1 className="mt-12 text-5xl font-bold tracking-tight">Build the future of learning.</h1><p className="mt-6 text-lg text-muted-foreground">We are building tools that help students understand difficult ideas and learn with confidence.</p><p className="mt-8 text-muted-foreground">There are no open roles at the moment. Check back soon.</p></div></main>;
}
