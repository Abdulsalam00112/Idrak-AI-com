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
  const [showKey, setShowKey] = useState(false);
  const demoKey = 'idrak_sk_live_8f3a9b2c7d5e1f0a2b4c6d8e0f1a2b3c';

  const copyKey = () => {
    navigator.clipboard.writeText(demoKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-navy leading-[1.05] text-balance">
                Build learning products with <span className="text-coral">Idrak's intelligence.</span>
              </h1>
              <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-xl">
                Access topic intelligence, question generation, Socratic tutoring, exam metadata, and personalized recommendations — all through a single production-ready API.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button variant="coral" size="lg" iconRight={ArrowRight}>Get API key</Button>
                <Button variant="dark" size="lg" icon={BookOpen}>Read documentation</Button>
              </div>
              <div className="mt-8 flex items-center gap-4 text-sm text-ink-soft">
                <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> HTTPS only</span>
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> P95 latency {'<'} 120ms</span>
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
                  {'    '}<span className="text-white/50">// 6 more exams</span><br />
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
            title={<>Six powerful endpoints, <span className="text-coral">one API.</span></>}
            description="Every core Idrak capability is exposed through a simple REST API with JSON responses."
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
            <div className="grid md:grid-cols-2 gap-6">
              <Card padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-navy text-lg">Your API keys</h3>
                  <Button variant="coral" size="sm" icon={KeyRound}>Create key</Button>
                </div>
                <div className="p-4 rounded-2xl bg-cream border border-line">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-bold text-navy text-sm">Production key</div>
                      <div className="text-xs text-ink-mute">Created today</div>
                    </div>
                    <Badge tone="mint" size="sm" dot>Live</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <code className="flex-1 bg-white px-3 py-2 rounded-xl font-mono text-sm text-navy truncate">
                      {showKey ? demoKey : 'idrak_sk_live_••••••••••••••••••••••••••••'}
                    </code>
                    <button onClick={() => setShowKey(!showKey)} className="p-2 rounded-lg bg-white text-ink-soft hover:text-navy">
                      {showKey ? <Lock className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
                    </button>
                    <button onClick={copyKey} className="p-2 rounded-lg bg-coral text-white">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </Card>

              <Card padding="lg" tone="navy" className="text-white">
                <h3 className="font-black text-white text-lg mb-4">This month's usage</h3>
                <div className="text-5xl font-black text-coral mb-1">12,487</div>
                <div className="text-white/70 text-sm mb-5">requests this billing period</div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-coral rounded-full" style={{ width: '25%' }} />
                </div>
                <div className="flex justify-between text-xs font-bold text-white/70">
                  <span>0</span><span>50,000 (Starter limit)</span>
                </div>
              </Card>
            </div>
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
              <pre className="bg-navy text-white p-5 rounded-2xl overflow-x-auto text-sm leading-relaxed font-mono">
                <code>{SAMPLE_CODE}</code>
              </pre>
            </Card>
          )}

          {tab === 'usage' && (
            <Card padding="lg">
              <h3 className="font-black text-navy text-lg mb-4">Requests per day (last 30 days)</h3>
              <div className="h-64 flex items-end gap-1">
                {Array.from({ length: 30 }, () => Math.random() * 0.8 + 0.2).map((h, i) => (
                  <div key={i} className="flex-1 bg-coral/30 rounded-t hover:bg-coral transition-colors" style={{ height: `${h * 100}%` }}>
                    <div className="w-full h-full bg-coral rounded-t" style={{ opacity: h }} />
                  </div>
                ))}
              </div>
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
                <Button variant={p.popular ? 'yellow' : 'dark'} size="md" fullWidth>{p.cta}</Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
