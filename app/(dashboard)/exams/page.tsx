'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap, Clock, Target, Play, CheckCircle2,
  AlertCircle, ChevronRight, Trophy, XCircle, Flag, ChevronLeft
} from 'lucide-react';
import { Card, Button, Badge, Progress } from '@/components/ui';
import { cn } from '@/lib/utils';
import { EXAMS, getExamById, type ExamSeed } from '@/lib/data';

interface MockQuestion {
  id: string;
  question_text: string;
  options: { id: string; text: string }[];
  difficulty: string;
  subject_name?: string;
  topic_name?: string;
  content_type?: 'real' | 'generated' | 'demo' | 'unknown';
  source_reference?: string | null;
}
type QResult = { selected: string | null; submitted: boolean; correct: boolean | null; correctAnswer: string | null; explanation: string | null; marked: boolean };
type ContentStatus = { examCode: string; totalQuestions: number; realQuestions: number; generatedQuestions: number; hasContent: boolean };

const QUESTION_COUNT_OPTIONS = [20, 40, 60];
const MINUTES_PER_QUESTION = 1.5; // a plain, disclosed estimate — not derived from any per-exam figure

export default function ExamsPage() {
  const [screen, setScreen] = useState<'setup' | 'active' | 'result' | 'review'>('setup');
  const [exam, setExam] = useState<ExamSeed | null>(null);
  const [questionCount, setQuestionCount] = useState(40);
  const [difficulty, setDifficulty] = useState<'any' | 'easy' | 'medium' | 'hard' | 'challenging'>('any');
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState<Record<number, QResult>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [contentStatus, setContentStatus] = useState<ContentStatus | null>(null);

  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'include' })
      .then(r => r.json())
      .then(payload => { const examId = payload?.data?.user?.examId; if (examId) setExam(getExamById(examId) ?? null); })
      .catch(() => undefined);
  }, []);
  const activeExam = exam ?? EXAMS[0];

  useEffect(() => {
    fetch('/api/exams/content-status', { credentials: 'include' })
      .then(r => r.json())
      .then(payload => {
        const row = (payload.data ?? []).find((s: { examCode: string }) => s.examCode === activeExam.code);
        setContentStatus(row ?? { examCode: activeExam.code, totalQuestions: 0, realQuestions: 0, generatedQuestions: 0, hasContent: false });
      })
      .catch(() => undefined);
  }, [activeExam.code]);

  const durationMinutes = useMemo(() => Math.max(10, Math.round(questionCount * MINUTES_PER_QUESTION)), [questionCount]);

  const result = current >= 0 ? results[current] : undefined;
  const qResult = (i: number): QResult => results[i] ?? { selected: null, submitted: false, correct: null, correctAnswer: null, explanation: null, marked: false };
  const setQResult = (i: number, patch: Partial<QResult>) => setResults(prev => ({ ...prev, [i]: { ...qResult(i), ...patch } }));

  const startMock = () => {
    setLoading(true);
    setLoadError(null);
    const params = new URLSearchParams({ limit: String(questionCount), mode: 'random' });
    if (difficulty !== 'any') params.set('difficulty', difficulty);
    fetch(`/api/questions?${params.toString()}`, { credentials: 'include' })
      .then(async r => { const payload = await r.json(); if (!r.ok) throw new Error(payload.error?.message || 'Unable to load mock exam questions.'); return payload.data?.questions ?? []; })
      .then((rows: MockQuestion[]) => {
        if (rows.length === 0) { setLoadError(`No ${activeExam.shortName} questions are available yet.`); return; }
        setQuestions(rows);
        setResults({});
        setCurrent(0);
        setSecondsLeft(Math.round(rows.length * MINUTES_PER_QUESTION * 60));
        setScreen('active');
      })
      .catch((e: Error) => setLoadError(e.message))
      .finally(() => setLoading(false));
  };

  // Single reliable countdown: one interval, cleaned up on unmount/screen
  // change, guarded so it can never spawn a second timer on re-render.
  useEffect(() => {
    if (screen !== 'active') return;
    if (secondsLeft <= 0) { setScreen('result'); return; }
    const id = setInterval(() => setSecondsLeft(s => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [screen, secondsLeft]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const selectAnswer = (id: string) => setQResult(current, { selected: id });
  const toggleMark = () => setQResult(current, { marked: !qResult(current).marked });
  const goTo = (i: number) => { if (i >= 0 && i < questions.length) setCurrent(i); };

  const submitMock = async () => {
    // Grade every answered question against the real correct answer via the
    // same attempt endpoint practice uses, so results and topic-mastery data
    // stay consistent across the app. Unanswered questions are left ungraded.
    const gradingEntries = Object.entries(results).filter(([, r]) => r.selected && !r.submitted);
    await Promise.all(gradingEntries.map(async ([idxStr, r]) => {
      const idx = Number(idxStr);
      const q = questions[idx];
      if (!q || !r.selected) return;
      try {
        const response = await fetch(`/api/questions/${q.id}/attempt`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ selectedAnswer: r.selected, timeSpentSeconds: 0 }) });
        const payload = await response.json();
        if (response.ok) setQResult(idx, { submitted: true, correct: Boolean(payload.data?.correct), correctAnswer: payload.data?.correctAnswer ?? null, explanation: payload.data?.explanation ?? null });
      } catch { /* leave ungraded on network failure */ }
    }));
    setScreen('result');
  };

  const summary = useMemo(() => {
    const total = questions.length;
    const answered = Object.values(results).filter(r => r.selected).length;
    const correct = Object.values(results).filter(r => r.correct === true).length;
    const incorrect = Object.values(results).filter(r => r.correct === false).length;
    const unanswered = total - answered;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const estimatedScore = Math.round((percentage / 100) * activeExam.maxScore);
    return { total, answered, correct, incorrect, unanswered, percentage, estimatedScore };
  }, [results, questions.length, activeExam.maxScore]);

  /* ---- SETUP ---- */
  if (screen === 'setup') {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <Badge tone="lavender" size="md" className="mb-3"><GraduationCap className="w-3.5 h-3.5" /> Mock Examinations · {activeExam.shortName}</Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-navy">Practice under exam conditions.</h1>
          <p className="text-ink-soft mt-1 max-w-2xl">A full-length timed mock built from your real question bank, with a question navigator and honest post-exam results.</p>
        </div>

        <Card padding="xl" className="bg-gradient-to-br from-lavender-light to-coral/10">
          <Badge tone="coral" size="md" className="mb-4"><Target className="w-3.5 h-3.5" /> Customize mock</Badge>
          <div className="grid sm:grid-cols-2 gap-6 max-w-xl">
            <div>
              <div className="text-xs font-black text-ink-mute uppercase mb-2">Number of questions</div>
              <div className="flex gap-2">
                {QUESTION_COUNT_OPTIONS.map(n => (
                  <button key={n} onClick={() => setQuestionCount(n)} className={cn('px-4 py-2 rounded-xl text-sm font-bold transition', questionCount === n ? 'bg-navy text-white' : 'bg-white text-ink-soft hover:bg-cream-dark')}>{n}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-black text-ink-mute uppercase mb-2">Difficulty</div>
              <div className="flex gap-2 flex-wrap">
                {(['any', 'easy', 'medium', 'hard'] as const).map(d => (
                  <button key={d} onClick={() => setDifficulty(d)} className={cn('px-4 py-2 rounded-xl text-sm font-bold capitalize transition', difficulty === d ? 'bg-navy text-white' : 'bg-white text-ink-soft hover:bg-cream-dark')}>{d}</button>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-ink-soft mt-4">
            ~{durationMinutes} minutes ({MINUTES_PER_QUESTION} min/question, an estimate).{' '}
            {contentStatus == null ? 'Checking available questions…' :
             contentStatus.hasContent ? `${contentStatus.totalQuestions} ${activeExam.shortName} question${contentStatus.totalQuestions === 1 ? '' : 's'} currently available${contentStatus.generatedQuestions > 0 && contentStatus.realQuestions === 0 ? ' (Idrak-generated practice content)' : ''}.` :
             `No ${activeExam.shortName} questions are loaded yet.`}
          </p>
          {loadError && <p className="text-sm font-bold text-coral mt-3">{loadError}</p>}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button variant="coral" size="lg" icon={Play} onClick={startMock} disabled={loading || contentStatus?.hasContent === false}>{loading ? 'Loading questions…' : 'Start mock exam'}</Button>
          </div>
        </Card>
      </div>
    );
  }

  /* ---- ACTIVE ---- */
  if (screen === 'active') {
    const q = questions[current];
    const answeredCount = Object.values(results).filter(r => r.selected).length;
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <Card padding="md" className="bg-navy text-white">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <Badge tone="coral" size="sm" className="bg-coral/20 text-coral mb-1">Live exam</Badge>
              <h2 className="font-black text-lg">{activeExam.name} Mock Examination</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-white/60 font-bold">Time remaining</div>
                <div className={cn('text-2xl font-black font-mono', secondsLeft < 300 ? 'text-coral' : 'text-white')}>{formatTime(secondsLeft)}</div>
              </div>
              <Button variant="coral" size="sm" onClick={submitMock}>Submit</Button>
            </div>
          </div>
        </Card>
        <div className="grid lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <Card padding="xl">
              <div className="flex items-center justify-between mb-3">
                <Badge tone="lavender" size="sm">Question {current + 1} of {questions.length}{q.subject_name ? ` · ${q.subject_name}` : ''}</Badge>
                <div className="flex items-center gap-2">
                  {q.content_type === 'generated' && <Badge tone="gray" size="sm">Idrak-generated</Badge>}
                  {q.content_type === 'real' && q.source_reference && <Badge tone="gray" size="sm">{q.source_reference}</Badge>}
                  <button onClick={toggleMark} className={cn('p-2 rounded-lg transition', qResult(current).marked ? 'bg-lavender-deep text-white' : 'bg-cream-dark text-ink-mute hover:text-navy')}>
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h2 className="text-xl font-bold text-navy mb-6">{q.question_text}</h2>
              <div className="space-y-3">
                {q.options.map((opt) => {
                  const isSelected = qResult(current).selected === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => selectAnswer(opt.id)}
                      className={cn(
                        'w-full text-left p-4 rounded-2xl border-2 font-semibold text-navy transition',
                        isSelected ? 'border-coral bg-coral/10 ring-4 ring-coral/15' : 'border-line bg-white hover:border-coral/50 hover:bg-coral/5'
                      )}
                    >
                      <span className={cn('inline-flex w-8 h-8 rounded-lg items-center justify-center font-black text-sm mr-3', isSelected ? 'bg-coral text-white' : 'bg-cream-dark')}>
                        {opt.id}
                      </span>
                      {opt.text}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-line">
                <Button variant="outline" size="md" icon={ChevronLeft} disabled={current === 0} onClick={() => goTo(current - 1)}>Previous</Button>
                <Button variant="dark" size="md" onClick={toggleMark}>{qResult(current).marked ? 'Unmark' : 'Mark for review'}</Button>
                <Button variant="coral" size="md" iconRight={ChevronRight} disabled={current === questions.length - 1} onClick={() => goTo(current + 1)}>Next</Button>
              </div>
            </Card>
          </div>
          <Card padding="md">
            <h3 className="font-black text-navy mb-3 text-sm">Question navigator</h3>
            <div className="grid grid-cols-6 gap-1.5">
              {questions.map((_, i) => {
                const r = qResult(i);
                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={cn(
                      'aspect-square rounded-md text-[10px] font-bold flex items-center justify-center transition',
                      i === current ? 'bg-navy text-white' :
                      r.marked ? 'bg-lavender-deep text-white' :
                      r.selected ? 'bg-mint text-white' : 'bg-line text-ink-mute'
                    )}
                  >{i + 1}</button>
                );
              })}
            </div>
            <div className="mt-4 space-y-2 text-xs font-bold">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-mint" /> Answered ({answeredCount})</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-lavender-deep" /> Marked for review</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-line" /> Unanswered</div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  /* ---- RESULT ---- */
  if (screen === 'result') {
    return (
      <div className="max-w-5xl mx-auto space-y-5">
        <Card padding="xl" className="bg-navy text-white text-center">
          <Trophy className="w-16 h-16 text-yellow mx-auto mb-4" />
          <Badge tone="yellow" size="md" className="mb-4">Mock exam completed</Badge>
          <h1 className="text-5xl font-black mb-2">{summary.estimatedScore} <span className="text-white/60 text-2xl">/ {activeExam.maxScore}</span></h1>
          <p className="text-white/70 mb-6">You scored {summary.percentage}% ({summary.correct} of {summary.total}). This {activeExam.shortName}-scale score is an estimate from your accuracy, not an official result.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="bg-white/10 rounded-2xl p-3"><div className="text-2xl font-black text-teal-400">{summary.correct}</div><div className="text-xs text-white/60 font-bold">Correct</div></div>
            <div className="bg-white/10 rounded-2xl p-3"><div className="text-2xl font-black text-coral">{summary.incorrect}</div><div className="text-xs text-white/60 font-bold">Incorrect</div></div>
            <div className="bg-white/10 rounded-2xl p-3"><div className="text-2xl font-black text-yellow">{summary.unanswered}</div><div className="text-xs text-white/60 font-bold">Unanswered</div></div>
            <div className="bg-white/10 rounded-2xl p-3"><div className="text-2xl font-black">{summary.percentage}%</div><div className="text-xs text-white/60 font-bold">Accuracy</div></div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="coral" size="lg" onClick={() => { setReviewIndex(0); setScreen('review'); }}>Review mistakes</Button>
          <Button variant="outline" size="lg" onClick={() => setScreen('setup')}>Take another mock</Button>
          <Link href="/analytics"><Button variant="lavender" size="lg">View analytics</Button></Link>
        </div>
      </div>
    );
  }

  /* ---- REVIEW MISTAKES ---- */
  const wrongIndices = questions.map((_, i) => i).filter(i => results[i]?.correct === false);
  if (screen === 'review') {
    if (wrongIndices.length === 0) {
      return (
        <div className="max-w-3xl mx-auto space-y-4 text-center">
          <Card padding="xl">
            <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto mb-3" />
            <h2 className="font-black text-navy text-xl mb-2">No graded mistakes to review</h2>
            <p className="text-ink-soft">Every question you submitted an answer for was correct, or nothing was graded.</p>
            <Button variant="outline" className="mt-4" onClick={() => setScreen('result')}>Back to results</Button>
          </Card>
        </div>
      );
    }
    const idx = wrongIndices[Math.min(reviewIndex, wrongIndices.length - 1)];
    const q = questions[idx];
    const r = results[idx];
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setScreen('result')}>← Back to results</Button>
          <Badge tone="coral" size="sm">Mistake {reviewIndex + 1} of {wrongIndices.length}</Badge>
        </div>
        <Card padding="xl">
          <h3 className="font-bold text-navy text-lg mb-5">{q.question_text}</h3>
          <div className="space-y-3 mb-5">
            {q.options.map(opt => {
              const isYourAnswer = r?.selected === opt.id;
              const isCorrect = r?.correctAnswer === opt.id;
              return (
                <div key={opt.id} className={cn(
                  'p-4 rounded-2xl border-2 flex items-center gap-3',
                  isCorrect ? 'border-teal-500 bg-teal-50' : isYourAnswer ? 'border-red-500 bg-red-50' : 'border-line'
                )}>
                  {isCorrect ? <CheckCircle2 className="w-5 h-5 text-teal-600" /> : isYourAnswer ? <XCircle className="w-5 h-5 text-red-500" /> : <div className="w-5 h-5" />}
                  <span className="font-semibold text-navy">{opt.text}</span>
                  {isYourAnswer && <Badge tone="gray" size="sm" className="ml-auto">Your answer</Badge>}
                </div>
              );
            })}
          </div>
          {r?.explanation && (
            <div className="p-4 rounded-2xl bg-lavender-light border border-lavender/30">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-lavender-deep flex-shrink-0 mt-0.5" />
                <p className="text-sm text-navy leading-relaxed">{r.explanation}</p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mt-6">
            <Button variant="outline" size="md" disabled={reviewIndex === 0} onClick={() => setReviewIndex(i => i - 1)}>Previous mistake</Button>
            <Button variant="coral" size="md" disabled={reviewIndex === wrongIndices.length - 1} onClick={() => setReviewIndex(i => i + 1)}>Next mistake</Button>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
