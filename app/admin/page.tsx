'use client';
import { Card, Badge, Button, StatCard, Tabs } from '@/components/ui';
import {
  Shield, Users, BookOpen, CreditCard, Activity, TrendingUp,
  DollarSign, FileQuestion, MessageCircle, AlertCircle, Search,
  Eye, CheckCircle, Ban, Plus, Download, BarChart3, LineChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const GROWTH_DATA = [
  { month: 'Sep', users: 1200, revenue: 450000 },
  { month: 'Oct', users: 1850, revenue: 720000 },
  { month: 'Nov', users: 2340, revenue: 980000 },
  { month: 'Dec', users: 2890, revenue: 1240000 },
  { month: 'Jan', users: 3420, revenue: 1580000 },
  { month: 'Feb', users: 4100, revenue: 1920000 },
  { month: 'Mar', users: 4850, revenue: 2340000 },
];

const RECENT_USERS = [
  { name: 'Chidinma Obi', email: 'chidimma@example.com', exam: 'JAMB', status: 'active', date: 'Today' },
  { name: 'Ibrahim Musa', email: 'ibrahim@example.com', exam: 'WAEC', status: 'active', date: 'Today' },
  { name: 'Fatima Yusuf', email: 'fatima@example.com', exam: 'ICAN', status: 'pending', date: 'Yesterday' },
  { name: 'Emeka Nwosu', email: 'emeka@example.com', exam: 'JAMB', status: 'active', date: 'Yesterday' },
  { name: 'Grace Adeyemi', email: 'grace@example.com', exam: 'SAT', status: 'paid', date: '2 days ago' },
];

const CONTENT_STATS = [
  { label: 'Exams published', value: '8', icon: BookOpen },
  { label: 'Total questions', value: '45,420', icon: FileQuestion },
  { label: 'Pending review', value: '124', icon: AlertCircle },
];

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Badge tone="navy" size="md" className="mb-2 bg-navy text-white"><Shield className="w-3.5 h-3.5" /> Super Admin</Badge>
          <h1 className="text-3xl font-black text-navy">Platform administration</h1>
          <p className="text-ink-soft">Users, content, pricing, and analytics across all of Idrak.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={Download} disabled title="Bulk export isn't implemented yet.">Export</Button>
          <Button variant="coral" size="sm" icon={Plus} disabled title="Use the question import pipeline (db/seed/questions) to add content — there's no in-app content editor yet.">Add content</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard value="—" label="Total users" sublabel="Connect live analytics" tone="coral" icon={Users} />
        <StatCard value="—" label="Revenue (MTD)" sublabel="Connect Stripe reporting" tone="lavender" icon={DollarSign} />
        <StatCard value="—" label="Questions in bank" sublabel="Live catalog pending" tone="yellow" icon={FileQuestion} />
        <StatCard value="—" label="Retention" sublabel="Not enough data yet" tone="mint" icon={TrendingUp} />
      </div>

      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'content', label: 'Content', icon: BookOpen },
          { id: 'revenue', label: 'Revenue', icon: CreditCard },
          { id: 'ai', label: 'AI Usage', icon: MessageCircle },
        ]}
        activeId="overview"
        onChange={() => {}}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card padding="lg" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-navy text-lg">User growth</h3>
            <Badge tone="mint" size="sm"><TrendingUp className="w-3 h-3" /> +18% this month</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GROWTH_DATA}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6b4a" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ff6b4a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#8a8aa0', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8a8aa0', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f0f23', border: 'none', borderRadius: 16, color: 'white', fontSize: 12 }} />
                <Area type="monotone" dataKey="users" stroke="#ff6b4a" strokeWidth={3} fill="url(#userGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="font-black text-navy text-lg mb-4">Content stats</h3>
          <div className="space-y-3">
            {CONTENT_STATS.map(s => (
              <div key={s.label} className="flex items-center gap-3 p-3 rounded-2xl bg-cream-dark/50">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-coral">
                  <s.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-black text-navy text-lg leading-none">{s.value}</div>
                  <div className="text-xs text-ink-soft font-semibold mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-navy text-lg">Recent signups</h3>
          <Button variant="ghost" size="sm" disabled title="A full user directory isn't implemented yet.">View all users</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-black uppercase text-ink-mute tracking-wider border-b border-line">
                <th className="pb-3">User</th>
                <th className="pb-3">Exam</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Joined</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_USERS.map((u, i) => (
                <tr key={i} className="border-b border-line/60 last:border-0">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-coral flex items-center justify-center text-white font-bold text-xs">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-navy">{u.name}</div>
                        <div className="text-xs text-ink-mute">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-semibold text-ink-soft">{u.exam}</td>
                  <td className="py-3">
                    <Badge tone={u.status === 'active' ? 'mint' : u.status === 'paid' ? 'lavender' : 'yellow'} size="sm" dot>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-ink-soft font-semibold text-xs">{u.date}</td>
                  <td className="py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button className="p-2 rounded-lg hover:bg-cream-dark text-ink-soft"><Eye className="w-4 h-4" /></button>
                      {u.status !== 'banned' ? (
                        <button className="p-2 rounded-lg hover:bg-cream-dark text-coral"><Ban className="w-4 h-4" /></button>
                      ) : (
                        <button className="p-2 rounded-lg hover:bg-cream-dark text-teal-600"><CheckCircle className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card padding="lg">
          <h3 className="font-black text-navy text-lg mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-coral" /> AI Tutor usage
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Conversations today', value: '2,847' },
              { label: 'Total messages', value: '42,301' },
              { label: 'Avg hints per question', value: '2.3' },
              { label: 'Concepts mastered', value: '612' },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between py-2 border-b border-line/50 last:border-0">
                <span className="text-sm font-semibold text-ink-soft">{r.label}</span>
                <span className="font-black text-navy">{r.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="font-black text-navy text-lg mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-lavender-deep" /> Exam popularity
          </h3>
          <div className="space-y-3">
            {[
              { name: 'JAMB', pct: 58, color: '#ff6b4a' },
              { name: 'WAEC', pct: 24, color: '#b8a4e8' },
              { name: 'Post-UTME', pct: 9, color: '#ffd93d' },
              { name: 'ICAN', pct: 5, color: '#4ecdc4' },
              { name: 'SAT / IELTS / Others', pct: 4, color: '#8a8aa0' },
            ].map(e => (
              <div key={e.name}>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-navy">{e.name}</span>
                  <span className="text-ink-mute">{e.pct}%</span>
                </div>
                <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${e.pct}%`, backgroundColor: e.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
