import Link from 'next/link';

export default function PrivacyPage() {
  return <main className="min-h-screen bg-background px-6 py-20 text-foreground"><div className="mx-auto max-w-3xl"><Link href="/" className="text-sm underline">Back to Idrak AI</Link><h1 className="mt-12 text-5xl font-bold tracking-tight">Privacy at Idrak AI</h1><p className="mt-6 text-lg text-muted-foreground">Your learning data belongs to you. Idrak uses account, study, and conversation data to provide the product, secure your account, and improve learning experiences.</p><h2 className="mt-10 text-2xl font-semibold">Your controls</h2><p className="mt-3 text-muted-foreground">You can update your profile, delete your account, and request removal of uploaded materials through the application.</p></div></main>;
}
