'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ArrowLeft, CalendarDays, Target, Clock, BookOpen, CheckCircle2, Loader2 } from 'lucide-react';
import { Button, Card, Badge, Progress } from '@/components/ui';
import { IdrakLogo } from '@/components/illustrations';
import { EXAMS, getExamByCode } from '@/lib/data';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'What exam are you preparing for?', icon: Target },
  { id: 2, title: 'When is your exam?', icon: CalendarDays },
  { id: 3, title: 'Which subjects are you taking?', icon: BookOpen },
  { id: 4, title: 'What score are you targeting?', icon: Target },
  { id: 5, title: 'Rate your confidence in each subject', icon: Target },
  { id: 6, title: 'Which topics do you struggle with?', icon: Target },
  { id: 7, title: 'How much can you study each day?', icon: Clock },
];

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingContent />
    </Suspense>
  );
}

function OnboardingContent() {
  const router = useRouter();
  const examParam = useSearchParams().get('exam');
  const [step, setStep] = useState(1);
  const [contentCounts, setContentCounts] = useState<Record<string, number>>({});
  const [data, setData] = useState({
    examId: (examParam ? getExamByCode(examParam.toUpperCase())?.id : undefined) ?? EXAMS[0].id,
    examDate: '',
    subjects: [] as string[],
    targetScore: 280,
    confidence: {} as Record<string, number>,
    strugglingTopics: [] as string[],
    dailyMinutes: 45,
  });
  const [submitting, setSubmitting] = useState(false);

  // The exam a user selected on the landing page/signup is the source of truth,
  // persisted server-side on their account at registration. Once we know it,
  // it overrides whatever we guessed from the URL or the JAMB default above —
  // this is what stops onboarding (and everything downstream) from silently
  // reverting to JAMB.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/profile', { credentials: 'include' })
      .then(res => res.json())
      .then(payload => {
        if (cancelled) return;
        const savedExamId = payload?.data?.examId;
        if (savedExamId && EXAMS.some(e => e.id === savedExamId)) {
          const savedExam = EXAMS.find(e => e.id === savedExamId)!;
          update({ examId: savedExamId, targetScore: Math.round(savedExam.maxScore * 0.7) });
        }
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch('/api/exams/content-status', { credentials: 'include' })
      .then(r => r.json())
      .then(payload => {
        const map: Record<string, number> = {};
        (payload.data ?? []).forEach((s: { examCode: string; totalQuestions: number }) => { map[s.examCode] = s.totalQuestions; });
        setContentCounts(map);
      })
      .catch(() => undefined);
  }, []);

  const selectedExam = EXAMS.find(e => e.id === data.examId) || EXAMS[0];
  const currentStep = STEPS[step - 1];
  const progress = (step / STEPS.length) * 100;

  const update = (patch: Partial<typeof data>) => setData(d => ({ ...d, ...patch }));

  const next = async () => {
    if (step === STEPS.length) {
      setSubmitting(true);
      try {
        const response = await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ examId: data.examId, fieldOfStudy: data.subjects.join(', '), educationLevel: 'student', onboardingComplete: true }) });
        if (!response.ok) throw new Error('Unable to save onboarding');
        router.push('/dashboard');
        router.refresh();
      } catch { setSubmitting(false); }
    } else {
      setStep(s => s + 1);
    }
  };
  const back = () => setStep(s => Math.max(1, s - 1));

  const canProceed = () => {
    if (step === 1) return !!data.examId;
    if (step === 2) return !!data.examDate;
    if (step === 3) return data.subjects.length >= 1;
    if (step === 4) return !!data.targetScore;
    if (step === 5) return true;
    if (step === 6) return true;
    if (step === 7) return !!data.dailyMinutes;
    return true;
  };

  const toggleSubject = (subjectId: string) => {
    if (data.subjects.includes(subjectId)) {
      update({ subjects: data.subjects.filter(s => s !== subjectId) });
    } else {
      update({ subjects: [...data.subjects, subjectId] });
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="border-b border-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <IdrakLogo />
          <div className="text-sm font-semibold text-ink-soft">Step {step} of {STEPS.length}</div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-4">
          <Progress value={progress} tone="coral" size="sm" />
        </div>
      </div>

      <div className="flex-1 flex items-center py-8 px-4">
        <div className="max-w-3xl mx-auto w-full">
          <Card padding="xl" className="bg-white">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-coral/15 mb-5">
                {currentStep && <currentStep.icon className="w-7 h-7 text-coral" />}
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-navy text-balance">
                {step === 3 ? `Which ${selectedExam.unitLabel} are you taking?` : step === 5 ? `Rate your confidence in each ${selectedExam.unitLabel.replace(/s$/, '')}` : currentStep?.title}
              </h2>
              <p className="text-ink-soft mt-3">
                {step === 1 && 'Choose the exam you are currently preparing for.'}
                {step === 2 && 'This helps us calculate how many days you have and pace your plan.'}
                {step === 3 && `Pick the ${selectedExam.unitLabel} you are registered for. You can always change these later.`}
                {step === 4 && 'Set an ambitious but realistic target — Idrak will build your plan around it.'}
                {step === 5 && 'Be honest. This helps Idrak prioritize the right areas for you.'}
                {step === 6 && 'Select topics you already know give you trouble — we\'ll spend more time there.'}
                {step === 7 && 'Consistency beats intensity. Pick a daily study time you can stick to.'}
              </p>
            </div>

            {/* Step 1: Exam */}
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {EXAMS.map(exam => (
                  <button
                    key={exam.id}
                    type="button"
                    onClick={() => update({ examId: exam.id, targetScore: Math.round(exam.maxScore * 0.7) })}
                    className={cn(
                      'text-left p-5 rounded-3xl border-2 transition-all',
                      data.examId === exam.id
                        ? 'border-coral bg-coral/10 ring-4 ring-coral/15'
                        : 'border-line bg-white hover:border-ink-mute/30'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-white text-sm"
                        style={{ backgroundColor: exam.color }}
                      >
                        {exam.shortName.slice(0, 3)}
                      </div>
                      {data.examId === exam.id && <CheckCircle2 className="w-6 h-6 text-coral" />}
                    </div>
                    <div className="font-black text-navy text-lg">{exam.name}</div>
                    <div className="text-sm text-ink-soft mt-1">
                      {(contentCounts[exam.code] ?? 0) > 0 ? `${contentCounts[exam.code].toLocaleString()} questions available` : 'Question bank coming soon'}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Exam date */}
            {step === 2 && (
              <div className="max-w-sm mx-auto">
                <div className="bg-cream rounded-2xl p-6">
                  <label className="block text-sm font-bold text-navy mb-2">Exam date</label>
                  <input
                    type="date"
                    value={data.examDate}
                    onChange={e => update({ examDate: e.target.value })}
                    className="w-full bg-white rounded-xl border-2 border-line px-4 py-3 text-lg font-semibold text-navy focus:outline-none focus:border-coral"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {data.examDate && (() => {
                    const days = Math.ceil((new Date(data.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    return (
                      <div className="mt-4 text-center">
                        <Badge tone="coral" size="md">
                          {days} days to prepare
                        </Badge>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Step 3: Subjects */}
            {step === 3 && (
              <div className="grid sm:grid-cols-2 gap-3">
                {selectedExam.subjects.length === 0 ? (
                  <div className="col-span-2 text-center p-8 text-ink-soft">
                    Subjects for {selectedExam.name} will appear here. You can add them later from your dashboard.
                  </div>
                ) : (
                  selectedExam.subjects.map(subj => {
                    const isSelected = data.subjects.includes(subj.id);
                    return (
                      <button
                        key={subj.id}
                        type="button"
                        onClick={() => toggleSubject(subj.id)}
                        className={cn(
                          'flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left',
                          isSelected
                            ? 'border-coral bg-coral/10'
                            : 'border-line bg-white hover:border-ink-mute/30'
                        )}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: subj.color }}
                        >
                          {subj.name.slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-navy">{subj.name}</div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-coral" />}
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {/* Step 4: Target score */}
            {step === 4 && (
              <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                  <div className="text-6xl font-black text-coral mb-2">{data.targetScore}</div>
                  <div className="text-ink-soft font-semibold">Target {selectedExam.maxScore === 9 ? 'band score' : 'score'}</div>
                </div>
                <input
                  type="range"
                  min={selectedExam.passingScore || Math.round(selectedExam.maxScore * 0.4)}
                  max={selectedExam.maxScore}
                  step={selectedExam.maxScore <= 10 ? 0.5 : 5}
                  value={data.targetScore}
                  onChange={e => update({ targetScore: Number(e.target.value) })}
                  className="w-full accent-coral h-2"
                />
                <div className="flex justify-between text-xs font-semibold text-ink-mute mt-2">
                  <span>Minimum pass</span>
                  <span>Maximum score</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-6">
                  {[
                    { label: 'Safe', pct: 0.6 },
                    { label: 'Good', pct: 0.72 },
                    { label: 'Excellent', pct: 0.88 },
                  ].map(preset => {
                    const value = selectedExam.maxScore <= 10 ? Math.round(selectedExam.maxScore * preset.pct * 2) / 2 : Math.round(selectedExam.maxScore * preset.pct);
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => update({ targetScore: value })}
                        className={cn(
                          'p-3 rounded-xl border-2 font-bold text-sm transition-all',
                          data.targetScore === value ? 'border-coral bg-coral/10 text-coral' : 'border-line hover:border-coral/50'
                        )}
                      >
                        {preset.label}
                        <div className="text-navy">{value}+</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 5: Confidence per subject */}
            {step === 5 && (
              <div className="space-y-4">
                {(data.subjects.length > 0 ? selectedExam.subjects.filter(s => data.subjects.includes(s.id)) : selectedExam.subjects.slice(0, 4)).map(subj => (
                  <div key={subj.id} className="p-4 rounded-2xl bg-cream">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-navy">{subj.name}</div>
                      <div className="text-sm font-black text-coral">
                        {data.confidence[subj.id] || 3}/5
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => update({ confidence: { ...data.confidence, [subj.id]: n } })}
                          className={cn(
                            'flex-1 py-2.5 rounded-xl font-bold text-sm transition-all',
                            (data.confidence[subj.id] || 3) >= n
                              ? 'bg-coral text-white'
                              : 'bg-white text-ink-mute border border-line hover:border-coral/50'
                          )}
                        >
                          {['😕', '😐', '🙂', '😊', '🤩'][n - 1]}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-ink-mute mt-1.5 px-1">
                      <span>Not confident</span>
                      <span>Very confident</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 6: Struggling topics */}
            {step === 6 && (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                <p className="text-sm text-ink-soft mb-2">Select any topics you already know give you trouble. This will help Idrak prioritize them.</p>
                {selectedExam.subjects.every(s => (s.topics || []).length === 0) && (
                  <div className="p-5 rounded-2xl bg-cream text-center">
                    <p className="text-sm font-semibold text-navy">No topic data is available for {selectedExam.shortName} yet.</p>
                    <p className="text-xs text-ink-soft mt-1">You can skip this step — Idrak will still build a plan from your subjects and confidence ratings.</p>
                  </div>
                )}
                {selectedExam.subjects.flatMap(s =>
                  (s.topics || []).map(t => {
                    const isSelected = data.strugglingTopics.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) update({ strugglingTopics: data.strugglingTopics.filter(x => x !== t.id) });
                          else update({ strugglingTopics: [...data.strugglingTopics, t.id] });
                        }}
                        className={cn(
                          'w-full flex items-center justify-between p-3.5 rounded-2xl border-2 text-left transition-all',
                          isSelected ? 'border-coral bg-coral/10' : 'border-line bg-white hover:border-ink-mute/30'
                        )}
                      >
                        <div>
                          <div className="font-bold text-navy text-sm">{t.name}</div>
                          <div className="text-xs text-ink-soft">{s.name}</div>
                        </div>
                        {isSelected ? <CheckCircle2 className="w-5 h-5 text-coral flex-shrink-0" /> : <div className="w-5 h-5 rounded-full border-2 border-line flex-shrink-0" />}
                      </button>
                    );
                  })
                )}
                {selectedExam.subjects.flatMap(s => s.topics || []).length === 0 && (
                  <div className="text-center p-8 text-ink-soft">
                    Topics will be available after you select your subjects. You can adjust this later from your dashboard.
                  </div>
                )}
              </div>
            )}

            {/* Step 7: Daily study time */}
            {step === 7 && (
              <div className="max-w-md mx-auto">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: 'Light', value: 20, emoji: '🌱' },
                    { label: 'Standard', value: 45, emoji: '📚' },
                    { label: 'Focused', value: 60, emoji: '🔥' },
                    { label: 'Intensive', value: 90, emoji: '⚡' },
                    { label: 'Dedicated', value: 120, emoji: '🎯' },
                    { label: 'Bootcamp', value: 180, emoji: '🚀' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update({ dailyMinutes: opt.value })}
                      className={cn(
                        'p-4 rounded-2xl border-2 text-center transition-all',
                        data.dailyMinutes === opt.value
                          ? 'border-coral bg-coral/10'
                          : 'border-line bg-white hover:border-ink-mute/30'
                      )}
                    >
                      <div className="text-2xl mb-1">{opt.emoji}</div>
                      <div className="font-black text-navy text-sm">{opt.value} min</div>
                      <div className="text-xs text-ink-soft">{opt.label}</div>
                    </button>
                  ))}
                </div>
                <div className="bg-cream rounded-2xl p-5 text-center">
                  <div className="text-sm font-bold text-navy">
                    With {data.dailyMinutes} minutes per day, Idrak will schedule
                  </div>
                  <div className="text-lg font-black text-coral mt-1">
                    ~{Math.round(data.dailyMinutes * 5.5 / 60)} hours of study per week
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-10 pt-6 border-t border-line">
              <Button
                variant="ghost"
                size="md"
                icon={ArrowLeft}
                onClick={back}
                disabled={step === 1}
              >
                Back
              </Button>
              <Button
                variant="coral"
                size="lg"
                iconRight={submitting ? Loader2 : step === STEPS.length ? CheckCircle2 : ArrowRight}
                loading={submitting}
                onClick={next}
                disabled={!canProceed()}
              >
                {step === STEPS.length ? 'Create my plan' : 'Continue'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
