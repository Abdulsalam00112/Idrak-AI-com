'use client';
import { Card, Badge, EmptyState } from '@/components/ui';
import { Bell, Flame, Target, Award, Megaphone, Sparkles, Calendar, Check, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const NOTIFS = [
  { id: 1, type: 'streak', title: '7-day streak! 🔥', body: 'You\'ve studied 7 days in a row. Keep it going to beat your record of 12.', time: '2 hours ago', unread: true, icon: Flame, tone: 'coral' },
  { id: 2, type: 'priority', title: 'Algebra is waiting', body: 'Your highest-priority topic (Algebra, 88% exam weight) is due today. 30 minutes will move your score.', time: '5 hours ago', unread: true, icon: Target, tone: 'yellow' },
  { id: 3, type: 'milestone', title: 'New accuracy milestone', body: 'You hit 74% average accuracy across all topics — up from 52% when you started.', time: 'Yesterday', unread: false, icon: Award, tone: 'mint' },
  { id: 4, type: 'countdown', title: '47 days until JAMB', body: 'You\'re on track for a 278 based on recent mocks. Keep focusing on critical topics.', time: '2 days ago', unread: false, icon: Calendar, tone: 'lavender' },
  { id: 5, type: 'announcement', title: 'New: Professional ICAN mode', body: 'We launched reasoning-first exam mode for ICAN and CITN students. Try it in your exam settings.', time: '3 days ago', unread: false, icon: Megaphone, tone: 'ink' },
  { id: 6, type: 'info', title: 'New questions added', body: '280 new Physics questions added from 2023-2025 past papers, including 40 electricity problems.', time: '5 days ago', unread: false, icon: Sparkles, tone: 'coral' },
];

const toneStyles: Record<string, string> = {
  coral: 'bg-coral/15 text-coral',
  yellow: 'bg-yellow/30 text-yellow-700',
  mint: 'bg-mint-soft text-teal-700',
  lavender: 'bg-lavender-light text-lavender-deep',
  ink: 'bg-ink/10 text-ink',
};

export default function NotificationsPage() {
  const [items, setItems] = useState(NOTIFS);
  const unreadCount = items.filter(i => i.unread).length;

  const markAllRead = () => setItems(items.map(i => ({ ...i, unread: false })));

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-black text-navy">Notifications</h1>
            {unreadCount > 0 && <Badge tone="coral" size="md">{unreadCount} new</Badge>}
          </div>
          <p className="text-ink-soft">Stay on top of your progress, reminders, and updates.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm font-bold text-coral hover:underline">
            Mark all read
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <Card padding="xl">
          <EmptyState
            icon={Bell}
            title="You're all caught up"
            description="When there's something new — a streak, a reminder, or a new recommendation — it'll show up here."
          />
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map(n => {
            const Icon = n.icon;
            return (
              <Card key={n.id} padding="md" className={cn(
                'flex items-start gap-4 transition',
                n.unread && 'ring-2 ring-coral/20 bg-coral/5 border-coral/20'
              )}>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', toneStyles[n.tone])}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-navy text-sm">{n.title}</div>
                      <div className="text-sm text-ink-soft mt-0.5 leading-relaxed">{n.body}</div>
                    </div>
                  </div>
                  <div className="text-xs text-ink-mute font-bold mt-2">{n.time}</div>
                </div>
                {n.unread && <div className="w-2 h-2 rounded-full bg-coral mt-2 flex-shrink-0" />}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
