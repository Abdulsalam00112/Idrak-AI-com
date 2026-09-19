'use client';
import { Card, Button, Input, Badge, Tabs } from '@/components/ui';
import { User, Bell, Lock, CreditCard, Palette, Shield, BookOpen, LogOut, Check, Download, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Profile = {
  name: string; email: string; institution: string | null;
  dailyStudyMinutes: number; tutorMode: 'socratic' | 'direct' | 'professional';
};

export default function SettingsPage() {
  const router = useRouter();
  const [tab, setTab] = useState('profile');
  const [billing, setBilling] = useState<{ plan_code: string; status: string; current_period_end: string | null } | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true, push: true, reminders: true, streak: true, performance: true, announcements: false,
  });

  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileForm, setProfileForm] = useState({ name: '', institution: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [studySaving, setStudySaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const loadProfile = () => fetch('/api/profile', { credentials: 'include' })
    .then(r => r.json())
    .then(payload => {
      const data = payload.data;
      if (!data) return;
      setProfile(data);
      setProfileForm({ name: data.name || '', institution: data.institution || '' });
    })
    .catch(() => undefined);

  useEffect(() => { loadProfile(); }, []);

  useEffect(() => {
    fetch('/api/subscription', { credentials: 'include' })
      .then(async (response) => { const payload = await response.json(); if (!response.ok) throw new Error(payload.error?.message || 'Unable to load subscription.'); return payload.data; })
      .then(setBilling)
      .catch((reason: Error) => setBillingError(reason.message));
  }, []);

  const startCheckout = async () => {
    setCheckoutLoading(true);
    setBillingError(null);
    try {
      const response = await fetch('/api/payment/initialize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ plan: 'premium' }) });
      const payload = await response.json();
      if (!response.ok || !payload.data?.url) throw new Error(payload.error?.message || 'Unable to start checkout.');
      window.location.assign(payload.data.url);
    } catch (reason) { setBillingError(reason instanceof Error ? reason.message : 'Unable to start checkout.'); }
    finally { setCheckoutLoading(false); }
  };

  const saveProfile = async () => {
    setProfileSaving(true);
    setProfileSaved(false);
    try {
      const response = await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ name: profileForm.name, institution: profileForm.institution }) });
      if (response.ok) { setProfileSaved(true); await loadProfile(); }
    } finally { setProfileSaving(false); }
  };

  const saveStudyPrefs = async (patch: { dailyStudyMinutes?: number; tutorMode?: string }) => {
    setStudySaving(true);
    try {
      const response = await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(patch) });
      if (response.ok) await loadProfile();
    } finally { setStudySaving(false); }
  };

  const changePassword = async () => {
    setPasswordSaving(true);
    setPasswordMessage(null);
    try {
      const response = await fetch('/api/account/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ currentPassword, newPassword }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || 'Unable to update password.');
      setPasswordMessage({ text: 'Password updated.', ok: true });
      setCurrentPassword(''); setNewPassword('');
    } catch (reason) { setPasswordMessage({ text: reason instanceof Error ? reason.message : 'Unable to update password.', ok: false }); }
    finally { setPasswordSaving(false); }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.replace('/');
    router.refresh();
  };

  const exportData = async () => {
    setExporting(true);
    try {
      const response = await fetch('/api/account', { credentials: 'include' });
      const payload = await response.json();
      const blob = new Blob([JSON.stringify(payload.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'idrak-data-export.json'; a.click();
      URL.revokeObjectURL(url);
    } finally { setExporting(false); }
  };

  const deleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setDeleting(true);
    try {
      const response = await fetch('/api/account', { method: 'DELETE', credentials: 'include' });
      if (response.ok) { router.replace('/'); router.refresh(); }
    } finally { setDeleting(false); }
  };

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
            <div className="w-20 h-20 rounded-2xl bg-coral flex items-center justify-center text-white text-3xl font-black">
              {(profileForm.name || 'ID').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-ink-mute">Photo upload isn't wired up to storage yet.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Full name" placeholder="Your name" value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="Email address" value={profile?.email || ''} disabled />
            <Input label="Institution / School" placeholder="Your school" value={profileForm.institution} onChange={e => setProfileForm(f => ({ ...f, institution: e.target.value }))} />
          </div>
          <div className="mt-6 flex items-center gap-3">
            <Button variant="coral" size="md" icon={Check} onClick={saveProfile} loading={profileSaving}>Save changes</Button>
            {profileSaved && <span className="text-sm font-bold text-teal-600">Saved.</span>}
          </div>
        </Card>
      )}

      {tab === 'notifications' && (
        <Card padding="xl">
          <h2 className="font-black text-navy text-lg mb-2">Notification preferences</h2>
          <p className="text-xs text-ink-mute mb-6">These control this session's display only — notification delivery isn't connected to a backend yet, so nothing is sent regardless of these toggles.</p>
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
                  <button
                    key={m}
                    disabled={studySaving}
                    onClick={() => saveStudyPrefs({ dailyStudyMinutes: m })}
                    className={`py-3 rounded-xl font-bold text-sm transition ${profile?.dailyStudyMinutes === m ? 'bg-coral text-white' : 'bg-cream-dark text-ink-soft hover:bg-line'}`}
                  >
                    {m} min
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-navy mb-2">AI Tutor default style</label>
              <div className="grid grid-cols-3 gap-2">
                {(['socratic', 'direct', 'professional'] as const).map(s => (
                  <button
                    key={s}
                    disabled={studySaving}
                    onClick={() => saveStudyPrefs({ tutorMode: s })}
                    className={`py-3 rounded-xl font-bold text-sm capitalize transition ${profile?.tutorMode === s ? 'bg-coral text-white' : 'bg-cream-dark text-ink-soft hover:bg-line'}`}
                  >
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
                <h2 className="font-black text-navy text-2xl capitalize">{billing?.plan_code || 'Loading…'}</h2>
                <p className="text-sm text-ink-soft mt-1">{billingError || (billing?.status === 'active' ? 'Your subscription is active.' : 'Upgrade to unlock all features.')}</p>
                {billing?.current_period_end && <p className="text-xs text-ink-mute mt-1">Renews {new Date(billing.current_period_end).toLocaleDateString()}</p>}
              </div>
              <Button variant="coral" size="lg" onClick={startCheckout} disabled={checkoutLoading || billing?.status === 'active'}>{checkoutLoading ? 'Starting…' : billing?.status === 'active' ? 'Active' : 'Upgrade'}</Button>
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
          <div className="space-y-4 max-w-sm">
            <Input label="Current password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            <Input label="New password" type="password" hint="At least 8 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            {passwordMessage && <p className={`text-sm font-semibold ${passwordMessage.ok ? 'text-teal-600' : 'text-red-600'}`}>{passwordMessage.text}</p>}
            <Button variant="outline" size="md" onClick={changePassword} loading={passwordSaving} disabled={!currentPassword || newPassword.length < 8}>Change password</Button>
            <div className="pt-4 border-t border-line" />
            <Button variant="ghost" size="md" className="text-red-600 hover:bg-red-50" icon={LogOut} onClick={handleLogout}>Log out</Button>
          </div>
        </Card>
      )}

      {tab === 'privacy' && (
        <Card padding="xl">
          <h2 className="font-black text-navy text-lg mb-6">Privacy & Data</h2>
          <p className="text-sm text-ink-soft leading-relaxed mb-6">
            Idrak stores your profile, practice attempts, topic performance, and bookmarks to personalize your learning.
            You can export or delete that data at any time.
          </p>
          <div className="flex gap-3 flex-wrap mb-6">
            <Button variant="outline" size="md" icon={Download} onClick={exportData} loading={exporting}>Export my data</Button>
          </div>
          <div className="p-4 rounded-2xl border-2 border-red-200 bg-red-50/50 max-w-md">
            <h3 className="font-black text-red-700 text-sm mb-2">Delete my account</h3>
            <p className="text-xs text-red-700/80 mb-3">This permanently deletes your account, practice history, and bookmarks. Type DELETE to confirm.</p>
            <div className="flex gap-2">
              <Input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="DELETE" />
              <Button variant="ghost" size="md" className="text-red-600 hover:bg-red-100 flex-shrink-0" icon={Trash2} disabled={deleteConfirm !== 'DELETE'} loading={deleting} onClick={deleteAccount}>Delete</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
