'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { IdrakLogo } from '@/components/illustrations';

const NAV_LINKS = [
  { href: '/#exams', label: 'Exams' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/tutor', label: 'AI Tutor' },
  { href: '/intelligence', label: 'Topic Intelligence' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/schools', label: 'For Schools' },
];

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream/80 backdrop-blur-lg border-b border-line/50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex-shrink-0">
              <IdrakLogo />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-semibold text-ink-soft hover:text-navy rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="md">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button variant="dark" size="md" iconRight={ArrowRight}>Get Started</Button>
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-cream-dark transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-navy/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-x-4 top-20 bg-white rounded-3xl p-6 card-shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-base font-semibold text-navy hover:bg-cream rounded-xl transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-line my-4" />
              <Link href="/login" className="px-4 py-3 text-base font-semibold text-navy hover:bg-cream rounded-xl">
                Log in
              </Link>
              <Link href="/signup" className="px-4 py-3 text-base font-semibold bg-coral text-white rounded-xl text-center mt-2" onClick={() => setMobileOpen(false)}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy text-white pt-20 pb-10 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-coral flex items-center justify-center font-black text-white">I</div>
              <div className="font-black text-xl">Idrak <span className="text-coral">AI</span></div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Learn smarter. Think deeper. Prepare better. Intelligent exam preparation built for African students.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-white/90">Product</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><Link href="/#exams" className="hover:text-white transition-colors">Exams</Link></li>
              <li><Link href="/intelligence" className="hover:text-white transition-colors">Topic Intelligence</Link></li>
              <li><Link href="/tutor" className="hover:text-white transition-colors">AI Tutor</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-white/90">Institutions</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><Link href="/schools" className="hover:text-white transition-colors">For Schools</Link></li>
              <li><Link href="/sponsors" className="hover:text-white transition-colors">For NGOs</Link></li>
              <li><Link href="/api-portal" className="hover:text-white transition-colors">API</Link></li>
              <li><Link href="/white-label" className="hover:text-white transition-colors">White-label</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-white/90">Company</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">© 2026 Idrak AI. All rights reserved.</p>
          <p className="text-sm text-white/50">Built with care for African learners.</p>
        </div>
      </div>
    </footer>
  );
}
