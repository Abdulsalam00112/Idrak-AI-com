'use client';
import Link from 'next/link';
import { LandingNav, Footer } from '@/components/nav';
import { Button, Card, Badge, SectionHeader } from '@/components/ui';
import {
  Heart, Users, BarChart3, Shield, GraduationCap, Award, Sparkles,
  HandHeart, Building2, TrendingUp, CheckCircle2, ArrowRight, Target, BookOpen, Mail
} from 'lucide-react';

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <LandingNav />

      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-coral/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-mint/10 rounded-full blur-3xl" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <Badge tone="coral" size="md" className="mb-5"><Heart className="w-3.5 h-3.5" /> Sponsored Access</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-navy leading-[1.05] text-balance">
            Fund a student's <span className="relative inline-block"><span className="relative z-10 text-coral">exam preparation.</span></span>
          </h1>
          <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-2xl mx-auto">
            NGOs, corporate CSR programs, governments, and individuals can sponsor Idrak access for students, schools, or entire communities — with transparent outcome reporting.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact"><Button variant="coral" size="lg" iconRight={ArrowRight}>Sponsor seats</Button></Link>
            <Button variant="dark" size="lg" icon={BarChart3} disabled title="Outcome reporting isn't built yet — reach out and we'll walk you through results directly.">See outcomes</Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Users, title: 'Sponsor individuals or cohorts', desc: 'Choose individual students, specific schools, or fund seats at scale for an entire region.', tone: 'coral' },
              { icon: BarChart3, title: 'Transparent outcome data', desc: 'See usage, study time, accuracy improvements, and mock exam scores for every sponsored student.', tone: 'lavender' },
              { icon: Shield, title: 'No student left behind', desc: 'We work with schools and community leaders to ensure sponsored seats are activated and used.', tone: 'mint' },
            ].map(f => (
              <Card key={f.title} padding="lg">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  f.tone === 'coral' ? 'bg-coral/15 text-coral' :
                  f.tone === 'lavender' ? 'bg-lavender-light text-lavender-deep' :
                  'bg-mint-soft text-teal-700'
                }`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-black text-navy text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-lavender-light/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="How it works"
            title={<>From funding to <span className="text-coral">learning outcomes.</span></>}
            align="center"
          />
          <div className="mt-12 grid md:grid-cols-4 gap-5">
            {[
              { n: '01', title: 'Choose your scope', desc: 'Fund 10 seats for a single school, or 10,000 seats across a state.' },
              { n: '02', title: 'We deploy', desc: 'Students get dedicated accounts, onboarding support, and your branding (optional).' },
              { n: '03', title: 'Students prepare', desc: 'Every student gets a fully personalized Idrak plan, AI Tutor, and mock exams.' },
              { n: '04', title: 'You get reports', desc: 'You receive dashboards showing usage, progress, and exam readiness.' },
            ].map(s => (
              <Card key={s.n} padding="lg">
                <div className="text-4xl font-black text-coral/30 mb-3">{s.n}</div>
                <h3 className="font-black text-navy mb-1">{s.title}</h3>
                <p className="text-sm text-ink-soft">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card padding="xl" className="bg-navy text-white text-center">
            <Badge tone="coral" size="md" className="bg-coral/20 text-coral mb-5"><Mail className="w-3.5 h-3.5" /> Get in touch</Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Let's fund learning, together.</h2>
            <p className="text-white/70 mb-8">
              Email us at <strong className="text-white">sponsors@idrak.ai</strong> with a little about your organization and how many seats you'd like to fund. We'll respond within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="mailto:sponsors@idrak.ai"><Button variant="coral" size="lg">Email us</Button></Link>
              <Link href="/schools"><Button variant="white" size="lg" className="text-navy">For schools</Button></Link>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
