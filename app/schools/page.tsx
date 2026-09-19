'use client';
import Link from 'next/link';
import { useState } from 'react';
import { LandingNav, Footer } from '@/components/nav';
import { Button, Card, Badge, SectionHeader } from '@/components/ui';
import {
  Building2, Users, BarChart3, GraduationCap, CheckCircle2, Shield,
  BookOpen, TrendingUp, Award, Sparkles, School as SchoolIcon, ChevronRight,
  LineChart, Target, Zap, Mail, Phone, ArrowRight
} from 'lucide-react';

const FEATURES = [
  { icon: Users, title: 'Cohort management', desc: 'Organize students into classes, streams, and exam cohorts.' },
  { icon: BarChart3, title: 'Class analytics', desc: 'See which topics the entire class struggles with in one view.' },
  { icon: GraduationCap, title: 'Assign practice & mocks', desc: 'Set homework, schedule mocks, and see results instantly.' },
  { icon: BookOpen, title: 'Teacher portal', desc: 'Every teacher gets their own dashboard, classes, and reports.' },
  { icon: Shield, title: 'Seat-based licensing', desc: 'Pay only for the students actually using Idrak.' },
  { icon: TrendingUp, title: 'Ready-made diagnostics', desc: 'Run baseline tests in week 1 and measure progress at term end.' },
];

const INSTITUTIONS = [
  { name: 'Students', value: '4,280', icon: Users },
  { name: 'Active today', value: '1,847', icon: Zap },
  { name: 'Avg accuracy', value: '74%', icon: Target },
  { name: 'Readiness', value: '71%', icon: Award },
];

const COHORTS = [
  { name: 'SS3 — Science A', exam: 'JAMB', students: 48, readiness: 72, weakTopic: 'Organic Chemistry' },
  { name: 'SS3 — Science B', exam: 'JAMB', students: 46, readiness: 64, weakTopic: 'Algebra' },
  { name: 'SS3 — Commercial', exam: 'JAMB', students: 52, readiness: 68, weakTopic: 'Economics graphs' },
  { name: 'SS2 — All streams', exam: 'Pre-JAMB diagnostic', students: 150, readiness: 42, weakTopic: 'Foundational math' },
];

export default function SchoolsPage() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-cream p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Badge tone="lavender" size="md" className="mb-2"><Building2 className="w-3.5 h-3.5" /> Institution dashboard · Demo</Badge>
              <h1 className="text-3xl font-black text-navy">Excellence College, Lagos</h1>
              <p className="text-ink-soft">Admin overview for the 2025/2026 session.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setView('landing')}>← Back</Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INSTITUTIONS.map((s, i) => (
              <Card key={s.name} padding="md" className={i === 0 ? 'bg-coral/10 border-coral/30' : ''}>
                <s.icon className="w-5 h-5 text-coral mb-2" />
                <div className="text-2xl font-black text-navy">{s.value}</div>
                <div className="text-xs font-bold text-ink-soft">{s.name}</div>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card padding="lg" className="lg:col-span-2">
              <h3 className="font-black text-navy text-lg mb-4">Cohort performance</h3>
              <div className="space-y-3">
                {COHORTS.map(c => (
                  <div key={c.name} className="p-3 rounded-2xl bg-cream-dark/50 hover:bg-cream-dark transition cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-bold text-navy text-sm">{c.name}</div>
                        <div className="text-xs text-ink-soft">{c.exam} · {c.students} students</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-coral">{c.readiness}%</div>
                        <div className="text-[10px] font-bold text-ink-mute">readiness</div>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-coral rounded-full" style={{ width: `${c.readiness}%` }} />
                    </div>
                    <div className="text-xs text-coral font-bold mt-1.5">Weakest topic: {c.weakTopic}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card padding="lg" tone="navy">
              <div className="flex items-center gap-2 mb-3">
                <LineChart className="w-5 h-5 text-coral" />
                <h3 className="font-black text-white text-lg">Institution summary</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-white/80 border-b border-white/10 pb-2"><span>Licensed seats</span><span className="font-bold text-white">200 / 200</span></div>
                <div className="flex justify-between text-white/80 border-b border-white/10 pb-2"><span>Active teachers</span><span className="font-bold text-white">8</span></div>
                <div className="flex justify-between text-white/80 border-b border-white/10 pb-2"><span>Mocks taken</span><span className="font-bold text-white">42</span></div>
                <div className="flex justify-between text-white/80 border-b border-white/10 pb-2"><span>Questions answered</span><span className="font-bold text-white">38,204</span></div>
                <div className="flex justify-between text-white/80"><span>Avg study time / student</span><span className="font-bold text-coral">52 min/day</span></div>
              </div>
              <Button variant="coral" size="sm" fullWidth className="mt-5" disabled title="License management isn't implemented yet.">Manage licenses</Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <LandingNav />

      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-lavender/20 rounded-full blur-3xl" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge tone="lavender" size="md" className="mb-5"><Building2 className="w-3.5 h-3.5" /> For schools & universities</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-navy leading-[1.05] text-balance">
                Bring <span className="relative inline-block"><span className="relative z-10">Idrak AI</span><span className="absolute bottom-1 left-0 right-0 h-3 bg-coral/20 -z-0" /></span> to your entire school.
              </h1>
              <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-xl">
                Seat-based licensing, teacher dashboards, cohort performance tracking, and institutional analytics. Idrak scales from a single tutorial center to an entire state.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button variant="coral" size="lg" iconRight={ArrowRight} onClick={() => setView('dashboard')}>View demo dashboard</Button>
                <a href="mailto:schools@idrak.ai"><Button variant="dark" size="lg" icon={Mail}>Talk to us</Button></a>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-ink-soft">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-mint" /> Free pilot</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-mint" /> Custom pricing</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-mint" /> Dedicated support</span>
              </div>
            </div>

            <Card padding="none" className="bg-navy text-white overflow-hidden relative">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <SchoolIcon className="w-6 h-6 text-coral" />
                  <span className="font-black">Excellence College · Admin</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-white/10 rounded-2xl p-3">
                    <div className="text-2xl font-black text-coral">200</div>
                    <div className="text-xs text-white/70">Students</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3">
                    <div className="text-2xl font-black text-yellow">71%</div>
                    <div className="text-xs text-white/70">Avg readiness</div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {['SS3 Science A — 72% ready', 'SS3 Science B — 64% ready', 'SS3 Commercial — 68% ready'].map(c => (
                    <div key={c} className="flex items-center justify-between text-sm">
                      <span className="text-white/80">{c}</span>
                    </div>
                  ))}
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-coral to-yellow rounded-full" style={{ width: '71%' }} />
                </div>
              </div>
              <div className="bg-coral py-3 px-6 flex items-center justify-between text-white">
                <span className="text-sm font-bold">Institution-wide readiness</span>
                <span className="font-black">Live</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="What institutions get"
            title={<>Everything you need to run <span className="text-coral">exam prep at scale.</span></>}
            description="Idrak's institutional platform is built for principals, teachers, and admins who need visibility into how their students are actually performing."
          />
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <Card key={f.title} padding="lg" hoverable>
                <div className="w-12 h-12 rounded-xl bg-coral/15 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-coral" />
                </div>
                <h3 className="font-black text-navy text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-lavender-light/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card padding="xl" className="bg-navy text-white">
            <div className="text-center">
              <Badge tone="coral" size="md" className="mb-5 bg-coral/20 text-coral"><Sparkles className="w-3.5 h-3.5" /> For NGOs & sponsors</Badge>
              <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4">
                Fund seats for students or entire communities.
              </h2>
              <p className="text-white/70 leading-relaxed max-w-2xl mx-auto mb-8">
                NGOs, governments, and corporate CSR programs can sponsor Idrak access for individual students, schools, or entire cohorts — with full outcome reporting.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/sponsors"><Button variant="coral" size="lg">Sponsor access</Button></Link>
                <Link href="/about"><Button variant="white" size="lg" className="text-navy">Learn more</Button></Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
