'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Clock, AlertCircle, ChevronLeft, ChevronRight, Flag, Bookmark,
  HelpCircle, CheckCircle2, XCircle, RotateCcw, Pencil,
  Timer, Target, Shuffle, Flame, Zap, ArrowLeft, SkipForward
} from 'lucide-react';
import { Card, Button, Badge, Progress } from '@/components/ui';
import { EXAMS, getExamById, type ExamSeed } from '@/lib/data';
import { cn } from '@/lib/utils';

interface PracticeQuestion {
  id: string;
  question_text: string;
  options: { id: string; text: string }[];
  difficulty: string;
  year?: number;
  subject_name?: string;
  topic_name?: string;
  topic_id?: string | null;
  content_type?: 'real' | 'generated' | 'demo' | 'unknown';
  source_reference?: string | null;
}

function provenanceLabel(q: Pick<PracticeQuestion, 'content_type' | 'source_reference'>): string | null {
  if (q.content_type === 'real' && q.source_reference) return q.source_reference;
  if (q.content_type === 'generated') return 'Idrak-generated practice question';
  if (q.content_type === 'demo') return 'Demo question';
  return null; // 'unknown' or unset — no claim made either way
}

type QState = {
  selected: string | null;
  submitted: boolean;
  skipped: boolean;
  correct: boolean | null;
  correctAnswer: string | null;
  explanation: string | null;
  bookmarked: boolean;
  marked: boolean;
};

const MODES = [
  { id: 'topic', name: 'Topic Practice', desc: 'Drill a specific topic', icon: Target, tone: 'coral' },
  { id: 'weak', name: 'Weak Topics', desc: 'Focus on your weak areas', icon: Flame, tone: 'yellow' },
  { id: 'high_yield', name: 'High-Yield', desc: 'Most frequent exam topics', icon: Zap, tone: 'lavender' },
  { id: 'timed', name: 'Timed Practice', desc: 'Build exam-day stamina', icon: Timer, tone: 'mint' },
  { id: 'subject', name: 'Subject Practice', desc: 'Mixed questions per subject', icon: Pencil, tone: 'coral' },
  { id: 'random', name: 'Random Mix', desc: 'Stay surprised', icon: Shuffle, tone: 'lavender' },
];

const SECONDS_PER_TIMED_QUESTION = 90;

function emptyQState(): QState {
  return { selected: null, submitted: false, skipped: false, correct: null, correctAnswer: null, explanation: null, bookmarked: false, marked: false };
}

function PracticeContent() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get('topic');
  const [phase, setPhase] = useState<'select' | 'topic-pick' | 'active' | 'review'>('select');
  const [pendingMode, setPendingMode] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(topicParam);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, QState>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timedSecondsLeft, setTimedSecondsLeft] = useState<number | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);
  const [exam, setExam] = useState<ExamSeed | null>(null);
  const [pendingBookmark, setPendingBookmark] = useState(false);

  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'include' })
      .then(res => res.json())
      .then(payload => {
        const examId = payload?.data?.user?.examId;
        if (examId) setExam(getExamById(examId) ?? null);
      })
      .catch(() => undefined);
  }, []);
  const activeExam = exam ?? EXAMS[0];

  const question = questions[currentQ];
  const qState = answers[currentQ] ?? emptyQState();
  const setQState = (patch: Partial<QState>) => setAnswers(prev => ({ ...prev, [currentQ]: { ...(prev[currentQ] ?? emptyQState()), ...patch } }));
  const answeredCount = Object.values(answers).filter(a => a.submitted || a.skipped).length;
  const progress = questions.length ? (answeredCount / questions.length) * 100 : 0;

  useEffect(() => {
    if (phase !== 'active') return;
    setLoadingQuestions(true);
    setError(null);
    setAnswers({});
    setCurrentQ(0);
    const params = new URLSearchParams({ limit: mode === 'timed' ? '15' : '10', mode: mode || 'random' });
    if (selectedTopicId) params.set('topicId', selectedTopicId);
    fetch(`/api/questions?${params.toString()}`, { credentials: 'include' })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error?.message || 'Unable to load questions.');
        return payload.data ?? { questions: [], fallback: null };
      })
      .then((data) => {
        setQuestions(data.questions ?? []);
        setFallbackNotice(data.fallback === 'no_performance_data'
          ? "You don't have enough practice history yet for weak-topic detection — showing a general mix instead."
          : (data.questions ?? []).length === 0 ? `No ${activeExam.shortName} questions are loaded for this mode yet.` : null);
        if (mode === 'timed') setTimedSecondsLeft((data.questions ?? []).length * SECONDS_PER_TIMED_QUESTION);
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoadingQuestions(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, mode, selectedTopicId]);

  // Per-question stopwatch (used for time-spent reporting on submit).
  useEffect(() => {
    if (phase !== 'active' || qState.submitted || qState.skipped) return;
    const timer = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    return () => { clearInterval(timer); setTimeElapsed(0); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentQ, qState.submitted, qState.skipped]);

  // Whole-session countdown for Timed Practice. A single interval, cleaned up
  // on unmount/mode change — auto-submits the session when it hits zero.
  useEffect(() => {
    if (phase !== 'active' || mode !== 'timed' || timedSecondsLeft === null) return;
    if (timedSecondsLeft <= 0) { setPhase('review'); return; }
    const id = setInterval(() => setTimedSecondsLeft(s => (s === null ? null : s - 1)), 1000);
    return () => clearInterval(id);
  }, [phase, mode, timedSecondsLeft]);

  const startSession = (m: string) => {
    if ((m === 'topic' || m === 'subject') && !selectedTopicId) {
      setPendingMode(m);
      setPhase('topic-pick');
      return;
    }
    setMode(m);
    setPhase('active');
  };

  const submitAnswer = async () => {
    if (!qState.selected || !question) return;
    const response = await fetch(`/api/questions/${question.id}/attempt`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ selectedAnswer: qState.selected, timeSpentSeconds: timeElapsed }) });
    const payload = await response.json();
    if (!response.ok) { setError(payload.error?.message || 'Unable to submit answer.'); return; }
    setQState({
      submitted: true,
      correct: Boolean(payload.data?.correct),
      correctAnswer: payload.data?.correctAnswer ?? null,
      explanation: payload.data?.explanation || 'Answer recorded.',
    });
  };

  const skipQuestion = () => setQState({ skipped: true });

  const toggleBookmark = async () => {
    if (!question) return;
    const next = !qState.bookmarked;
    setQState({ bookmarked: next });
    setPendingBookmark(true);
    try {
      await fetch(`/api/questions/${question.id}/bookmark`, { method: next ? 'POST' : 'DELETE', credentials: 'include' });
    } catch { setQState({ bookmarked: !next }); }
    finally { setPendingBookmark(false); }
  };

  const goTo = (index: number) => { if (index >= 0 && index < questions.length) setCurrentQ(index); };
  const nextQuestion = () => { if (currentQ < questions.length - 1) goTo(currentQ + 1); else setPhase('review'); };

  const formatTime = (s: number) => { const m = Math.floor(s / 60); const sec = s % 60; return `${m}:${sec.toString().padStart(2, '0')}`; };

  const summary = useMemo(() => {
    const values = Object.values(answers);
    const correct = values.filter(a => a.correct === true).length;
    const incorrect = values.filter(a => a.correct === false).length;
    const skipped = values.filter(a => a.skipped).length;
    return { correct, incorrect, skipped, total: questions.length };
  }, [answers, questions.length]);

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
          <Badge tone="coral" size="md" className="mb-3"><Pencil className="w-3.5 h-3.5" /> Practice Engine · {activeExam.shortName}</Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-navy">Start a practice session</h1>
          <p className="text-ink-soft mt-1">Choose how you want to practice today.</p>
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
              <button key={m.id} onClick={() => { setSelectedTopicId(m.id === 'topic' || m.id === 'subject' ? selectedTopicId : null); startSession(m.id); }} className="text-left">
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
                <h3 className="font-black text-navy text-lg">Jump into your priority topic</h3>
                <p className="text-sm text-ink-soft mt-1">High exam weight + weak performance — your top priority today.</p>
              </div>
              <Button variant="coral" size="lg" onClick={() => { setSelectedTopicId(topicParam); startSession('topic'); }}>Start now</Button>
            </div>
          </Card>
        )}
      </div>
    );
  }

  /* ---- TOPIC PICKER (Topic/Subject practice without a preset topic) ---- */
  if (phase === 'topic-pick') {
    return <TopicPicker
      onCancel={() => setPhase('select')}
      onPick={(topicId) => { setSelectedTopicId(topicId); setMode(pendingMode); setPhase('active'); }}
    />;
  }

  /* ---- SESSION REVIEW ---- */
  if (phase === 'review') {
    const total = summary.total || 1;
    const pct = Math.round((summary.correct / total) * 100);
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card padding="xl" className="bg-white text-center">
          <div className="w-20 h-20 rounded-full bg-coral/15 flex items-center justify-center mx-auto mb-4">
            <Target className="w-10 h-10 text-coral" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-navy mb-2">Session complete!</h1>
          <p className="text-ink-soft mb-6">Here's how you did in this {mode?.replace('_', ' ')} session.</p>

          <div className="text-6xl font-black text-coral mb-2">{pct}%</div>
          <div className="text-sm font-bold text-ink-soft mb-8">{summary.correct} out of {summary.total} correct</div>

          <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto mb-8">
            <div className="p-4 rounded-2xl bg-teal-50">
              <div className="font-black text-2xl text-teal-700">{summary.correct}</div>
              <div className="text-xs font-bold text-teal-700/80">Correct</div>
            </div>
            <div className="p-4 rounded-2xl bg-red-50">
              <div className="font-black text-2xl text-red-600">{summary.incorrect}</div>
              <div className="text-xs font-bold text-red-600/80">Incorrect</div>
            </div>
            <div className="p-4 rounded-2xl bg-yellow/15">
              <div className="font-black text-2xl text-yellow-700">{summary.skipped}</div>
              <div className="text-xs font-bold text-yellow-700/80">Skipped</div>
            </div>
            <div className="p-4 rounded-2xl bg-cream-dark">
              <div className="font-black text-2xl text-ink">{summary.total - summary.correct - summary.incorrect - summary.skipped}</div>
              <div className="text-xs font-bold text-ink-mute">Unanswered</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="coral" size="lg" iconRight={RotateCcw} onClick={() => { setPhase('select'); setSelectedTopicId(topicParam); }}>Practice again</Button>
            <Link href="/analytics"><Button variant="outline" size="lg">View analytics</Button></Link>
            <Link href="/tutor"><Button variant="lavender" size="lg">Ask Idrak Tutor</Button></Link>
          </div>
        </Card>
      </div>
    );
  }

  /* ---- ACTIVE QUESTION ---- */
  if (loadingQuestions) return <div className="max-w-4xl mx-auto"><Card padding="xl" className="bg-white text-center"><p className="text-ink-soft">Loading questions from your question bank…</p></Card></div>;
  if (error || !question) return (
    <div className="max-w-4xl mx-auto">
      <Card padding="xl" className="bg-white text-center">
        <p className="text-ink-soft">{error || fallbackNotice || 'No questions are available for this practice session yet.'}</p>
        <Button variant="outline" className="mt-4" onClick={() => setPhase('select')}>Back to practice</Button>
      </Card>
    </div>
  );
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
          {mode === 'timed' && timedSecondsLeft !== null ? (
            <Badge tone={timedSecondsLeft < 60 ? 'coral' : 'gray'} size="md">
              <Timer className="w-3.5 h-3.5" /> {formatTime(timedSecondsLeft)}
            </Badge>
          ) : (
            <Badge tone="gray" size="md">
              <Clock className="w-3.5 h-3.5" /> {formatTime(timeElapsed)}
            </Badge>
          )}
          <button
            disabled={pendingBookmark}
            onClick={toggleBookmark}
            className={cn('p-2.5 rounded-xl transition', qState.bookmarked ? 'bg-yellow text-navy' : 'bg-white hover:bg-cream-dark')}
          >
            <Bookmark className={cn('w-4 h-4', qState.bookmarked && 'fill-current')} />
          </button>
          <button
            onClick={() => setQState({ marked: !qState.marked })}
            className={cn('p-2.5 rounded-xl transition', qState.marked ? 'bg-lavender-deep text-white' : 'bg-white hover:bg-cream-dark')}
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {fallbackNotice && (
        <Card padding="sm" tone="yellow" className="text-sm font-semibold text-navy">{fallbackNotice}</Card>
      )}

      {/* Question navigator strip — jump to any question, preserving its state */}
      {questions.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {questions.map((_, i) => {
            const s = answers[i];
            const isCurrent = i === currentQ;
            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  'w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition',
                  isCurrent ? 'bg-navy text-white' :
                  s?.marked ? 'bg-lavender-deep text-white' :
                  s?.submitted ? 'bg-mint text-white' :
                  s?.skipped ? 'bg-yellow text-navy' :
                  'bg-cream-dark text-ink-mute hover:bg-line'
                )}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      )}

      <Card padding="xl" className="bg-white">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <Badge tone="lavender" size="sm">Question {currentQ + 1} of {questions.length}</Badge>
          <Badge tone={question.difficulty === 'easy' ? 'mint' : question.difficulty === 'medium' ? 'yellow' : 'coral'} size="sm">
            {question.difficulty}
          </Badge>
          {(question.subject_name || question.topic_name) && (
            <Badge tone="gray" size="sm">{question.subject_name || activeExam.unitLabel} · {question.topic_name || 'General'}</Badge>
          )}
          {question.year && <Badge tone="ink" size="sm">{activeExam.shortName} {question.year}</Badge>}
          {provenanceLabel(question) && <Badge tone="gray" size="sm">{provenanceLabel(question)}</Badge>}
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-navy leading-relaxed mb-8">
          {question.question_text}
        </h2>

        <div className="space-y-3 mb-6">
          {question.options.map(opt => {
            const isSelected = qState.selected === opt.id;
            const isCorrect = qState.correctAnswer === opt.id;
            const showResult = qState.submitted;
            return (
              <button
                key={opt.id}
                disabled={showResult || qState.skipped}
                onClick={() => setQState({ selected: opt.id })}
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

        {qState.skipped && !qState.submitted && (
          <div className="p-4 rounded-2xl mb-5 border-2 border-yellow/50 bg-yellow/10 text-sm font-semibold text-navy">
            Skipped — you can still answer it if you come back before ending the session.
          </div>
        )}

        {qState.submitted && (
          <div className={cn(
            'p-5 rounded-2xl mb-5 border-2',
            qState.correct === true ? 'bg-teal-50 border-teal-300' : 'bg-coral/10 border-coral/30'
          )}>
            <div className="flex items-start gap-3">
              {qState.correct === true ? (
                <CheckCircle2 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-coral flex-shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-black text-navy mb-1">
                  {qState.correct === true ? 'Correct!' : 'Not quite right.'}
                </div>
                <p className="text-sm text-ink-soft leading-relaxed">{qState.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {!qState.submitted && !qState.skipped && (
          <div className="flex items-center gap-2 text-sm font-bold text-ink-mute mb-5">
            <HelpCircle className="w-4 h-4" /> AI hints aren't available yet — this practice session isn't connected to the Tutor.
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-line gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="md"
            icon={ChevronLeft}
            disabled={currentQ === 0}
            onClick={() => goTo(currentQ - 1)}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {!qState.submitted && (
              <Button variant="outline" size="md" icon={SkipForward} onClick={skipQuestion}>Skip</Button>
            )}
            {!qState.submitted ? (
              <Button variant="coral" size="lg" onClick={submitAnswer} disabled={!qState.selected}>
                Submit answer
              </Button>
            ) : (
              <Button variant="coral" size="lg" iconRight={ChevronRight} onClick={nextQuestion}>
                {currentQ === questions.length - 1 ? 'See results' : 'Next question'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function TopicPicker({ onPick, onCancel }: { onPick: (topicId: string) => void; onCancel: () => void }) {
  const [topics, setTopics] = useState<{ id: string; name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/questions?limit=100', { credentials: 'include' })
      .then(r => r.json())
      .then(payload => {
        const rows: { topic_id: string | null; topic_name: string | null }[] = payload.data?.questions ?? [];
        const map = new Map<string, { id: string; name: string; count: number }>();
        rows.forEach(r => {
          if (!r.topic_id || !r.topic_name) return;
          const existing = map.get(r.topic_id);
          if (existing) existing.count += 1; else map.set(r.topic_id, { id: r.topic_id, name: r.topic_name, count: 1 });
        });
        setTopics(Array.from(map.values()));
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <button onClick={onCancel} className="text-sm font-bold text-ink-soft hover:text-navy flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-black text-navy">Pick a topic</h1>
      {loading ? (
        <Card padding="xl" className="text-center"><p className="text-ink-soft">Loading topics…</p></Card>
      ) : topics.length === 0 ? (
        <Card padding="xl" className="text-center"><p className="text-ink-soft">No topics with loaded questions yet for your exam.</p></Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {topics.map(t => (
            <button key={t.id} onClick={() => onPick(t.id)} className="text-left">
              <Card padding="md" hoverable>
                <div className="font-bold text-navy">{t.name}</div>
                <div className="text-xs text-ink-mute font-bold">{t.count} question{t.count === 1 ? '' : 's'} available</div>
              </Card>
            </button>
          ))}
        </div>
      )}
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
