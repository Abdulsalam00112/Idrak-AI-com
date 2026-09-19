'use client';
import { Card, Badge, StatCard, Tabs, Progress } from '@/components/ui';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart,
  BarChart, Bar, Cell, PieChart, Pie, Legend, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { TrendingUp, Target, Clock, Flame, Calendar, Award, Activity, Brain, BarChart3 } from 'lucide-react';
import { ACCURACY_OVER_TIME, SUBJECT_PERFORMANCE, TOPIC_INTELLIGENCE } from '@/lib/data';

export default function AnalyticsPage() {
  const weakTopics = TOPIC_INTELLIGENCE.filter(t => t.priority === 'critical').map(t => ({
    subject: 'Analysis',
    name: t.name,
    score: t.performance,
    weight: t.examWeight,
  }));

  const radarData = SUBJECT_PERFORMANCE.map(s => ({
    subject: s.subject,
    accuracy: s.accuracy,
    mastery: s.mastery,
    fullMark: 100,
  }));

  const timePerTopic = [
    { name: 'Algebra', minutes: 420, color: '#ff6b4a' },
    { name: 'Physics Mech.', minutes: 320, color: '#4ecdc4' },
    { name: 'English Comp.', minutes: 280, color: '#b8a4e8' },
    { name: 'Chemistry', minutes: 260, color: '#ffd93d' },
    { name: 'Biology', minutes: 310, color: '#8b6fc0' },
  ];

  const streakData = Array.from({ length: 35 }, (_, i) => ({
    day: i + 1,
    active: Math.random() > 0.25 ? Math.floor(Math.random() * 60) + 10 : 0,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <Badge tone="coral" size="md" className="mb-3"><BarChart3 className="w-3.5 h-3.5" /> Performance analytics</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-navy">Your learning, visualized.</h1>
        <p className="text-ink-soft mt-1 max-w-2xl">Track your progress, identify trends, and see how close you are to your target.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard value="74%" label="Overall accuracy" sublabel="+4% this week" tone="coral" icon={Target} />
        <StatCard value="1,247" label="Questions answered" tone="lavender" icon={Activity} />
        <StatCard value="70.5h" label="Total study time" sublabel="7-day streak" tone="yellow" icon={Clock} />
        <StatCard value="72%" label="JAMB readiness" sublabel="Est. score: 278" tone="mint" icon={Award} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Accuracy over time */}
        <Card padding="lg" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black text-navy">Accuracy trend</h3>
              <p className="text-sm text-ink-soft">Your accuracy over the last 7 weeks.</p>
            </div>
            <Badge tone="mint" size="sm"><TrendingUp className="w-3 h-3" /> +22% since W1</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ACCURACY_OVER_TIME}>
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
          <h3 className="text-lg font-black mb-4">JAMB Readiness</h3>
          <div className="flex items-center justify-center mb-4">
            <svg viewBox="0 0 200 130" className="w-48">
              <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="14" strokeLinecap="round" />
              <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke="#ff6b4a" strokeWidth="14" strokeLinecap="round"
                strokeDasharray={Math.PI * 80}
                strokeDashoffset={Math.PI * 80 * (1 - 0.72)}
              />
              <text x="100" y="90" textAnchor="middle" fill="white" fontSize="38" fontWeight="900">72%</text>
              <text x="100" y="112" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11" fontWeight="600">Ready</text>
            </svg>
          </div>
          <p className="text-sm text-white/70 text-center leading-relaxed">
            Keep going — Algebra and Human Physiology are the biggest unlocks right now.
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
