'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  GraduationCap, Clock, Target, Play, Award, BarChart, CheckCircle2,
  Timer, AlertCircle, ChevronRight, Trophy, XCircle, Minus
} from 'lucide-react';
import { Card, Button, Badge, Progress } from '@/components/ui';
import { cn } from '@/lib/utils';

const MOCK_EXAMS = [
  { id: 'm1', title: 'JAMB Full Mock — All Subjects', questions: 180, duration: 120, difficulty: 'Mixed', completed: true, score: 248, percentage: 69, date: '2 weeks ago', tone: 'lavender' },
  { id: 'm2', title: 'Mathematics Mini Mock', questions: 40, duration: 30, difficulty: 'Medium', completed: true, score: 26, percentage: 65, date: '5 days ago', tone: 'coral' },
  { id: 'm3', title: 'English Language Mock', questions: 60, duration: 45, difficulty: 'Easy', completed: true, score: 52, percentage: 87, date: '3 days ago', tone: 'mint' },
  { id: 'm4', title: 'Physics Diagnostic Mock', questions: 50, duration: 40, difficulty: 'Hard', completed: false, score: null, percentage: null, date: 'Not started', tone: 'yellow' },
];

const COMING_UP = [
  { title: 'Full JAMB Simulation', questions: 180, duration: 120, recommended: true },
  { title: 'Chemistry Focus Mock', questions: 40, duration: 30, recommended: false },
];

const SUBJECT_BREAKDOWN = [
  { subject: 'English', score: 52, total: 60, percentage: 87, strong: true },
  { subject: 'Mathematics', score: 26, total: 40, percentage: 65, strong: false },
  { subject: 'Physics', score: 28, total: 40, percentage: 70, strong: false },
  { subject: 'Chemistry', score: 22, total: 40, percentage: 55, strong: false },
];

export default function ExamsPage() {
  const [showResult, setShowResult] = useState(false);
  const [active, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7200);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (active) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <Card padding="md" className="bg-navy text-white">
          <div className="flex items-center justify-between">
            <div>
              <Badge tone="coral" size="sm" className="bg-coral/20 text-coral mb-1">Live exam</Badge>
              <h2 className="font-black text-lg">JAMB Full Mock Examination</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-white/60 font-bold">Time remaining</div>
                <div className="text-2xl font-black text-coral font-mono">{formatTime(timeLeft)}</div>
              </div>
              <Button variant="coral" size="sm" onClick={() => { setActive(false); setShowResult(true); }}>Submit</Button>
            </div>
          </div>
        </Card>
        <div className="grid lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <Card padding="xl">
              <Badge tone="lavender" size="sm" className="mb-3">Question 47 of 180 · Mathematics</Badge>
              <h2 className="text-xl font-bold text-navy mb-6">
                If x² − 5x + 6 = 0, find the values of x.
              </h2>
              <div className="space-y-3">
                {['2 and 3', '1 and 6', '−2 and −3', '2 and −3'].map((opt, i) => (
                  <button key={i} className="w-full text-left p-4 rounded-2xl border-2 border-line bg-white hover:border-coral/50 hover:bg-coral/5 transition font-semibold text-navy">
                    <span className="inline-flex w-8 h-8 rounded-lg bg-cream-dark items-center justify-center font-black text-sm mr-3">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-line">
                <Button variant="outline" size="md">Previous</Button>
                <Button variant="dark" size="md">Mark for review</Button>
                <Button variant="coral" size="md">Next</Button>
              </div>
            </Card>
          </div>
          <Card padding="md">
            <h3 className="font-black text-navy mb-3 text-sm">Question navigator</h3>
            <div className="grid grid-cols-6 gap-1.5">
              {Array.from({ length: 46 }, (_, i) => (
                <div key={i} className={cn(
                  'aspect-square rounded-md text-[10px] font-bold flex items-center justify-center',
                  i < 25 ? 'bg-mint text-white' : i < 46 ? 'bg-coral text-white' : 'bg-line text-ink-mute'
                )}>{i + 1}</div>
              ))}
              {Array.from({ length: 134 }, (_, i) => (
                <div key={`empty-${i}`} className="aspect-square rounded-md text-[10px] font-bold flex items-center justify-center bg-line text-ink-mute">{i + 47}</div>
              ))}
            </div>
            <div className="mt-4 space-y-2 text-xs font-bold">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-mint" /> Answered</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-coral" /> Current</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-line" /> Unanswered</div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="max-w-5xl mx-auto space-y-5">
        <Link href="/exams" onClick={(e) => { e.preventDefault(); setShowResult(false); }}>
          <Button variant="ghost" size="sm">← Back to mocks</Button>
        </Link>
        <Card padding="xl" className="bg-navy text-white text-center">
          <Trophy className="w-16 h-16 text-yellow mx-auto mb-4" />
          <Badge tone="yellow" size="md" className="mb-4">Mock exam completed</Badge>
          <h1 className="text-5xl font-black mb-2">268 <span className="text-white/60 text-2xl">/ 400</span></h1>
          <p className="text-white/70 mb-6">You scored 67% on this mock. Your estimated JAMB score is in the 67th percentile.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="bg-white/10 rounded-2xl p-3">
              <div className="text-2xl font-black text-teal-400">121</div>
              <div className="text-xs text-white/60 font-bold">Correct</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-3">
              <div className="text-2xl font-black text-coral">48</div>
              <div className="text-xs text-white/60 font-bold">Incorrect</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-3">
              <div className="text-2xl font-black text-yellow">11</div>
              <div className="text-xs text-white/60 font-bold">Unanswered</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-3">
              <div className="text-2xl font-black">1h 47m</div>
              <div className="text-xs text-white/60 font-bold">Time used</div>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="font-black text-navy text-lg mb-4">Subject breakdown</h3>
          <div className="space-y-3">
            {SUBJECT_BREAKDOWN.map(s => (
              <div key={s.subject}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy text-sm">{s.subject}</span>
                    {s.strong ? <CheckCircle2 className="w-4 h-4 text-teal-600" /> : <AlertCircle className="w-4 h-4 text-coral" />}
                  </div>
                  <span className="font-black text-sm">
                    {s.score}/{s.total} <span className={cn('ml-1', s.percentage >= 70 ? 'text-teal-600' : 'text-coral')}>({s.percentage}%)</span>
                  </span>
                </div>
                <Progress value={s.percentage} tone={s.percentage >= 70 ? 'mint' : 'coral'} size="sm" />
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg" tone="coral">
          <h3 className="font-black text-navy text-lg mb-2">Recommended next steps</h3>
          <ul className="space-y-2 text-sm text-navy/80">
            <li className="flex gap-2"><strong>•</strong> Spend 30 minutes on <strong>Organic Chemistry</strong> — your weakest high-weight topic.</li>
            <li className="flex gap-2"><strong>•</strong> Review <strong>Algebra quadratic equations</strong> — you missed 4 of 8 questions.</li>
            <li className="flex gap-2"><strong>•</strong> Take another full mock in <strong>5 days</strong> to measure progress.</li>
          </ul>
          <div className="flex gap-3 mt-5 flex-wrap">
            <Button variant="coral" size="md" iconRight={ChevronRight}>Start Organic Chemistry practice</Button>
            <Button variant="white" size="md">Review mistakes</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <Badge tone="lavender" size="md" className="mb-3"><GraduationCap className="w-3.5 h-3.5" /> Mock Examinations</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-navy">Practice under exam conditions.</h1>
        <p className="text-ink-soft mt-1 max-w-2xl">Full-length timed mocks with exam-style questions, question navigator, and detailed post-exam analysis.</p>
      </div>

      {/* Start a new mock */}
      <Card padding="xl" className="bg-gradient-to-br from-lavender-light to-coral/10 overflow-hidden relative">
        <div className="relative z-10">
          <Badge tone="coral" size="md" className="mb-4">
            <Target className="w-3.5 h-3.5" /> Recommended
          </Badge>
          <h2 className="text-2xl md:text-3xl font-black text-navy mb-2">Full JAMB Simulation</h2>
          <p className="text-ink-soft mb-6 max-w-md">180 questions · 120 minutes · All four subjects · Full exam interface with timer and navigator.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="coral" size="lg" icon={Play} onClick={() => setActive(true)}>Start mock exam</Button>
            <Button variant="outline" size="lg">Customize mock</Button>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="font-black text-navy text-lg mb-3">Your mock history</h3>
          <div className="space-y-3">
            {MOCK_EXAMS.map(m => (
              <Card key={m.id} padding="md" hoverable className={m.tone === 'coral' ? 'border-coral/30 bg-coral/5' : ''}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                    m.completed ? 'bg-navy text-white' : 'bg-yellow text-navy'
                  )}>
                    {m.completed ? <Award className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-navy truncate">{m.title}</div>
                    <div className="flex items-center gap-2 text-xs text-ink-soft">
                      <span>{m.questions} questions</span><span>•</span><span>{m.duration} min</span><span>•</span><span>{m.difficulty}</span><span>•</span><span>{m.date}</span>
                    </div>
                  </div>
                  {m.completed ? (
                    <div className="text-right flex-shrink-0">
                      <div className={cn('text-xl font-black', m.percentage && m.percentage >= 70 ? 'text-teal-600' : 'text-coral')}>
                        {m.percentage}%
                      </div>
                      <div className="text-xs text-ink-mute font-bold">{m.score}</div>
                    </div>
                  ) : (
                    <Button variant="coral" size="sm" onClick={() => setActive(true)}>Continue</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-black text-navy text-lg mb-3">Quick start</h3>
          <div className="space-y-3">
            {COMING_UP.map((c, i) => (
              <Card key={i} padding="md" hoverable>
                <div className="flex items-start justify-between mb-2">
                  <div className="font-bold text-sm text-navy">{c.title}</div>
                  {c.recommended && <Badge tone="coral" size="sm">AI</Badge>}
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-mute font-bold mb-3">
                  <Clock className="w-3 h-3" /> {c.duration} min
                  <BarChart className="w-3 h-3 ml-2" /> {c.questions} Qs
                </div>
                <Button variant="dark" size="sm" fullWidth iconRight={ChevronRight} onClick={() => setActive(true)}>Start</Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
