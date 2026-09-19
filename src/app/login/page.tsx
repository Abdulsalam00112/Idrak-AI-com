'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { IdrakLogo } from '@/components/illustrations';

export default function LoginPage() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false); const [error, setError] = useState(''); const router = useRouter();
  async function handleSubmit(e: React.FormEvent) { e.preventDefault(); setLoading(true); setError(''); try { const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }); if (!response.ok) throw new Error('Invalid email or password.'); router.push('/dashboard'); router.refresh(); } catch (err) { setError(err instanceof Error ? err.message : 'Unable to sign in.'); } finally { setLoading(false); } }
  return (<div className="min-h-screen bg-cream flex items-center justify-center p-4"><div className="w-full max-w-md"><div className="text-center mb-8"><Link href="/" className="inline-flex mb-6"><IdrakLogo /></Link><h1 className="text-4xl font-black text-navy tracking-tight">Welcome back</h1><p className="text-ink-soft mt-2">Sign in to continue your learning journey.</p></div><Card padding="xl" className="bg-white"><form onSubmit={handleSubmit} className="space-y-5"><Input label="Email address" type="email" placeholder="you@example.com" icon={Mail} value={email} onChange={e => setEmail(e.target.value)} required /><Input label="Password" type="password" placeholder="Enter your password" icon={Lock} value={password} onChange={e => setPassword(e.target.value)} required />{error && <p role="alert" className="text-sm text-red-600">{error}</p>}<Button type="submit" variant="coral" size="lg" fullWidth loading={loading} iconRight={loading ? Loader2 : ArrowRight}>Sign in</Button></form><p className="text-center mt-6 text-sm text-ink-soft">Don&apos;t have an account? <Link href="/signup" className="font-bold text-coral hover:underline">Create one free</Link></p></Card></div></div>);
}
