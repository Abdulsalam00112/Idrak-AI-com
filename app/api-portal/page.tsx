'use client';
import { LandingNav, Footer } from '@/components/nav';
import { Card, Button, Badge, SectionHeader, Tabs } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  KeyRound, Code, BookOpen, Zap, LineChart as LineChartIcon, Lock,
  Copy, Check, Sparkles, Terminal, Globe, ArrowRight, Server, Brain, FileQuestion
} from 'lucide-react';
import { useState } from 'react';

const ENDPOINTS = [
  { method: 'GET', path: '/v1/exams', desc: 'List all available exams', icon: BookOpen },
  { method: 'GET', path: '/v1/exams/:id/topics', desc: 'Get topics with weights and patterns', icon: Brain },
  { method: 'POST', path: '/v1/questions/generate', desc: 'Generate questions by topic/difficulty', icon: FileQuestion },
  { method: 'POST', path: '/v1/recommendations', desc: 'Get personalized topic recommendations', icon: Sparkles },
  { method: 'POST', path: '/v1/tutor/message', desc: 'Send a message to the Socratic Tutor', icon: Brain },
  { method: 'POST', path: '/v1/analysis/question', desc: 'Analyze a question and extract metadata', icon: Server },
];

const PRICING = [
  { name: 'Free', price: '₦0', period: '/forever', features: ['60 req/min', '1,000 requests/month', 'Read-only endpoints', 'Basic support'], popular: false, cta: 'Get API key' },
  { name: 'Starter', price: '₦45,000', period: '/month', features: ['300 req/min', '50,000 requests/month', 'All GET endpoints', 'Email support'], popular: false, cta: 'Start free trial' },
  { name: 'Growth', price: '₦180,000', period: '/month', features: ['1,200 req/min', '500,000 requests/month', 'All endpoints including Tutor', 'Dedicated support'], popular: true, cta: 'Start building' },
  { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited requests', 'Custom rate limits', 'SLA & on-prem options', 'White-label rights'], popular: false, cta: 'Talk to us' },
];

const SAMPLE_CODE = `// Fetch topic intelligence for JAMB Mathematics
const res = await fetch('https://api.idrak.ai/v1/exams/jamb/topics', {
  headers: { 'Authorization': 'Bearer idrak_sk_...' }
});
const topics = await res.json();

// Returns:
// [
//   { id: 'algebra', name: 'Algebra', examWeight: 0.88,
//     avgDifficulty: 0.62, subtopics: [...] },
//   ...
// ]`;

export default function ApiPortalPage() {
  const [tab, setTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const copySample = () => {
    navigator.clipboard.writeText(SAMPLE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-cream">
      <LandingNav />

      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-coral/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-lavender/20 rounded-full blur-3xl" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge tone="lavender" size="md" className="mb-5"><KeyRound className="w-3.5 h-3.5" /> Idrak API for Developers</Badge>
              <Badge tone="yellow" size="sm" className="mb-3 ml-2">Planned — not yet publicly available</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-navy leading-[1.05] text-balance">
                Build learning products with <span className="text-coral">Idrak's intelligence.</span>
              </h1>
              <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-xl">
                A public API for topic intelligence, question generation, Socratic tutoring, exam metadata, and personalized recommendations is on our roadmap. The endpoints and pricing below describe the plan — none of this is live yet.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button variant="coral" size="lg" iconRight={ArrowRight} disabled title="API keys aren't issued yet — this is a planned product.">Get API key</Button>
                <Button variant="dark" size="lg" icon={BookOpen} disabled title="Documentation will be published once the API ships.">Read documentation</Button>
              </div>
              <div className="mt-8 flex items-center gap-4 text-sm text-ink-soft">
                <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> HTTPS only (planned)</span>
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> Target: sub-150ms (not measured — unreleased)</span>
                <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> Global edge</span>
              </div>
            </div>

            <Card padding="md" className="bg-navy text-white font-mono text-sm">
              <div className="flex items-center gap-1.5 mb-4">
                <div className="w-3 h-3 rounded-full bg-coral" />
                <div className="w-3 h-3 rounded-full bg-yellow" />
                <div className="w-3 h-3 rounded-full bg-mint" />
                <span className="ml-auto text-white/50 text-xs font-sans">terminal</span>
              </div>
              <pre className="text-[13px] leading-relaxed overflow-x-auto">
                <code>
                  <span className="text-coral">$</span> curl https://api.idrak.ai/v1/exams \<br />
                  {'  '}-H <span className="text-yellow">"Authorization: Bearer $IDRAK_KEY"</span><br /><br />
                  <span className="text-mint">{'{'}</span><br />
                  {'  '}<span className="text-lavender">"exams"</span>: [<br />
                  {'    '}{'{'} <span className="text-lavender">"code"</span>: <span className="text-yellow">"JAMB"</span>, ...{'}'},<br />
                  {'    '}{'{'} <span className="text-lavender">"code"</span>: <span className="text-yellow">"WAEC"</span>, ...{'}'},<br />
                  {'    '}<span className="text-white/50">// 7 more exams</span><br />
                  {'  '}]]<br />
                  <span className="text-mint">{'}'}</span>
                </code>
              </pre>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Capabilities"
            title={<>Six planned endpoints, <span className="text-coral">one future API.</span></>}
            description="This is the planned surface area for Idrak's public API — none of it is live yet. Every core Idrak capability is intended to be exposed through a simple REST API with JSON responses once it ships."
          />
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ENDPOINTS.map(e => (
              <Card key={e.path} padding="lg" hoverable>
                <div className="flex items-start gap-3 mb-3">
                  <e.icon className="w-6 h-6 text-coral flex-shrink-0" />
                  <div>
                    <Badge tone={e.method === 'GET' ? 'mint' : 'coral'} size="sm" className="mb-1 font-mono">{e.method}</Badge>
                    <div className="font-mono font-black text-navy text-sm">{e.path}</div>
                  </div>
                </div>
                <p className="text-sm text-ink-soft">{e.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="py-16 bg-lavender-light/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs
            tabs={[
              { id: 'overview', label: 'Keys', icon: KeyRound },
              { id: 'code', label: 'Sample code', icon: Code },
              { id: 'usage', label: 'Usage', icon: LineChartIcon },
            ]}
            activeId={tab}
            onChange={setTab}
            className="mb-6"
          />

          {tab === 'overview' && (
            <Card padding="xl" className="text-center">
              <KeyRound className="w-10 h-10 text-ink-mute mx-auto mb-3" />
              <h3 className="font-black text-navy text-lg mb-2">No API keys yet</h3>
              <p className="text-sm text-ink-soft max-w-md mx-auto">
                The developer API isn't publicly available yet, so there's nothing to issue a key for. This dashboard previously showed a fabricated "Live" key and fake usage numbers — that's been removed; nothing here is real until the API ships.
              </p>
            </Card>
          )}

          {tab === 'code' && (
            <Card padding="lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-coral" />
                  <h3 className="font-black text-navy text-lg">Sample request</h3>
                </div>
                <Badge tone="lavender">Node.js / fetch</Badge>
              </div>
              <div className="relative">
                <pre className="bg-navy text-white p-5 rounded-2xl overflow-x-auto text-sm leading-relaxed font-mono">
                  <code>{SAMPLE_CODE}</code>
                </pre>
                <button onClick={copySample} className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </Card>
          )}

          {tab === 'usage' && (
            <Card padding="lg" className="text-center py-16">
              <LineChartIcon className="w-10 h-10 text-ink-mute mx-auto mb-3" />
              <h3 className="font-black text-navy text-lg mb-2">No usage data</h3>
              <p className="text-sm text-ink-soft max-w-md mx-auto">This chart previously showed randomly-generated fake request volume. The API isn't live, so there's no real usage to report yet.</p>
            </Card>
          )}
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Pricing"
            title={<>Simple, <span className="text-coral">transparent pricing</span></>}
            description="Start free. Scale as your product grows. Education startups and nonprofits get a 50% discount."
            align="center"
          />
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRICING.map(p => (
              <Card key={p.name} padding="lg" className={cn('relative flex flex-col', p.popular && 'bg-coral text-white border-coral scale-105 ring-4 ring-coral/20 z-10')}>
                {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow text-navy text-xs font-black uppercase px-3 py-1 rounded-full">Most popular</div>}
                <h3 className={cn('text-xl font-black', p.popular ? 'text-white' : 'text-navy')}>{p.name}</h3>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-black">{p.price}</span>
                  <span className={cn('text-sm font-medium ml-1', p.popular ? 'text-white/70' : 'text-ink-mute')}>{p.period}</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className={cn('w-4 h-4 flex-shrink-0 mt-0.5', p.popular ? 'text-yellow' : 'text-coral')} />
                      <span className={p.popular ? 'text-white/90' : 'text-ink-soft'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={p.popular ? 'yellow' : 'dark'} size="md" fullWidth disabled title="The developer API is planned but not yet available.">{p.cta}</Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
