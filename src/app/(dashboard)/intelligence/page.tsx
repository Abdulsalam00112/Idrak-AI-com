'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Minus, Filter, ArrowRight, Sparkles,
  CalendarDays, Target, Zap, BarChart, Brain, ChevronRight
} from 'lucide-react';
import { Card, Badge, Button, Tabs, Progress } from '@/components/ui';
import { TOPIC_INTELLIGENCE, WEEKLY_PLAN } from '@/lib/data';
import { cn } from '@/lib/utils';

const TrendIcon = (trend: string) => {
  if (trend === 'improving' || trend === 'strong') return TrendingUp;
  if (trend === 'declining') return TrendingDown;
  return Minus;
};

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState('map');
  const [sortBy, setSortBy] = useState<'priority' | 'weight' | 'weakness'>('priority');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  const subjects = ['all', ...Array.from(new Set(TOPIC_INTELLIGENCE.map(t => t.subject)))];

  let topics = [...TOPIC_INTELLIGENCE];
  if (subjectFilter !== 'all') topics = topics.filter(t => t.subject === subjectFilter);

  if (sortBy === 'weight') topics.sort((a, b) => b.examWeight - a.examWeight);
  else if (sortBy === 'weakness') topics.sort((a, b) => a.performance - b.performance);
  else topics.sort((a, b) => {
    const order = { critical: 0, high: 1, maintain: 2, medium: 3 };
    return (order[a.priority as keyof typeof order] || 5) - (order[b.priority as keyof typeof order] || 5);
  });

  const criticalTopics = TOPIC_INTELLIGENCE.filter(t => t.priority === 'critical');
  const highWeightWeak = TOPIC_INTELLIGENCE.filter(t => t.examWeight >= 70 && t.performance < 60);
  const masteredTopics = TOPIC_INTELLIGENCE.filter(t => t.priority === 'maintain');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge tone="coral" size="md"><Brain className="w-3.5 h-3.5" /> Learning Intelligence</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">Topic Intelligence Map</h1>
        <p className="text-ink-soft mt-1 max-w-2xl">
          Idrak analyzes years of past questions, cross-references them with your performance, and shows you exactly where to focus.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" className="bg-coral/10 border-coral/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-coral flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
            <div>
              <div className="text-2xl font-black text-navy">{criticalTopics.length}</div>
              <div className="text-sm text-ink-soft font-semibold">Critical topics</div>
            </div>
          </div>
        </Card>
        <Card padding="md" className="bg-yellow/20 border-yellow/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow flex items-center justify-center"><Target className="w-5 h-5 text-navy" /></div>
            <div>
              <div className="text-2xl font-black text-navy">{highWeightWeak.length}</div>
              <div className="text-sm text-ink-soft font-semibold">High-weight weak</div>
            </div>
          </div>
        </Card>
        <Card padding="md" className="bg-lavender-light">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-lavender-deep flex items-center justify-center"><TrendingUp className="w-5 h-5 text-white" /></div>
            <div>
              <div className="text-2xl font-black text-navy">{TOPIC_INTELLIGENCE.filter(t => t.trend === 'improving').length}</div>
              <div className="text-sm text-ink-soft font-semibold">Improving</div>
            </div>
          </div>
        </Card>
        <Card padding="md" className="bg-mint-soft">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center"><BarChart className="w-5 h-5 text-white" /></div>
            <div>
              <div className="text-2xl font-black text-navy">{masteredTopics.length}</div>
              <div className="text-sm text-ink-soft font-semibold">Mastered</div>
            </div>
          </div>
        </Card>
      </div>

      <Tabs
        tabs={[
          { id: 'map', label: 'Intelligence Map' },
          { id: 'plan', label: 'Study Plan' },
        ]}
        activeId={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'map' && (
        <>
          {/* Filters */}
          <Card padding="md" className="bg-white">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-center gap-2 flex-1 flex-wrap">
                <Filter className="w-4 h-4 text-ink-mute" />
                <span className="text-sm font-bold text-navy mr-1">Filter:</span>
                {subjects.map(s => (
                  <button
                    key={s}
                    onClick={() => setSubjectFilter(s)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-bold transition-all',
                      subjectFilter === s ? 'bg-navy text-white' : 'bg-cream-dark text-ink-soft hover:bg-line'
                    )}
                  >
                    {s === 'all' ? 'All subjects' : s}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-navy">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="bg-cream-dark rounded-xl px-3 py-2 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-coral"
                >
                  <option value="priority">Priority</option>
                  <option value="weight">Exam weight</option>
                  <option value="weakness">Weakest first</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Topic cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {topics.map(t => {
              const Trend = TrendIcon(t.trend);
              const priorityTone: Record<string, 'coral' | 'yellow' | 'mint' | 'gray'> = {
                critical: 'coral', high: 'yellow', maintain: 'mint', medium: 'gray'
              };
              const bgTone: Record<string, string> = {
                critical: 'bg-coral/10 border-coral/30',
                high: 'bg-yellow/15 border-yellow/40',
                maintain: 'bg-mint-soft border-mint/40',
                medium: 'bg-white border-line',
              };
              return (
                <Card key={t.topicId} padding="lg" className={bgTone[t.priority]}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge tone={priorityTone[t.priority]} size="sm" dot>
                          {t.priority === 'critical' ? 'Critical' : t.priority === 'high' ? 'High priority' : t.priority === 'maintain' ? 'Maintaining' : 'Medium'}
                        </Badge>
                        <span className="text-xs font-bold text-ink-mute">{t.subject}</span>
                      </div>
                      <h3 className="text-lg font-black text-navy">{t.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold" title={`Trend: ${t.trend}`}>
                      <Trend className={cn(
                        'w-4 h-4',
                        t.trend === 'improving' || t.trend === 'strong' ? 'text-teal-600' :
                        t.trend === 'declining' ? 'text-coral' : 'text-ink-mute'
                      )} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-bold text-ink-mute uppercase tracking-wider">Exam weight</span>
                        <span className="text-sm font-black text-navy">{t.examWeight}%</span>
                      </div>
                      <Progress value={t.examWeight} tone="lavender" size="sm" />
                    </div>
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-bold text-ink-mute uppercase tracking-wider">Your mastery</span>
                        <span className={cn(
                          'text-sm font-black',
                          t.performance < 55 ? 'text-coral' : t.performance < 75 ? 'text-yellow-700' : 'text-teal-600'
                        )}>{t.performance}%</span>
                      </div>
                      <Progress value={t.performance} tone={t.performance < 55 ? 'coral' : t.performance < 75 ? 'yellow' : 'mint'} size="sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-line/50">
                    <div className="flex items-center gap-3 text-xs text-ink-soft">
                      <span><strong className="text-navy">{t.questionsAnswered}</strong> questions</span>
                      <span>•</span>
                      <span><strong className="text-navy">{t.subtopics}</strong> subtopics</span>
                    </div>
                    <Link href={`/practice?topic=${t.topicId}`}>
                      <Button variant="dark" size="sm" iconRight={ArrowRight}>Practice</Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'plan' && (
        <div className="space-y-6">
          <Card padding="lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-black text-navy">This week's adaptive plan</h3>
                <p className="text-sm text-ink-soft">Idrak adjusts this plan daily based on your performance.</p>
              </div>
              <Badge tone="coral" size="md"><Sparkles className="w-3 h-3" /> Live</Badge>
            </div>
            <div className="grid md:grid-cols-7 gap-3">
              {WEEKLY_PLAN.map((day, i) => (
                <div key={day.day} className={cn(
                  'rounded-2xl p-4',
                  i === 0 ? 'bg-coral/10 border-2 border-coral/30' : 'bg-cream-dark'
                )}>
                  <div className="text-xs font-black text-ink-mute uppercase tracking-wider mb-3">{day.day}</div>
                  <div className="space-y-2">
                    {day.items.map((item, j) => (
                      <div key={j} className="bg-white rounded-xl p-2.5 card-shadow">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-navy leading-tight">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-ink-mute">
                          <span>{item.subject}</span>
                          <span>•</span>
                          <span>{item.duration}m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card padding="lg" tone="lavender">
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays className="w-5 h-5 text-lavender-deep" />
                <h3 className="text-lg font-black text-navy">Plan methodology</h3>
              </div>
              <p className="text-sm text-ink-soft leading-relaxed">
                Idrak uses <strong>spaced repetition</strong>, <strong>interleaving</strong>, and
                <strong> priority scoring</strong> to order your study sessions. Topics with
                high exam weight and low performance get scheduled first. Topics you've mastered
                are revisited at increasing intervals to keep them fresh.
              </p>
            </Card>
            <Card padding="lg" tone="yellow">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-yellow-700" />
                <h3 className="text-lg font-black text-navy">Adaptive reordering</h3>
              </div>
              <p className="text-sm text-ink-soft leading-relaxed">
                If you score 80%+ on a topic, Idrak reduces its priority and moves time to weaker areas.
                If you score below 50% on a high-weight topic, it gets rescheduled within 48 hours for
                review — not two weeks later.
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
