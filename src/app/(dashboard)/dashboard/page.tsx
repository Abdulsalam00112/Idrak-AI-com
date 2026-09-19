'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight, Target, Flame, Clock, CheckCircle2, Trophy, Plus,
  TrendingUp, TrendingDown, Minus, Pencil, BookOpen, Timer, Atom,
  FlaskConical, Leaf, Calculator, Sparkles, ChevronRight, Award
} from 'lucide-react';
import { Card, Badge, Button, Progress, StatCard } from '@/components/ui';
import {
  PERFORMANCE_SNAPSHOT, TODAY_FOCUS, TOPIC_INTELLIGENCE,
  RECOMMENDED_PRACTICE, RECENT_ACTIVITY, WEEKLY_PLAN, DEMO_USER
} from '@/lib/data';
import { cn, getGreeting, formatMinutes } from '@/lib/utils';
import { SubjectIcon } from '@/components/illustrations';

const subjectIconMap: Record<string, any> = {
  Mathematics: Calculator,
  'Use of English': BookOpen,
  English: BookOpen,
  Physics: Atom,
  Chemistry: FlaskConical,
  Biology: Leaf,
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>(DEMO_USER);
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    setGreeting(getGreeting());
    const u = localStorage.getItem('idrak_user');
    if (u) setUser({ ...DEMO_USER, ...JSON.parse(u) });
  }, []);

  const priority = TOPIC_INTELLIGENCE.filter(t => t.priority === 'critical' || t.priority === 'high').slice(0, 3);
  const strong = TOPIC_INTELLIGENCE.filter(t => t.priority === 'maintain').slice(0, 3);
  const improving = TOPIC_INTELLIGENCE.filter(t => t.trend === 'improving').slice(0, 3);

  const TrendIcon = (trend: string) => {
    if (trend === 'improving' || trend === 'strong') return TrendingUp;
    if (trend === 'declining') return TrendingDown;
    return Minus;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
            {greeting}, {user.firstName} <span className="inline-block animate-wiggle">👋</span>
          </h1>
          <p className="text-ink-soft mt-1 text-base">Here's what Idrak recommends for you today.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="coral" size="md">
            <Flame className="w-3.5 h-3.5" />
            {PERFORMANCE_SNAPSHOT.currentStreak}-day streak
          </Badge>
          <Badge tone="lavender" size="md">{PERFORMANCE_SNAPSHOT.daysUntilExam} days to JAMB</Badge>
        </div>
      </div>

      {/* Today's focus hero */}
      <Card padding="none" className="bg-navy text-white overflow-hidden relative">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-coral/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-lavender/20 blur-3xl" />
        <div className="grid md:grid-cols-5 gap-6 p-6 md:p-8 relative">
          <div className="md:col-span-3">
            <Badge tone="coral" size="md" className="bg-coral/20 text-coral mb-4">
              <Target className="w-3.5 h-3.5" />
              Today's Focus
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black leading-tight mb-3">
              {TODAY_FOCUS.topicName}
            </h2>
            <p className="text-white/70 leading-relaxed mb-6 max-w-lg">
              {TODAY_FOCUS.reason}
            </p>
            <div className="flex flex-wrap gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="w-4 h-4" />
                <span>{TODAY_FOCUS.duration} minutes</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Pencil className="w-4 h-4" />
                <span>~{TODAY_FOCUS.questionsTarget} questions</span>
              </div>
              <Badge tone="coral" size="sm" className="bg-coral text-white border-0">Priority: Critical</Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/practice">
                <Button variant="coral" size="lg" iconRight={ArrowRight}>Start Session</Button>
              </Link>
              <Link href="/tutor">
                <Button variant="white" size="lg" className="text-navy">Ask Idrak instead</Button>
              </Link>
            </div>
          </div>
          <div className="md:col-span-2 flex items-center justify-center">
            <div className="relative">
              <svg className="w-48 h-48 md:w-56 md:h-56" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="14" />
                <circle
                  cx="100" cy="100" r="80" fill="none" stroke="#ff6b4a" strokeWidth="14"
                  strokeDasharray={2 * Math.PI * 80}
                  strokeDashoffset={2 * Math.PI * 80 * (1 - 0.52)}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
                <text x="100" y="90" textAnchor="middle" fill="white" fontSize="36" fontWeight="900">52%</text>
                <text x="100" y="115" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="12" fontWeight="600">Current mastery</text>
              </svg>
              <div className="absolute -top-2 -right-2 bg-yellow text-navy rounded-2xl px-3 py-1.5 text-xs font-black rotate-6">
                HIGH PRIORITY
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          value={`${PERFORMANCE_SNAPSHOT.overallReadiness}%`}
          label="Overall readiness"
          sublabel="+4% this week"
          tone="coral"
          icon={TrendingUp}
        />
        <StatCard
          value={`${PERFORMANCE_SNAPSHOT.accuracy}%`}
          label="Average accuracy"
          sublabel={`${PERFORMANCE_SNAPSHOT.questionsAnswered.toLocaleString()} questions`}
          tone="lavender"
          icon={Target}
        />
        <StatCard
          value={formatMinutes(Math.round(PERFORMANCE_SNAPSHOT.studyTimeHours * 60))}
          label="Total study time"
          sublabel={`${PERFORMANCE_SNAPSHOT.currentStreak} day streak`}
          tone="yellow"
          icon={Flame}
        />
        <StatCard
          value={PERFORMANCE_SNAPSHOT.estimatedScore}
          label="Estimated JAMB score"
          sublabel={`Target: ${PERFORMANCE_SNAPSHOT.targetScore}`}
          tone="mint"
          icon={Trophy}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning intelligence */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-black text-navy">Learning Intelligence</h3>
                <p className="text-sm text-ink-soft">Where to focus, what's improving, what you've mastered.</p>
              </div>
              <Link href="/intelligence">
                <Button variant="ghost" size="sm" iconRight={ChevronRight}>View all</Button>
              </Link>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge tone="red" size="sm" dot>Priority</Badge>
                  <span className="text-xs font-bold text-ink-mute">High weight + weak performance</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {priority.map(t => {
                    const Trend = TrendIcon(t.trend);
                    return (
                      <Link href={`/practice?topic=${t.topicId}`} key={t.topicId}>
                        <div className="p-3 rounded-2xl bg-coral/10 border border-coral/20 hover:bg-coral/15 transition group cursor-pointer">
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-bold text-sm text-navy">{t.name}</div>
                            <Trend className="w-4 h-4 text-coral flex-shrink-0" />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-ink-soft">
                            <span>{t.subject}</span>
                            <span>•</span>
                            <span className="font-bold text-coral">{t.performance}%</span>
                          </div>
                          <div className="mt-2">
                            <Progress value={t.performance} tone="coral" size="sm" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge tone="mint" size="sm" dot>Strong</Badge>
                  <span className="text-xs font-bold text-ink-mute">Topics you've mastered</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {strong.map(t => (
                    <Link key={t.topicId} href={`/practice?topic=${t.topicId}`}>
                      <div className="px-3 py-2 rounded-xl bg-mint/15 hover:bg-mint/25 border border-mint/30 cursor-pointer transition">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-teal-700" />
                          <span className="text-sm font-bold text-navy">{t.name}</span>
                          <span className="text-xs font-black text-teal-700">{t.performance}%</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Recommended practice */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-black text-navy">Recommended practice</h3>
                <p className="text-sm text-ink-soft">Handpicked by Idrak based on your performance today.</p>
              </div>
              <Badge tone="coral" size="sm"><Sparkles className="w-3 h-3" /> AI</Badge>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {RECOMMENDED_PRACTICE.map((rec, i) => {
                const colorMap: Record<string, string> = {
                  coral: 'bg-coral/10 border-coral/20',
                  lavender: 'bg-lavender-light border-lavender/30',
                  yellow: 'bg-yellow/20 border-yellow/50',
                  mint: 'bg-mint-soft border-mint/40',
                };
                const iconColorMap: Record<string, string> = {
                  coral: 'text-coral',
                  lavender: 'text-lavender-deep',
                  yellow: 'text-yellow-700',
                  mint: 'text-teal-700',
                };
                const iconMap: Record<string, any> = {
                  pencil: Pencil, 'book-open': BookOpen, timer: Timer, atom: Atom,
                };
                const Icon = iconMap[rec.icon];
                return (
                  <Link href="/practice" key={i}>
                    <div className={cn(
                      'p-4 rounded-2xl border-2 hover:shadow-md transition cursor-pointer h-full',
                      colorMap[rec.color]
                    )}>
                      <div className="flex items-start gap-3">
                        <div className={cn('w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0', iconColorMap[rec.color])}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-navy text-sm mb-1">{rec.title}</div>
                          <div className="text-xs text-ink-soft mb-3">{rec.reason}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-ink-mute">{rec.duration} min</span>
                            <span className={cn('text-xs font-black', iconColorMap[rec.color])}>{rec.cta} →</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>

          {/* Recent activity */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-black text-navy">Recent activity</h3>
              <Link href="/analytics"><Button variant="ghost" size="sm" iconRight={ChevronRight}>All activity</Button></Link>
            </div>
            <div className="space-y-2">
              {RECENT_ACTIVITY.map((act, i) => {
                const Icon = subjectIconMap[act.subject] || Pencil;
                return (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-cream-dark/50 transition">
                    <div className="w-10 h-10 rounded-xl bg-lavender-light flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-lavender-deep" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-navy text-sm">{act.title}</span>
                        <Badge tone={act.type === 'mock' ? 'lavender' : act.type === 'tutor' ? 'coral' : 'gray'} size="sm">
                          {act.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-ink-soft">{act.subject} · {act.date}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {act.score !== null ? (
                        <>
                          <div className={cn(
                            'text-base font-black',
                            (act.accuracy || 0) >= 75 ? 'text-teal-600' : (act.accuracy || 0) >= 50 ? 'text-yellow-700' : 'text-coral'
                          )}>
                            {act.score}/{act.total}
                          </div>
                          <div className="text-xs text-ink-mute">{act.duration} min</div>
                        </>
                      ) : (
                        <div className="text-xs font-bold text-coral">Tutor session</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right column: This week's plan */}
        <div className="space-y-6">
          <Card padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-navy">Your week</h3>
              <Badge tone="yellow" size="sm"><Sparkles className="w-3 h-3" /> Adaptive</Badge>
            </div>
            <div className="space-y-3">
              {WEEKLY_PLAN.slice(0, 5).map((day, i) => (
                <div key={day.day} className="relative pl-4">
                  {i < WEEKLY_PLAN.length - 1 && (
                    <div className="absolute left-0 top-3 bottom-0 w-px bg-line" />
                  )}
                  <div className={cn(
                    'absolute left-0 top-2 w-2 h-2 rounded-full -translate-x-1/2',
                    i === 0 ? 'bg-coral' : 'bg-line'
                  )} />
                  <div className="pb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={cn('font-black text-sm', i === 0 ? 'text-navy' : 'text-ink-soft')}>{day.day}</div>
                      <div className="text-xs text-ink-mute">
                        {day.items.reduce((sum, item) => sum + item.duration, 0)} min
                      </div>
                    </div>
                    <div className="space-y-1">
                      {day.items.slice(0, 2).map((item, j) => (
                        <div key={j} className={cn(
                          'text-xs px-2.5 py-1.5 rounded-lg font-medium',
                          item.priority === 'critical' ? 'bg-coral/15 text-coral' :
                          item.priority === 'high' ? 'bg-yellow/20 text-yellow-700' :
                          'bg-cream-dark text-ink-soft'
                        )}>
                          {item.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/intelligence?tab=plan" className="block mt-4">
              <Button variant="outline" size="sm" fullWidth iconRight={ChevronRight}>View full study plan</Button>
            </Link>
          </Card>

          {/* Readiness card */}
          <Card padding="lg" className="bg-lavender-light border-lavender/30">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-lavender-deep" />
              <h3 className="text-lg font-black text-navy">JAMB Readiness</h3>
            </div>
            <div className="text-5xl font-black text-lavender-deep mb-2">
              {PERFORMANCE_SNAPSHOT.overallReadiness}<span className="text-2xl">%</span>
            </div>
            <p className="text-sm text-ink-soft leading-relaxed mb-4">
              Your readiness is improving, but Algebra and Human Physiology remain your highest-priority areas.
            </p>
            <Progress value={PERFORMANCE_SNAPSHOT.overallReadiness} tone="lavender" size="md" />
            <div className="mt-3 flex justify-between text-xs font-semibold text-ink-mute">
              <span>Est. score: {PERFORMANCE_SNAPSHOT.estimatedScore}</span>
              <span>Target: {PERFORMANCE_SNAPSHOT.targetScore}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
