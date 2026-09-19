'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Clock, AlertCircle, ChevronLeft, ChevronRight, Flag, Bookmark,
  Lightbulb, HelpCircle, CheckCircle2, XCircle, RotateCcw, Pencil,
  Timer, Target, Shuffle, Flame, Zap, ArrowLeft
} from 'lucide-react';
import { Card, Button, Badge, Progress } from '@/components/ui';
import { EXAMS, TOPIC_INTELLIGENCE } from '@/lib/data';
import { cn } from '@/lib/utils';

const SAMPLE_QUESTIONS = [
  {
    id: 'q1',
    number: 1,
    text: 'If x² − 5x + 6 = 0, what are the values of x?',
    topic: 'Algebra',
    subject: 'Mathematics',
    difficulty: 'easy' as const,
    year: 2023,
    options: [
      { id: 'A', text: '2 and 3' },
      { id: 'B', text: '1 and 6' },
      { id: 'C', text: '−2 and −3' },
      { id: 'D', text: '2 and −3' },
    ],
    correct: 'A',
    explanation: 'The quadratic factors as (x − 2)(x − 3) = 0, so x = 2 or x = 3. Verify by substituting back: when x=2, 4 − 10 + 6 = 0. When x=3, 9 − 15 + 6 = 0.',
  },
  {
    id: 'q2',
    number: 2,
    text: 'Solve the simultaneous equations: 2x + 3y = 13 and 4x − y = 5.',
    topic: 'Algebra',
    subject: 'Mathematics',
    difficulty: 'medium' as const,
    year: 2022,
    options: [
      { id: 'A', text: 'x = 1, y = 3' },
      { id: 'B', text: 'x = 2, y = 3' },
      { id: 'C', text: 'x = 3, y = 2' },
      { id: 'D', text: 'x = 2, y = 4' },
    ],
    correct: 'B',
    explanation: 'From equation 2: y = 4x − 5. Substitute into equation 1: 2x + 3(4x − 5) = 13 → 2x + 12x − 15 = 13 → 14x = 28 → x = 2. Then y = 4(2) − 5 = 3.',
  },
  {
    id: 'q3',
    number: 3,
    text: 'A car accelerates uniformly from rest at 4 m/s² for 10 seconds. What is its final velocity?',
    topic: 'Mechanics',
    subject: 'Physics',
    difficulty: 'easy' as const,
    year: 2023,
    options: [
      { id: 'A', text: '20 m/s' },
      { id: 'B', text: '40 m/s' },
      { id: 'C', text: '4 m/s' },
      { id: 'D', text: '10 m/s' },
    ],
    correct: 'B',
    explanation: 'Using v = u + at, where u = 0 (starts from rest), a = 4 m/s², and t = 10 s. So v = 0 + 4 × 10 = 40 m/s.',
  },
];

const MODES = [
  { id: 'topic', name: 'Topic Practice', desc: 'Drill a specific topic', icon: Target, tone: 'coral' },
  { id: 'weak', name: 'Weak Topics', desc: 'Focus on your weak areas', icon: Flame, tone: 'yellow' },
  { id: 'high_yield', name: 'High-Yield', desc: 'Most frequent exam topics', icon: Zap, tone: 'lavender' },
  { id: 'timed', name: 'Timed Practice', desc: 'Build exam-day stamina', icon: Timer, tone: 'mint' },
  { id: 'subject', name: 'Subject Practice', desc: 'Mixed questions per subject', icon: Pencil, tone: 'coral' },
  { id: 'random', name: 'Random Mix', desc: 'Stay surprised', icon: Shuffle, tone: 'lavender' },
];

function PracticeContent() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get('topic');
  const [phase, setPhase] = useState<'select' | 'active' | 'review'>('select');
  const [mode, setMode] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0, skipped: 0 });

  const question = SAMPLE_QUESTIONS[currentQ];
  const progress = ((currentQ + (answered ? 1 : 0)) / SAMPLE_QUESTIONS.length) * 100;

  useEffect(() => {
    if (phase !== 'active' || answered) return;
    const timer = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [phase, answered]);

  const startSession = (m: string) => {
    setMode(m);
    setPhase('active');
    setCurrentQ(0);
    setScore({ correct: 0, incorrect: 0, skipped: 0 });
    setTimeElapsed(0);
  };

  const submitAnswer = () => {
    if (!selected) return;
    setAnswered(true);
    const isCorrect = selected === question.correct;
    setScore(s => ({ ...s, correct: s.correct + (isCorrect ? 1 : 0), incorrect: s.incorrect + (isCorrect ? 0 : 1) }));
  };

  const nextQuestion = () => {
    if (currentQ < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setAnswered(false);
      setShowHint(false);
      setBookmarked(false);
    } else {
      setPhase('review');
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  /* ---- MODE SELECTION ---- */
  if (phase === 'select') {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard" className="text-sm font-bold text-ink-soft hover:text-navy flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
        <div>
          <Badge tone="coral" size="md" className="mb-3"><Pencil className="w-3.5 h-3.5" /> Practice Engine</Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-navy">Start a practice session</h1>
          <p className="text-ink-soft mt-1">Choose how you want to practice today. Idrak will adapt the questions to your level.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODES.map(m => {
            const toneMap: Record<string, string> = {
              coral: 'bg-coral/10 border-coral/30',
              yellow: 'bg-yellow/15 border-yellow/40',
              lavender: 'bg-lavender-light border-lavender/30',
              mint: 'bg-mint/15 border-mint/30',
            };
            const iconTone: Record<string, string> = {
              coral: 'bg-coral text-white',
              yellow: 'bg-yellow text-navy',
              lavender: 'bg-lavender-deep text-white',
              mint: 'bg-mint text-white',
            };
            return (
              <button key={m.id} onClick={() => startSession(m.id)} className="text-left">
                <Card padding="lg" hoverable className={toneMap[m.tone]}>
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', iconTone[m.tone])}>
                    <m.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-navy text-lg mb-1">{m.name}</h3>
                  <p className="text-sm text-ink-soft">{m.desc}</p>
                </Card>
              </button>
            );
          })}
        </div>

        {topicParam && (
          <Card padding="lg" tone="coral" className="mt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Badge tone="coral" size="sm" className="bg-white text-coral mb-2">Recommended</Badge>
                <h3 className="font-black text-navy text-lg">Jump into {TOPIC_INTELLIGENCE.find(t => t.topicId === topicParam)?.name || 'your priority topic'}</h3>
                <p className="text-sm text-ink-soft mt-1">High exam weight + weak performance — your top priority today.</p>
              </div>
              <Button variant="coral" size="lg" onClick={() => startSession('topic')}>Start now</Button>
            </div>
          </Card>
        )}
      </div>
    );
  }

  /* ---- SESSION REVIEW ---- */
  if (phase === 'review') {
    const total = SAMPLE_QUESTIONS.length;
    const pct = Math.round((score.correct / total) * 100);
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card padding="xl" className="bg-white text-center">
          <div className="w-20 h-20 rounded-full bg-coral/15 flex items-center justify-center mx-auto mb-4">
            <Target className="w-10 h-10 text-coral" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-navy mb-2">Session complete!</h1>
          <p className="text-ink-soft mb-6">Here's how you did in this {mode} session.</p>

          <div className="text-6xl font-black text-coral mb-2">{pct}%</div>
          <div className="text-sm font-bold text-ink-soft mb-8">{score.correct} out of {total} correct</div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
            <div className="p-4 rounded-2xl bg-teal-50">
              <div className="font-black text-2xl text-teal-700">{score.correct}</div>
              <div className="text-xs font-bold text-teal-700/80">Correct</div>
            </div>
            <div className="p-4 rounded-2xl bg-red-50">
              <div className="font-black text-2xl text-red-600">{score.incorrect}</div>
              <div className="text-xs font-bold text-red-600/80">Incorrect</div>
            </div>
            <div className="p-4 rounded-2xl bg-cream-dark">
              <div className="font-black text-2xl text-ink">{formatTime(timeElapsed)}</div>
              <div className="text-xs font-bold text-ink-mute">Time</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="coral" size="lg" iconRight={RotateCcw} onClick={() => setPhase('select')}>Practice again</Button>
            <Link href="/analytics"><Button variant="outline" size="lg">View analytics</Button></Link>
            <Link href="/tutor"><Button variant="lavender" size="lg">Ask Idrak Tutor</Button></Link>
          </div>
        </Card>
      </div>
    );
  }

  /* ---- ACTIVE QUESTION ---- */
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => setPhase('select')} className="p-2 rounded-xl hover:bg-white transition text-ink-soft">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <Progress value={progress} tone="coral" size="sm" />
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="gray" size="md">
            <Clock className="w-3.5 h-3.5" /> {formatTime(timeElapsed)}
          </Badge>
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={cn('p-2.5 rounded-xl transition', bookmarked ? 'bg-yellow text-navy' : 'bg-white hover:bg-cream-dark')}
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="p-2.5 rounded-xl bg-white hover:bg-cream-dark transition">
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Card padding="xl" className="bg-white">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <Badge tone="lavender" size="sm">Question {question.number} of {SAMPLE_QUESTIONS.length}</Badge>
          <Badge tone={question.difficulty === 'easy' ? 'mint' : question.difficulty === 'medium' ? 'yellow' : 'coral'} size="sm">
            {question.difficulty}
          </Badge>
          <Badge tone="gray" size="sm">{question.subject} · {question.topic}</Badge>
          {question.year && <Badge tone="ink" size="sm">JAMB {question.year}</Badge>}
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-navy leading-relaxed mb-8">
          {question.text}
        </h2>

        <div className="space-y-3 mb-6">
          {question.options.map(opt => {
            const isSelected = selected === opt.id;
            const isCorrect = opt.id === question.correct;
            const showResult = answered;
            return (
              <button
                key={opt.id}
                disabled={answered}
                onClick={() => setSelected(opt.id)}
                className={cn(
                  'w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4',
                  !showResult && isSelected && 'border-coral bg-coral/10 ring-4 ring-coral/15',
                  !showResult && !isSelected && 'border-line bg-white hover:border-ink-mute/40',
                  showResult && isCorrect && 'border-teal-500 bg-teal-50',
                  showResult && isSelected && !isCorrect && 'border-red-500 bg-red-50',
                  showResult && !isSelected && !isCorrect && 'border-line bg-white opacity-60'
                )}
              >
                <div className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0',
                  !showResult && isSelected ? 'bg-coral text-white' : !showResult ? 'bg-cream-dark text-ink-soft' :
                  isCorrect ? 'bg-teal-500 text-white' : isSelected ? 'bg-red-500 text-white' : 'bg-cream-dark text-ink-soft'
                )}>
                  {showResult && isCorrect ? <CheckCircle2 className="w-5 h-5" /> :
                   showResult && isSelected && !isCorrect ? <XCircle className="w-5 h-5" /> : opt.id}
                </div>
                <span className={cn(
                  'font-semibold text-base',
                  showResult && isCorrect ? 'text-teal-800' : showResult && isSelected && !isCorrect ? 'text-red-800' : 'text-navy'
                )}>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={cn(
            'p-5 rounded-2xl mb-5 border-2',
            selected === question.correct ? 'bg-teal-50 border-teal-300' : 'bg-coral/10 border-coral/30'
          )}>
            <div className="flex items-start gap-3">
              {selected === question.correct ? (
                <CheckCircle2 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-coral flex-shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-black text-navy mb-1">
                  {selected === question.correct ? 'Correct!' : 'Not quite right.'}
                </div>
                <p className="text-sm text-ink-soft leading-relaxed">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {!answered && !showHint && (
          <button
            onClick={() => setShowHint(true)}
            className="flex items-center gap-2 text-sm font-bold text-lavender-deep hover:text-lavender-deep/80 mb-5"
          >
            <Lightbulb className="w-4 h-4" /> Ask Idrak for a hint
          </button>
        )}

        {showHint && !answered && (
          <div className="p-4 rounded-2xl bg-yellow/20 border border-yellow/50 mb-5">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-700 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-bold text-sm text-navy mb-1">Idrak hint (Socratic mode)</div>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Remember, for a quadratic equation x² + bx + c = 0, we're looking for two numbers that multiply to give c and add to give b. Can you find two numbers that multiply to 6 and add to −5?
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-line">
          <Button
            variant="ghost"
            size="md"
            icon={ChevronLeft}
            disabled={currentQ === 0}
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          >
            Previous
          </Button>
          {!answered ? (
            <Button variant="coral" size="lg" onClick={submitAnswer} disabled={!selected}>
              Submit answer
            </Button>
          ) : (
            <Button variant="coral" size="lg" iconRight={ChevronRight} onClick={nextQuestion}>
              {currentQ === SAMPLE_QUESTIONS.length - 1 ? 'See results' : 'Next question'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-cream-dark rounded-2xl" />
          <div className="h-96 bg-white rounded-3xl card-shadow" />
        </div>
      </div>
    }>
      <PracticeContent />
    </Suspense>
  );
}
