'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Brain, Pencil, GraduationCap, MessageCircleQuestion,
  BarChart3, BookMarked, Library, Settings as SettingsIcon, Bell,
  Search, Building2, KeyRound, Menu, X, LogOut, Sparkles, Shield
} from 'lucide-react';
import { Button, Badge, Avatar } from '@/components/ui';
import { IdrakLogo } from '@/components/illustrations';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Learn' },
  { href: '/intelligence', label: 'Topic Intelligence', icon: Brain, badge: 'AI' },
  { href: '/practice', label: 'Practice', icon: Pencil },
  { href: '/exams', label: 'Mock Exams', icon: GraduationCap },
  { href: '/tutor', label: 'AI Tutor', icon: MessageCircleQuestion, badge: 'Socratic' },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/questions', label: 'Question Bank', icon: BookMarked },
  { href: '/library', label: 'My Library', icon: Library, section: 'You' },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
];

const SECONDARY_ITEMS: NavItem[] = [
  { href: '/schools', label: 'For Schools', icon: Building2, section: 'Platform' },
  { href: '/api', label: 'API & Developers', icon: KeyRound },
  { href: '/admin', label: 'Admin Panel', icon: Shield },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/session', { credentials: 'include' })
      .then((response) => response.json())
      .then((payload) => {
        if (!active) return;
        if (payload.data?.user) setUser(payload.data.user);
        else router.replace('/login');
      })
      .catch(() => router.replace('/login'));
    return () => { active = false; };
  }, [router]);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href || pathname === '/';
    return pathname?.startsWith(href);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.replace('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-line transform transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="h-16 px-6 flex items-center justify-between border-b border-line">
          <Link href="/dashboard"><IdrakLogo /></Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-cream-dark">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-0.5">
            {['Learn', 'You'].map(section => {
              const items = section === 'Learn'
                ? NAV_ITEMS.filter(n => n.section !== 'You')
                : NAV_ITEMS.filter(n => n.section === 'You');
              return (
                <div key={section} className="mb-6">
                  <div className="text-xs font-black tracking-widest uppercase text-ink-mute px-3 mb-2">{section}</div>
                  {items.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                        isActive(item.href)
                          ? 'bg-navy text-white card-shadow'
                          : 'text-ink-soft hover:bg-cream-dark hover:text-navy'
                      )}
                    >
                      <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className={cn(
                          'text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full',
                          isActive(item.href) ? 'bg-coral text-white' : 'bg-coral/15 text-coral'
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="mb-6">
            <div className="text-xs font-black tracking-widest uppercase text-ink-mute px-3 mb-2">Platform</div>
            {SECONDARY_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                  isActive(item.href)
                    ? 'bg-navy text-white card-shadow'
                    : 'text-ink-soft hover:bg-cream-dark hover:text-navy'
                )}
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span className="flex-1">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-line">
          <div className="bg-gradient-to-br from-coral to-coral-soft rounded-2xl p-4 text-white mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" />
              <div className="text-xs font-black uppercase tracking-wider">Upgrade</div>
            </div>
            <div className="text-sm font-bold mb-3 leading-tight">Unlock unlimited practice & AI tutoring</div>
            <Link href="/#pricing">
              <button className="w-full bg-white text-coral rounded-xl py-2 text-sm font-black hover:bg-cream transition-colors">
                View plans
              </button>
            </Link>
          </div>

          {user && (
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar name={user.name || 'Idrak student'} size="md" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-navy text-sm truncate">{user.name}</div>
                <div className="text-xs text-ink-mute truncate">{user.email}</div>
              </div>
              <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-cream-dark text-ink-mute" aria-label="Log out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-navy/30 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-cream/80 backdrop-blur-lg border-b border-line h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-cream-dark">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 max-w-xl relative hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-mute" />
            <input
              type="text"
              placeholder="Search questions, topics, conversations…"
              className="w-full bg-white rounded-2xl border border-line pl-11 pr-4 py-2.5 text-sm font-medium text-navy placeholder:text-ink-mute focus:outline-none focus:border-coral"
            />
          </div>

          <div className="flex items-center gap-2">
            <Link href="/notifications">
              <button className="relative p-2.5 rounded-xl hover:bg-white transition-colors" aria-label="Notifications">
                <Bell className="w-5 h-5 text-ink-soft" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral rounded-full" />
              </button>
            </Link>
            {user && (
              <div className="hidden sm:block">
                <Badge tone="coral" size="md" dot>JAMB in 47 days</Badge>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
