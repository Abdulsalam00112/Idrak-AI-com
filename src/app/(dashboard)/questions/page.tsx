'use client';
import { useState } from 'react';
import { Search, Filter, Bookmark, Clock, CheckCircle, ChevronRight, SortAsc, Eye } from 'lucide-react';
import { Card, Button, Badge, Input, Tabs } from '@/components/ui';
import { BookMarked, Bookmark as BookmarkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const FILTER_TABS = [
  { id: 'all', label: 'All questions', count: 12480 },
  { id: 'attempted', label: 'Attempted', count: 1247 },
  { id: 'incorrect', label: 'Incorrect', count: 312 },
  { id: 'bookmarked', label: 'Bookmarked', count: 24 },
  { id: 'saved', label: 'Saved', count: 8 },
];

const SUBJECT_FILTERS = ['All subjects', 'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology'];

const QUESTIONS = Array.from({ length: 14 }, (_, i) => ({
  id: `q-${i}`,
  text: [
    'If x² − 5x + 6 = 0, what are the values of x?',
    'A car accelerates uniformly from rest at 4 m/s² for 10 seconds. Calculate the final velocity.',
    'Which of the following is an example of an alkanoic acid?',
    'Solve the simultaneous equations: 2x + 3y = 13 and 4x − y = 5.',
    'What is the probability of drawing a red king from a standard deck of 52 cards?',
    'The mitochondrion is primarily responsible for which cellular process?',
  ][i % 6],
  subject: ['Mathematics', 'Physics', 'Chemistry', 'Mathematics', 'Mathematics', 'Biology'][i % 6],
  topic: ['Algebra', 'Mechanics', 'Organic', 'Algebra', 'Probability', 'Physiology'][i % 6],
  year: 2020 + (i % 6),
  difficulty: (['easy', 'medium', 'hard', 'medium', 'easy', 'hard'][i % 6] as 'easy' | 'medium' | 'hard'),
  status: i % 3 === 0 ? 'correct' : i % 3 === 1 ? 'incorrect' : 'untried',
  bookmarked: i % 4 === 0,
  timesAsked: Math.floor(Math.random() * 500) + 50,
}));

export default function QuestionsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [subject, setSubject] = useState('All subjects');
  const [query, setQuery] = useState('');

  const difficultyTone: Record<string, 'mint' | 'yellow' | 'coral'> = { easy: 'mint', medium: 'yellow', hard: 'coral' };

  let filtered = QUESTIONS;
  if (activeTab === 'attempted') filtered = filtered.filter(q => q.status !== 'untried');
  if (activeTab === 'incorrect') filtered = filtered.filter(q => q.status === 'incorrect');
  if (activeTab === 'bookmarked') filtered = filtered.filter(q => q.bookmarked);
  if (subject !== 'All subjects') filtered = filtered.filter(q => q.subject === subject);
  if (query) filtered = filtered.filter(q => q.text.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <Badge tone="lavender" size="md" className="mb-3"><BookMarked className="w-3.5 h-3.5" /> Question Bank</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-navy">Every question, organized.</h1>
        <p className="text-ink-soft mt-1">Browse, search, filter and bookmark thousands of past questions with explanations.</p>
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
            {SUBJECT_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setSubject(s)}
                className={cn(
                  'px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition',
                  subject === s ? 'bg-navy text-white' : 'bg-cream-dark text-ink-soft hover:bg-line'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Tabs tabs={FILTER_TABS} activeId={activeTab} onChange={setActiveTab} />

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card padding="xl" className="text-center">
            <div className="w-16 h-16 rounded-full bg-lavender-light flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-lavender-deep" />
            </div>
            <h3 className="font-black text-navy text-lg mb-1">No questions found</h3>
            <p className="text-ink-soft text-sm">Try adjusting your filters or search terms.</p>
          </Card>
        ) : (
          filtered.map(q => (
            <Card key={q.id} padding="md" hoverable className="group">
              <div className="flex items-start gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  q.status === 'correct' && 'bg-teal-50 text-teal-600',
                  q.status === 'incorrect' && 'bg-coral/10 text-coral',
                  q.status === 'untried' && 'bg-cream-dark text-ink-mute'
                )}>
                  {q.status === 'correct' ? <CheckCircle className="w-5 h-5" /> :
                   q.status === 'incorrect' ? <Clock className="w-5 h-5" /> :
                   <Eye className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <Badge tone="ink" size="sm">{q.subject}</Badge>
                    <Badge tone="gray" size="sm">{q.topic}</Badge>
                    <Badge tone={difficultyTone[q.difficulty]} size="sm">{q.difficulty}</Badge>
                    <span className="text-xs font-bold text-ink-mute">JAMB {q.year}</span>
                  </div>
                  <h3 className="font-bold text-navy leading-snug group-hover:text-coral transition mb-0">{q.text}</h3>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className={cn(
                    'p-2.5 rounded-xl transition',
                    q.bookmarked ? 'bg-yellow text-navy' : 'bg-cream-dark text-ink-mute hover:text-navy'
                  )}>
                    {q.bookmarked ? <BookmarkIcon className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                  <Button variant="coral" size="sm" iconRight={ChevronRight}>Practice</Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
