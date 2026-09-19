'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight, Brain, Route, MessageCircleQuestion, ChartBar,
  CheckCircle2, Sparkles, Clock, Target, Users, BookOpen, GraduationCap,
  Building2, LineChart, Lightbulb, ChevronRight, Star, Lock, Zap, Shield
} from 'lucide-react';
import { LandingNav, Footer } from '@/components/nav';
import { Button, Card, Badge, SectionHeader } from '@/components/ui';
import { HeroIllustration } from '@/components/illustrations';
import { LANDING_STATS, EXAMS, FEATURES, HOW_IT_WORKS, PRICING_PACKAGES } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const [contentCounts, setContentCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    fetch('/api/exams/content-status')
      .then(r => r.json())
      .then(payload => {
        const map: Record<string, number> = {};
        (payload.data ?? []).forEach((s: { examCode: string; totalQuestions: number }) => { map[s.examCode] = s.totalQuestions; });
        setContentCounts(map);
      })
      .catch(() => undefined);
  }, []);
  return (
    <div className="min-h-screen bg-cream">
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden pt-8 pb-20 md:pt-16 md:pb-32">
        <div className="absolute inset-0 dotted-grid pointer-events-none" />
        <div className="absolute -top-20 -right-40 w-[500px] h-[500px] rounded-full bg-lavender/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-coral/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <Badge tone="coral" size="md" className="mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Exam intelligence, not just questions
              </Badge>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-navy tracking-tight leading-[0.95] text-balance">
                Study smarter. <br />
                Prepare with{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-navy">confidence.</span>
                  <span className="absolute bottom-1 left-0 right-0 h-4 bg-yellow/70 -z-0 -rotate-1" />
                </span>
              </h1>

              <p className="mt-7 text-lg md:text-xl text-ink-soft leading-relaxed max-w-xl text-balance">
                Idrak AI turns past questions, your performance, and exam intelligence into a
                <span className="text-navy font-semibold"> personalized study path</span> — so
                you know what to study, when to study it, and why it matters.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button variant="coral" size="xl" iconRight={ArrowRight} fullWidth className="sm:w-auto">
                    Start Learning
                  </Button>
                </Link>
                <Link href="/#exams">
                  <Button variant="white" size="xl" iconRight={ChevronRight} fullWidth className="sm:w-auto">
                    Explore Idrak
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-6 text-sm text-ink-soft">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-mint" />
                  Free to start
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-mint" />
                  No credit card
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-mint" />
                  JAMB · WAEC · SAT · ICAN
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <HeroIllustration className="w-full max-w-xl mx-auto" />
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {LANDING_STATS.map((stat, idx) => {
              const tones: Record<string, 'coral' | 'lavender' | 'yellow' | 'mint'> = {
                coral: 'coral', lavender: 'lavender', yellow: 'yellow', mint: 'mint'
              };
              const bgTones: Record<string, string> = {
                coral: 'bg-coral text-white',
                lavender: 'bg-lavender-light',
                yellow: 'bg-yellow',
                mint: 'bg-mint-soft',
              };
              return (
                <div
                  key={stat.label}
                  className={cn(
                    'rounded-3xl p-5 md:p-6 card-shadow',
                    bgTones[stat.color],
                    idx === 0 && 'rotate-[-1.5deg]',
                    idx === 1 && 'rotate-[1deg] md:mt-4',
                    idx === 2 && 'rotate-[-0.8deg]',
                    idx === 3 && 'rotate-[1.5deg] md:-mt-2'
                  )}
                >
                  <div className={cn('text-3xl md:text-4xl font-black', stat.color === 'coral' ? 'text-white' : 'text-navy')}>
                    {stat.value}
                  </div>
                  <div className={cn('text-sm font-semibold mt-1', stat.color === 'coral' ? 'text-white/85' : 'text-ink-soft')}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXAMS SECTION */}
      <section id="exams" className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Exam catalog"
            title={<>Prepare for the exam that <span className="relative inline-block"><span className="relative z-10 text-coral">matters</span><span className="absolute bottom-1 left-0 right-0 h-3 bg-coral/15 -z-0" /></span> to you.</>}
            description="From Nigerian national exams to international tests and professional qualifications, Idrak has you covered with exam-specific intelligence and personalized study plans."
          />

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXAMS.map((exam, idx) => (
              <Card key={exam.id} padding="lg" hoverable className={cn(
                'group',
                idx % 3 === 0 && 'lg:rotate-[-0.5deg]',
                idx % 3 === 2 && 'lg:rotate-[0.5deg]'
              )}>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-lg"
                    style={{ backgroundColor: exam.color }}
                  >
                    {exam.shortName.slice(0, 4)}
                  </div>
                  <Badge tone={exam.category === 'professional' ? 'coral' : exam.category === 'international' ? 'lavender' : exam.category === 'university_entrance' ? 'yellow' : 'mint'}>
                    {exam.category.replace('_', ' ')}
                  </Badge>
                </div>
                <h3 className="text-2xl font-black text-navy mb-2">{exam.name}</h3>
                <p className="text-ink-soft text-sm leading-relaxed mb-5">{exam.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {exam.subjects.slice(0, 4).map(s => (
                    <span key={s.id} className="text-xs font-semibold bg-cream-dark px-2.5 py-1 rounded-full text-ink-soft">
                      {s.name}
                    </span>
                  ))}
                  {exam.subjects.length > 4 && (
                    <span className="text-xs font-semibold bg-cream-dark px-2.5 py-1 rounded-full text-ink-soft">
                      +{exam.subjects.length - 4} more
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-line/70">
                  <div className="text-sm">
                    {(contentCounts[exam.code] ?? 0) > 0 ? (
                      <>
                        <span className="font-black text-navy">{contentCounts[exam.code].toLocaleString()}</span>
                        <span className="text-ink-mute ml-1.5">questions available</span>
                      </>
                    ) : (
                      <span className="text-ink-mute font-semibold">Question bank coming soon</span>
                    )}
                  </div>
                  <Link href={`/signup?exam=${exam.code}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-navy group-hover:text-coral transition-colors">
                    Prepare for {exam.shortName} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </Card>
            ))}

            {/* Add more later card */}
            <Card padding="lg" tone="cream" className="flex flex-col items-center justify-center text-center min-h-[240px]">
              <div className="w-14 h-14 rounded-2xl bg-lavender-light flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-lavender-deep" />
              </div>
              <h3 className="text-lg font-black text-navy mb-1">More exams coming</h3>
              <p className="text-sm text-ink-soft">We're adding more exam categories every month.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 md:py-28 bg-lavender-light/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Why Idrak"
            title={<>Not another question bank. An <span className="relative"><span className="relative z-10 text-lavender-deep">intelligence</span><span className="absolute bottom-1 left-0 right-0 h-3 bg-lavender/30 -z-0" /></span> layer.</>}
            description="Idrak isn't just a question bank. It understands how exams work and how you learn — then gives you the exact next thing you should study."
          />

          <div className="mt-16 grid md:grid-cols-2 gap-6">
            {FEATURES.map((f, idx) => {
              const iconMap = { brain: Brain, route: Route, 'message-circle-question': MessageCircleQuestion, 'chart-bar': ChartBar };
              const Icon = iconMap[f.icon as keyof typeof iconMap];
              const bgMap = { coral: 'bg-coral', lavender: 'bg-lavender-deep', yellow: 'bg-yellow', mint: 'bg-mint' };
              return (
                <Card key={f.id} padding="xl" hoverable className={cn(
                  'group',
                  idx === 0 && 'md:-rotate-[0.3deg]',
                  idx === 3 && 'md:rotate-[0.3deg]'
                )}>
                  <div className="flex items-start gap-5">
                    <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0', bgMap[f.color as keyof typeof bgMap])}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-black tracking-widest uppercase text-coral mb-1.5">{f.eyebrow}</div>
                      <h3 className="text-2xl font-black text-navy mb-3">{f.title}</h3>
                      <p className="text-ink-soft leading-relaxed">{f.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Professional exam callout */}
          <Card padding="none" className="mt-12 overflow-hidden bg-navy text-white">
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-3 p-8 md:p-12">
                <Badge tone="coral" size="md" className="mb-4 bg-coral/20 text-coral">
                  <Shield className="w-3.5 h-3.5" />
                  For Professional Exams
                </Badge>
                <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                  Reasoning-first mode for ICAN, CITN and more.
                </h3>
                <p className="text-white/70 leading-relaxed mb-6 max-w-lg">
                  Professional exam questions can be tricky — generic AI often gets them wrong. Idrak's professional mode
                  prioritizes step-by-step reasoning, verification, and transparent explanations over quick answers.
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70 mb-6">
                  <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-coral" /> Step-by-step breakdown</span>
                  <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-coral" /> Answer verification</span>
                  <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-coral" /> Understand the reasoning</span>
                </div>
                <Link href="/signup?exam=ican">
                  <Button variant="coral" size="lg" iconRight={ArrowRight}>Try ICAN prep</Button>
                </Link>
              </div>
              <div className="md:col-span-2 bg-lavender-light/20 p-8 md:p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl font-black text-coral">5</div>
                  <div className="text-white/70 text-sm mt-2 max-w-[200px] mx-auto">levels of guided Socratic hints before revealing the full solution.</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="How Idrak works"
            title={<>Your personal learning path, <span className="relative"><span className="relative z-10">step by step.</span><span className="absolute bottom-1 left-0 right-0 h-3 bg-yellow/60 -z-0" /></span></>}
            description="No more staring at a syllabus wondering where to start. Idrak takes you from onboarding to exam-ready in five clear steps."
          />

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {HOW_IT_WORKS.map((step, idx) => (
              <div key={step.step} className="relative">
                <Card padding="lg" hoverable className={cn(
                  'h-full',
                  idx === 0 && 'bg-coral/10 border-coral/30',
                  idx === 4 && 'bg-yellow/20 border-yellow/50'
                )}>
                  <div className="text-5xl font-black text-coral/30 mb-3">{step.step}</div>
                  <h3 className="text-lg font-black text-navy mb-2">{step.title}</h3>
                  <p className="text-sm text-ink-soft leading-relaxed">{step.description}</p>
                </Card>
                {idx < HOW_IT_WORKS.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-1/2 -right-4 w-6 h-6 text-ink-mute -translate-y-1/2 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 md:py-28 bg-lavender-light/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Pricing"
            title={<>Fair pricing, built for <span className="text-coral">every student.</span></>}
            description="Start for free. Upgrade to unlock unlimited practice, AI tutoring, and advanced analytics when you're ready."
            align="center"
          />

          <div className="mt-14 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING_PACKAGES.map((pkg, idx) => {
              const isPopular = pkg.popular;
              const bg = pkg.color === 'coral' ? 'bg-coral text-white' : pkg.color === 'lavender' ? 'bg-lavender-deep text-white' : 'bg-white';
              return (
                <Card key={pkg.id} padding="xl" className={cn(
                  'relative flex flex-col',
                  isPopular && 'bg-coral text-white scale-100 md:scale-105 ring-4 ring-coral/20 z-10'
                )}>
                  {pkg.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow text-navy text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      {pkg.badge}
                    </div>
                  )}
                  <h3 className={cn('text-xl font-black', isPopular ? 'text-white' : 'text-navy')}>{pkg.name}</h3>
                  <p className={cn('text-sm mt-1 mb-5', isPopular ? 'text-white/80' : 'text-ink-soft')}>{pkg.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-black">
                      {pkg.price === 0 ? 'Free' : `₦${pkg.price.toLocaleString()}`}
                    </span>
                    {pkg.period && <span className={cn('text-sm font-medium ml-1', isPopular ? 'text-white/70' : 'text-ink-mute')}>{pkg.period}</span>}
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {pkg.features.map(feat => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className={cn('w-5 h-5 flex-shrink-0 mt-0', isPopular ? 'text-yellow' : 'text-mint')} />
                        <span className={isPopular ? 'text-white/90' : 'text-ink-soft'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="mt-auto">
                    <Button
                      variant={isPopular ? 'yellow' : 'dark'}
                      size="lg"
                      fullWidth
                      iconRight={ArrowRight}
                    >
                      {pkg.cta}
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* INSTITUTIONS */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge tone="lavender" size="md" className="mb-5">
                <Building2 className="w-3.5 h-3.5" />
                For schools & organizations
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black text-navy leading-tight text-balance">
                Bring Idrak to your <span className="text-coral">school, university, or cohort.</span>
              </h2>
              <p className="mt-6 text-lg text-ink-soft leading-relaxed">
                Seat-based licensing, teacher dashboards, cohort performance tracking, and custom branding. Idrak scales from a single classroom to an entire state.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-coral/15 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <h4 className="font-black text-navy">Cohort management</h4>
                    <p className="text-sm text-ink-soft">Create classes and track every student.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lavender-light flex items-center justify-center flex-shrink-0">
                    <LineChart className="w-5 h-5 text-lavender-deep" />
                  </div>
                  <div>
                    <h4 className="font-black text-navy">Class analytics</h4>
                    <p className="text-sm text-ink-soft">Identify topics where the whole class struggles.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow/30 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-yellow-700" />
                  </div>
                  <div>
                    <h4 className="font-black text-navy">Teacher tools</h4>
                    <p className="text-sm text-ink-soft">Assign practice, set mocks, send announcements.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-mint-soft flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    <h4 className="font-black text-navy">NGO / sponsored seats</h4>
                    <p className="text-sm text-ink-soft">Fund access for students and communities.</p>
                  </div>
                </div>
              </div>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/schools">
                  <Button variant="dark" size="lg" iconRight={ArrowRight}>Learn more</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">Talk to sales</Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <Card padding="xl" className="bg-navy text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-coral/20 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/10 rounded-2xl p-4">
                      <div className="text-3xl font-black text-coral">6</div>
                      <div className="text-sm text-white/70">Supported exams</div>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4">
                      <div className="text-3xl font-black text-yellow">Live</div>
                      <div className="text-sm text-white/70">Personalized analytics</div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-5 mb-4">
                    <div className="text-sm font-bold text-white/70 mb-3">Class readiness by subject</div>
                    {[
                      { name: 'Mathematics', value: 78 },
                      { name: 'English', value: 85 },
                      { name: 'Physics', value: 64 },
                      { name: 'Chemistry', value: 58 },
                    ].map(s => (
                      <div key={s.name} className="mb-2 last:mb-0">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/80 font-semibold">{s.name}</span>
                          <span className="font-bold">{s.value}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-coral rounded-full" style={{ width: `${s.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="flex -space-x-2">
                      {['AO', 'BM', 'CE', 'DO'].map((i, idx) => (
                        <div key={i} className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-navy',
                          idx === 0 && 'bg-coral', idx === 1 && 'bg-lavender-deep', idx === 2 && 'bg-mint', idx === 3 && 'bg-yellow text-navy'
                        )}>{i}</div>
                      ))}
                    </div>
                    <div className="text-sm text-white/70">Built for focused exam preparation</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card padding="xl" className="bg-coral text-white overflow-hidden relative">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-yellow/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-navy/20 rounded-full blur-3xl" />
            <div className="relative text-center max-w-2xl mx-auto">
              <Badge tone="yellow" size="md" className="bg-yellow/30 text-yellow-700 mb-6">
                <Zap className="w-3.5 h-3.5" /> Start your journey today
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] mb-6 text-balance">
                Ready to study smarter, not harder?
              </h2>
              <p className="text-lg text-white/90 leading-relaxed mb-10 max-w-xl mx-auto">
                Create your free Idrak account in under 2 minutes. No credit card required. Start with your first practice session today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button variant="dark" size="xl" iconRight={ArrowRight}>
                    Get started free
                  </Button>
                </Link>
                <Link href="/#exams">
                  <Button variant="white" size="xl" className="text-navy">
                    Browse exams
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
