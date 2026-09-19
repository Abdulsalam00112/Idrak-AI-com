import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Idrak AI — Learn smarter. Think deeper. Prepare better.',
  description: 'Idrak AI turns past questions, your performance, and exam intelligence into a personalized study path — so you know what to study, when to study it, and why it matters.',
  openGraph: {
    title: 'Idrak AI — Exam Preparation, Reimagined',
    description: 'The intelligent exam preparation platform for African students. JAMB, WAEC, NECO, SAT, IELTS, ICAN.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#faf7f2',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream text-navy antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
