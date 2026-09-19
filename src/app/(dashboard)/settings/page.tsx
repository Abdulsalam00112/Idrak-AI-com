'use client';
import { Card, Button, Input, Badge, Tabs } from '@/components/ui';
import { User, Bell, Lock, CreditCard, Palette, Shield, BookOpen, LogOut, Check } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [tab, setTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true, push: true, reminders: true, streak: true, performance: true, announcements: false,
  });

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-coral' : 'bg-line'}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-navy">Settings</h1>
        <p className="text-ink-soft mt-1">Manage your account, preferences, and subscription.</p>
      </div>

      <Tabs
        tabs={[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'account', label: 'Account', icon: Lock },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'study', label: 'Study preferences', icon: BookOpen },
          { id: 'billing', label: 'Billing', icon: CreditCard },
          { id: 'privacy', label: 'Privacy', icon: Shield },
        ]}
        activeId={tab}
        onChange={setTab}
        className="mb-6"
      />

      {tab === 'profile' && (
        <Card padding="xl">
          <h2 className="font-black text-navy text-lg mb-6">Profile information</h2>
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-coral flex items-center justify-center text-white text-3xl font-black">AO</div>
            <div>
              <Button variant="outline" size="sm">Upload photo</Button>
              <p className="text-xs text-ink-mute mt-2">JPG or PNG. Max 2MB.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="First name" defaultValue="Amara" />
            <Input label="Last name" defaultValue="Okafor" />
            <Input label="Email address" defaultValue="amara@idrak.ai" />
            <Input label="Phone number" placeholder="+234..." />
          </div>
          <div className="mt-6">
            <Button variant="coral" size="md" icon={Check}>Save changes</Button>
          </div>
        </Card>
      )}

      {tab === 'notifications' && (
        <Card padding="xl">
          <h2 className="font-black text-navy text-lg mb-6">Notification preferences</h2>
          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email notifications', desc: 'Receive important updates via email.' },
              { key: 'push', label: 'Push notifications', desc: 'Notifications directly on your device.' },
              { key: 'reminders', label: 'Daily study reminders', desc: 'Gentle reminders to keep your streak going.' },
              { key: 'streak', label: 'Streak milestones', desc: 'Celebrate when you hit new streaks.' },
              { key: 'performance', label: 'Performance updates', desc: 'Weekly digest of your progress.' },
              { key: 'announcements', label: 'Institution announcements', desc: 'Messages from your school.' },
            ].map(n => (
              <div key={n.key} className="flex items-center justify-between py-3 border-b border-line/60 last:border-0">
                <div>
                  <div className="font-bold text-navy text-sm">{n.label}</div>
                  <div className="text-xs text-ink-soft">{n.desc}</div>
                </div>
                <Toggle
                  checked={notifications[n.key as keyof typeof notifications]}
                  onChange={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof notifications] }))}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'study' && (
        <Card padding="xl">
          <h2 className="font-black text-navy text-lg mb-6">Study preferences</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-navy mb-2">Daily study goal</label>
              <div className="grid grid-cols-4 gap-2">
                {[20, 45, 60, 90].map(m => (
                  <button key={m} className={`py-3 rounded-xl font-bold text-sm transition ${m === 60 ? 'bg-coral text-white' : 'bg-cream-dark text-ink-soft hover:bg-line'}`}>
                    {m} min
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-navy mb-2">AI Tutor default style</label>
              <div className="grid grid-cols-3 gap-2">
                {['Socratic', 'Direct', 'Professional'].map(s => (
                  <button key={s} className={`py-3 rounded-xl font-bold text-sm transition ${s === 'Socratic' ? 'bg-coral text-white' : 'bg-cream-dark text-ink-soft hover:bg-line'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {tab === 'billing' && (
        <div className="space-y-5">
          <Card padding="xl" tone="lavender">
            <div className="flex items-center justify-between">
              <div>
                <Badge tone="coral" size="sm" className="mb-2">Current plan</Badge>
                <h2 className="font-black text-navy text-2xl">Free</h2>
                <p className="text-sm text-ink-soft mt-1">You're on the free plan. Upgrade to unlock all features.</p>
              </div>
              <Button variant="coral" size="lg">Upgrade</Button>
            </div>
          </Card>
          <Card padding="lg">
            <h3 className="font-black text-navy mb-4">Payment history</h3>
            <div className="text-sm text-ink-soft py-4 text-center">No payments yet.</div>
          </Card>
        </div>
      )}

      {tab === 'account' && (
        <Card padding="xl">
          <h2 className="font-black text-navy text-lg mb-6">Account</h2>
          <div className="space-y-4">
            <Button variant="outline" size="md">Change password</Button>
            <div />
            <Button variant="ghost" size="md" className="text-red-600 hover:bg-red-50" icon={LogOut}>Log out</Button>
          </div>
        </Card>
      )}

      {tab === 'privacy' && (
        <Card padding="xl">
          <h2 className="font-black text-navy text-lg mb-6">Privacy & Data</h2>
          <p className="text-sm text-ink-soft leading-relaxed mb-6">
            Idrak stores your practice data, conversation history, and performance to personalize your learning.
            You can export or delete your data at any time.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" size="md">Export my data</Button>
            <Button variant="ghost" size="md" className="text-red-600">Delete my account</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
