'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Bookmark, Clock, CheckCircle, ChevronRight, Eye } from 'lucide-react';
import { Card, Button, Badge, Tabs } from '@/components/ui';
import { BookMarked, Bookmark as BookmarkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EXAMS, getExamById, type ExamSeed } from '@/lib/data';

type QuestionRecord = {
  id: string;
  question_text: string;
  subject_name: string | null;
  topic_id: string | null;
  topic_name: string | null;
  difficulty: 'easy' | 'medium' | 'hard' | 'challenging';
  year?: number;
  bookmarked: boolean;
  last_attempt_correct: boolean | null;
  content_type?: 'real' | 'generated' | 'demo' | 'unknown';
  source_reference?: string | null;
};

function provenanceLabel(q: Pick<QuestionRecord, 'content_type' | 'source_reference'>): string | null {
  if (q.content_type === 'real' && q.source_reference) return q.source_reference;
  if (q.content_type === 'generated') return 'Idrak-generated';
  if (q.content_type === 'demo') return 'Demo question';
  return null;
}

export default function QuestionsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [topicFilter, setTopicFilter] = useState('All topics');
  const [query, setQuery] = useState('');
  const [questions, setQuestions] = useState<QuestionRecord[]>([]);
  const [exam, setExam] = useState<ExamSeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingBookmark, setPendingBookmark] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'include' })
      .then((r) => r.json())
      .then((payload) => { const examId = payload?.data?.user?.examId; if (examId) setExam(getExamById(examId) ?? null); })
      .catch(() => undefined);
  }, []);

  const load = () => {
    setLoading(true);
    fetch('/api/questions?limit=100', { credentials: 'include' })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error?.message || 'Unable to load questions.');
        return payload.data?.questions ?? [];
      })
      .then((rows: QuestionRecord[]) => { setQuestions(rows); setError(null); })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const activeExam = exam ?? EXAMS[0];
  const topics = useMemo(() => ['All topics', ...Array.from(new Set(questions.map(q => q.topic_name).filter(Boolean) as string[]))], [questions]);

  const FILTER_TABS = [
    { id: 'all', label: 'All questions', count: questions.length },
    { id: 'attempted', label: 'Attempted', count: questions.filter(q => q.last_attempt_correct !== null).length },
    { id: 'incorrect', label: 'Incorrect', count: questions.filter(q => q.last_attempt_correct === false).length },
    { id: 'bookmarked', label: 'Bookmarked', count: questions.filter(q => q.bookmarked).length },
  ];

  const difficultyTone: Record<string, 'mint' | 'yellow' | 'coral'> = { easy: 'mint', medium: 'yellow', hard: 'coral', challenging: 'coral' };

  let filtered = questions;
  if (activeTab === 'attempted') filtered = filtered.filter(q => q.last_attempt_correct !== null);
  if (activeTab === 'incorrect') filtered = filtered.filter(q => q.last_attempt_correct === false);
  if (activeTab === 'bookmarked') filtered = filtered.filter(q => q.bookmarked);
  if (topicFilter !== 'All topics') filtered = filtered.filter(q => q.topic_name === topicFilter);
  if (query) filtered = filtered.filter(q => q.question_text.toLowerCase().includes(query.toLowerCase()));

  const toggleBookmark = async (q: QuestionRecord) => {
    setPendingBookmark(q.id);
    const next = !q.bookmarked;
    setQuestions(prev => prev.map(row => row.id === q.id ? { ...row, bookmarked: next } : row));
    try {
      const response = await fetch(`/api/questions/${q.id}/bookmark`, { method: next ? 'POST' : 'DELETE', credentials: 'include' });
      if (!response.ok) throw new Error('failed');
    } catch {
      setQuestions(prev => prev.map(row => row.id === q.id ? { ...row, bookmarked: !next } : row));
    } finally {
      setPendingBookmark(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <Badge tone="lavender" size="md"><BookMarked className="w-3.5 h-3.5" /> Question Bank · {activeExam.shortName}</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-navy mt-3">Every question, organized.</h1>
        <p className="text-ink-soft mt-1">Browse, search, filter and bookmark {activeExam.shortName} questions with explanations.</p>
      </div>

      <Card padding="md">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-mute" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search questions, topics, keywords…"
              className="w-full pl-11 pr-4 py-3 bg-cream-dark rounded-2xl text-sm font-medium text-navy placeholder:text-ink-mute focus:outline-none focus:bg-white focus:ring-2 focus:ring-coral"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {topics.map(t => (
              <button
                key={t}
                onClick={() => setTopicFilter(t)}
                className={cn(
                  'px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition',
                  topicFilter === t ? 'bg-navy text-white' : 'bg-cream-dark text-ink-soft hover:bg-line'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Tabs tabs={FILTER_TABS} activeId={activeTab} onChange={setActiveTab} />

      <div className="space-y-3">
        {loading ? (
          <Card padding="xl" className="text-center"><p className="text-ink-soft">Loading questions…</p></Card>
        ) : error ? (
          <Card padding="xl" className="text-center"><p className="text-ink-soft">{error}</p></Card>
        ) : filtered.length === 0 ? (
          <Card padding="xl" className="text-center">
            <div className="w-16 h-16 rounded-full bg-lavender-light flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-lavender-deep" />
            </div>
            <h3 className="font-black text-navy text-lg mb-1">No questions found</h3>
            <p className="text-ink-soft text-sm">
              {questions.length === 0
                ? `No ${activeExam.shortName} questions are loaded yet — check back once content has been added.`
                : 'Try adjusting your filters or search terms.'}
            </p>
          </Card>
        ) : (
          filtered.map(q => (
            <Card key={q.id} padding="md" hoverable className="group">
              <div className="flex items-start gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  q.last_attempt_correct === true && 'bg-teal-50 text-teal-600',
                  q.last_attempt_correct === false && 'bg-coral/10 text-coral',
                  q.last_attempt_correct === null && 'bg-cream-dark text-ink-mute'
                )}>
                  {q.last_attempt_correct === true ? <CheckCircle className="w-5 h-5" /> :
                   q.last_attempt_correct === false ? <Clock className="w-5 h-5" /> :
                   <Eye className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {q.subject_name && <Badge tone="ink" size="sm">{q.subject_name}</Badge>}
                    {q.topic_name && <Badge tone="gray" size="sm">{q.topic_name}</Badge>}
                    <Badge tone={difficultyTone[q.difficulty]} size="sm">{q.difficulty}</Badge>
                    {q.year && <span className="text-xs font-bold text-ink-mute">{activeExam.shortName} {q.year}</span>}
                    {provenanceLabel(q) && <Badge tone="gray" size="sm">{provenanceLabel(q)}</Badge>}
                  </div>
                  <h3 className="font-bold text-navy leading-snug group-hover:text-coral transition mb-0">{q.question_text}</h3>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    disabled={pendingBookmark === q.id}
                    onClick={() => toggleBookmark(q)}
                    className={cn(
                      'p-2.5 rounded-xl transition',
                      q.bookmarked ? 'bg-yellow text-navy' : 'bg-cream-dark text-ink-mute hover:text-navy'
                    )}
                  >
                    {q.bookmarked ? <BookmarkIcon className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                  <Link href={q.topic_id ? `/practice?topicId=${q.topic_id}` : '/practice'}>
                    <Button variant="coral" size="sm" iconRight={ChevronRight}>Practice</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
