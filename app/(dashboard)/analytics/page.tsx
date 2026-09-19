'use client';
import { useEffect, useState } from 'react';
import { Card, Badge, StatCard, Tabs, Progress } from '@/components/ui';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart,
  BarChart, Bar, Cell, PieChart, Pie, Legend, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { TrendingUp, Target, Clock, Flame, Calendar, Award, Activity, Brain, BarChart3 } from 'lucide-react';
import { EXAMS, getExamById } from '@/lib/data';
type AnalyticsData = { summary: { total_questions: number; correct_answers: number; incorrect_answers: number; accuracy: number; time_spent_seconds: number }; topics: { topic_id: string; questions_attempted: number; questions_correct: number; accuracy: number; topic_name?: string }[]; readinessScore: number | null; readinessLabel: string };

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [examShortName, setExamShortName] = useState('Idrak');
  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'include' })
      .then(r => r.json())
      .then(payload => { const examId = payload?.data?.user?.examId; if (examId) setExamShortName(getExamById(examId)?.shortName || EXAMS[0].shortName); })
      .catch(() => undefined);
  }, []);
  useEffect(() => {
    fetch('/api/analytics', { credentials: 'include' })
      .then(async (response) => { const payload = await response.json(); if (!response.ok) throw new Error(payload.error?.message || 'Unable to load analytics.'); return payload.data; })
      .then(setAnalytics)
      .catch((reason: Error) => setError(reason.message));
  }, []);
  const summary = analytics?.summary;
  const weakTopics = (analytics?.topics ?? []).filter((topic) => topic.accuracy < 60).slice(0, 5).map((topic) => ({ name: topic.topic_name || topic.topic_id, score: Number(topic.accuracy), weight: 0 }));
  const readinessCallout = weakTopics.length >= 2
    ? `Keep going — ${weakTopics[0].name} and ${weakTopics[1].name} are the biggest unlocks right now.`
    : weakTopics.length === 1
      ? `Keep going — ${weakTopics[0].name} is your biggest unlock right now.`
      : analytics?.summary?.total_questions
        ? "You're not showing any weak spots yet — keep practicing to sharpen your readiness score."
        : 'Answer a few questions to see your personalized readiness breakdown.';
  const radarData = (analytics?.topics ?? []).slice(0, 6).map((topic) => ({ subject: topic.topic_name || topic.topic_id, accuracy: Number(topic.accuracy), mastery: Number(topic.accuracy), fullMark: 100 }));
  const timePerTopic = (analytics?.topics ?? []).slice(0, 5).map((topic) => ({ name: topic.topic_name || topic.topic_id, minutes: 0, color: '#ff6b4a' }));
  const streakData: { day: number; active: number }[] = [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <Badge tone="coral" size="md" className="mb-3"><BarChart3 className="w-3.5 h-3.5" /> Performance analytics</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-navy">Your learning, visualized.</h1>
        <p className="text-ink-soft mt-1 max-w-2xl">Track your progress, identify trends, and see how close you are to your target.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard value={summary ? `${Number(summary.accuracy).toFixed(0)}%` : '—'} label="Overall accuracy" sublabel={error || 'Calculated from your attempts'} tone="coral" icon={Target} />
        <StatCard value={summary ? String(summary.total_questions) : '—'} label="Questions answered" sublabel="From persistent attempts" tone="lavender" icon={Activity} />
        <StatCard value={summary ? `${Math.round(summary.time_spent_seconds / 60)} min` : '—'} label="Total study time" sublabel="Recorded answer time" tone="yellow" icon={Clock} />
        <StatCard value={analytics?.readinessScore === null ? '—' : analytics ? `${analytics.readinessScore}%` : '—'} label={`${examShortName} readiness`} sublabel={analytics?.readinessLabel || 'Loading live data'} tone="mint" icon={Award} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Accuracy over time */}
        <Card padding="lg" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black text-navy">Accuracy trend</h3>
              <p className="text-sm text-ink-soft">Your accuracy over the last 7 weeks.</p>
            </div>
            <Badge tone="gray" size="sm"><TrendingUp className="w-3 h-3" /> Based on recorded attempts</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[]}>
                <defs>
                  <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6b4a" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#ff6b4a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fill: '#8a8aa0', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 90]} tick={{ fill: '#8a8aa0', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: '#0f0f23', border: 'none', borderRadius: 16, color: 'white', fontSize: 13, fontWeight: 600 }}
                  formatter={(value: any) => [`${value}%`, 'Accuracy']}
                />
                <Area type="monotone" dataKey="accuracy" stroke="#ff6b4a" strokeWidth={3} fill="url(#accGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Readiness gauge */}
        <Card padding="lg" className="bg-navy text-white">
          <h3 className="text-lg font-black mb-4">{examShortName} Readiness</h3>
          <div className="flex items-center justify-center mb-4">
            <svg viewBox="0 0 200 130" className="w-48">
              <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="14" strokeLinecap="round" />
              <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke="#ff6b4a" strokeWidth="14" strokeLinecap="round"
                strokeDasharray={Math.PI * 80}
                strokeDashoffset={Math.PI * 80 * (1 - (analytics?.readinessScore ?? 0) / 100)}
              />
              <text x="100" y="90" textAnchor="middle" fill="white" fontSize="38" fontWeight="900">{analytics?.readinessScore ?? '—'}%</text>
              <text x="100" y="112" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11" fontWeight="600">Ready</text>
            </svg>
          </div>
          <p className="text-sm text-white/70 text-center leading-relaxed">
            {readinessCallout}
          </p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subject radar */}
        <Card padding="lg">
          <h3 className="text-lg font-black text-navy mb-4">Subject mastery</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="#e8e4dd" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#2d2d3d', fontSize: 11, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#8a8aa0', fontSize: 10 }} axisLine={false} />
                <Radar name="Accuracy" dataKey="accuracy" stroke="#ff6b4a" fill="#ff6b4a" fillOpacity={0.3} strokeWidth={2} />
                <Radar name="Mastery" dataKey="mastery" stroke="#b8a4e8" fill="#b8a4e8" fillOpacity={0.2} strokeWidth={2} />
                <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} iconType="circle" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Time per topic */}
        <Card padding="lg">
          <h3 className="text-lg font-black text-navy mb-4">Where your time goes</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timePerTopic} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" tick={{ fill: '#8a8aa0', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#2d2d3d', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,107,74,0.08)' }}
                  contentStyle={{ background: '#0f0f23', border: 'none', borderRadius: 16, color: 'white', fontSize: 12, fontWeight: 600 }}
                  formatter={(v: any) => [`${v} min`, 'Time spent']}
                />
                <Bar dataKey="minutes" radius={[0, 8, 8, 0]}>
                  {timePerTopic.map((t, i) => <Cell key={i} fill={t.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Weak areas & streak */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card padding="lg" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black text-navy">High-weight weak topics</h3>
              <p className="text-sm text-ink-soft">These are holding back your score the most.</p>
            </div>
            <Brain className="w-5 h-5 text-coral" />
          </div>
          <div className="space-y-3">
            {weakTopics.map(t => (
              <div key={t.name} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-navy text-sm truncate">{t.name}</span>
                    <span className="text-xs font-black text-coral flex-shrink-0 ml-2">{t.score}% · weight {t.weight}%</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex-[3]"><Progress value={t.score} tone="coral" size="sm" /></div>
                    <div className="flex-[2]"><Progress value={t.weight} tone="lavender" size="sm" /></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg" className="bg-coral/10 border-coral/20">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-coral" />
            <h3 className="text-lg font-black text-navy">Study consistency</h3>
          </div>
          <div className="grid grid-cols-7 gap-1.5 mb-4">
            {streakData.map((d, i) => (
              <div
                key={i}
                className="aspect-square rounded-md"
                style={{
                  backgroundColor: d.active === 0 ? '#f5f0e8' :
                    d.active < 20 ? '#ffd4c8' :
                    d.active < 40 ? '#ffab95' :
                    '#ff6b4a'
                }}
                title={`${d.active} min`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-ink-soft">
            <span>35 days ago</span>
            <span>Today</span>
          </div>
          <div className="mt-4 p-3 rounded-xl bg-white text-center">
            <div className="text-2xl font-black text-coral">7 days</div>
            <div className="text-xs font-bold text-ink-soft">Current streak · Personal best: 12 days</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
