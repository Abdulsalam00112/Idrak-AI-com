import React from 'react';
import { cn } from '@/lib/utils';

// Hero illustration: student riding a giant pencil with topic cards, stars, progress rings
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <div className={cn('relative w-full', className)}>
      <svg viewBox="0 0 600 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        {/* Background circle */}
        <circle cx="300" cy="260" r="220" fill="#e8e0f5" opacity="0.5" />
        <circle cx="300" cy="260" r="180" fill="#f3ecfa" opacity="0.6" />

        {/* Decorative dots */}
        <circle cx="120" cy="100" r="6" fill="#ff6b4a" />
        <circle cx="500" cy="90" r="4" fill="#ffd93d" />
        <circle cx="80" cy="320" r="8" fill="#4ecdc4" />
        <circle cx="540" cy="340" r="5" fill="#b8a4e8" />
        <circle cx="150" cy="420" r="4" fill="#ff6b4a" />
        <circle cx="480" cy="420" r="7" fill="#ffd93d" />

        {/* Stars */}
        <g className="animate-float" style={{ animationDelay: '0.2s' }}>
          <path d="M480 120 l4 8 8 4 -8 4 -4 8 -4 -8 -8 -4 8 -4 z" fill="#ffd93d" />
        </g>
        <g className="animate-float" style={{ animationDelay: '1s' }}>
          <path d="M100 180 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3 z" fill="#ff6b4a" />
        </g>
        <g className="animate-float-slow">
          <path d="M520 240 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3 z" fill="#4ecdc4" />
        </g>

        {/* Giant pencil (body) */}
        <g transform="rotate(-18, 320, 280)" className="animate-float-slow">
          {/* Pencil body (lavender) */}
          <rect x="150" y="240" width="320" height="52" rx="12" fill="#b8a4e8" />
          {/* Pencil stripe */}
          <rect x="150" y="240" width="320" height="12" rx="0" fill="#8b6fc0" opacity="0.3" />
          {/* Pencil tip */}
          <polygon points="470,240 520,266 470,292" fill="#2d2d3d" />
          <polygon points="490,252 520,266 490,280" fill="#0f0f23" />
          {/* Eraser */}
          <rect x="125" y="240" width="32" height="52" rx="8" fill="#ff6b4a" />
          <rect x="152" y="240" width="10" height="52" fill="#e88c75" />
          {/* Decorative rings */}
          <rect x="200" y="240" width="4" height="52" fill="#8b6fc0" opacity="0.4" />
          <rect x="400" y="240" width="4" height="52" fill="#8b6fc0" opacity="0.4" />
        </g>

        {/* Student character sitting on pencil */}
        <g transform="translate(260, 155)" className="animate-float-slow">
          {/* Legs */}
          <rect x="25" y="100" width="18" height="50" rx="9" fill="#2d2d3d" />
          <rect x="62" y="100" width="18" height="45" rx="9" fill="#2d2d3d" />
          {/* Shoes */}
          <ellipse cx="34" cy="152" rx="14" ry="7" fill="#0f0f23" />
          <ellipse cx="71" cy="148" rx="14" ry="7" fill="#0f0f23" />
          {/* Body/corner */}
          <path d="M15 70 Q 55 50 95 70 L 90 110 Q 55 120 20 110 Z" fill="#ff6b4a" />
          {/* Arms */}
          <path d="M15 75 Q -5 85 8 105" stroke="#2d2d3d" strokeWidth="14" strokeLinecap="round" fill="none" />
          <path d="M95 75 Q 115 70 112 55" stroke="#2d2d3d" strokeWidth="14" strokeLinecap="round" fill="none" />
          {/* Hand on pencil */}
          <circle cx="112" cy="55" r="9" fill="#f5c59c" />
          {/* Head */}
          <circle cx="55" cy="40" r="28" fill="#f5c59c" />
          {/* Hair */}
          <path d="M28 35 Q 30 10 55 12 Q 85 10 82 38 Q 70 25 55 26 Q 38 25 28 38 Z" fill="#0f0f23" />
          <path d="M82 38 Q 90 45 85 58" stroke="#0f0f23" strokeWidth="8" strokeLinecap="round" fill="none" />
          {/* Face */}
          <circle cx="46" cy="40" r="2.5" fill="#0f0f23" />
          <circle cx="66" cy="40" r="2.5" fill="#0f0f23" />
          <path d="M48 50 Q 55 56 62 50" stroke="#0f0f23" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Cheek */}
          <circle cx="40" cy="48" r="4" fill="#ffb3a1" opacity="0.6" />
          <circle cx="72" cy="48" r="4" fill="#ffb3a1" opacity="0.6" />
        </g>

        {/* Floating card: Topic card */}
        <g transform="translate(80, 230)" className="animate-float">
          <rect width="120" height="80" rx="16" fill="white" className="card-shadow" />
          <rect x="12" y="16" width="40" height="8" rx="4" fill="#ff6b4a" />
          <rect x="12" y="32" width="90" height="6" rx="3" fill="#e8e4dd" />
          <rect x="12" y="44" width="70" height="6" rx="3" fill="#e8e4dd" />
          <rect x="12" y="58" width="30" height="12" rx="6" fill="#e8e0f5" />
        </g>

        {/* Floating card: Progress */}
        <g transform="translate(420, 320)" className="animate-float" style={{ animationDelay: '0.5s' }}>
          <rect width="130" height="90" rx="18" fill="white" className="card-shadow" />
          <circle cx="30" cy="45" r="22" fill="none" stroke="#e8e4dd" strokeWidth="5" />
          <circle cx="30" cy="45" r="22" fill="none" stroke="#ff6b4a" strokeWidth="5" strokeDasharray="110" strokeDashoffset="30" strokeLinecap="round" transform="rotate(-90 30 45)" />
          <text x="30" y="50" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f0f23">72%</text>
          <rect x="62" y="22" width="50" height="8" rx="4" fill="#ffd93d" />
          <text x="62" y="42" fontSize="10" fontWeight="700" fill="#0f0f23">Readiness</text>
          <rect x="62" y="50" width="56" height="5" rx="2.5" fill="#e8e4dd" />
          <rect x="62" y="50" width="42" height="5" rx="2.5" fill="#4ecdc4" />
        </g>

        {/* AI chat bubble */}
        <g transform="translate(440, 160)" className="animate-float-slow" style={{ animationDelay: '0.8s' }}>
          <rect width="130" height="60" rx="18" fill="#0f0f23" />
          <polygon points="12,56 20,68 28,56" fill="#0f0f23" />
          <circle cx="24" cy="30" r="5" fill="#ff6b4a" />
          <circle cx="42" cy="30" r="5" fill="#ffd93d" />
          <circle cx="60" cy="30" r="5" fill="#b8a4e8" />
          <rect x="72" y="26" width="46" height="8" rx="4" fill="white" opacity="0.2" />
        </g>

        {/* Small book at bottom left */}
        <g transform="translate(90, 380)" className="animate-float" style={{ animationDelay: '1.2s' }}>
          <rect width="50" height="38" rx="6" fill="#ffd93d" />
          <rect x="0" y="0" width="25" height="38" rx="6" fill="#f0c020" />
          <line x1="25" y1="4" x2="25" y2="34" stroke="#0f0f23" strokeWidth="1.5" opacity="0.4" />
        </g>

        {/* Question mark bubble */}
        <g transform="translate(500, 380)" className="animate-float-slow" style={{ animationDelay: '0.4s' }}>
          <circle cx="28" cy="28" r="28" fill="#4ecdc4" />
          <text x="28" y="40" textAnchor="middle" fontSize="28" fontWeight="900" fill="white">?</text>
        </g>
      </svg>
    </div>
  );
}

// Floating decorative blob shapes
export function LavenderBlob({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M95,-88.5 C119.7,-69.7,138.8,-42.5,146.7,-12.2 C154.6,18,151.2,51.3,132.2,76.5 C113.2,101.7,78.6,118.9,43.7,127.3 C8.8,135.7,-26.5,135.3,-57.2,121.3 C-87.9,107.3,-114.1,79.7,-126.9,47.9 C-139.7,16.1,-139.1,-20,-122.6,-48.7 C-106.2,-77.5,-73.9,-98.9,-42.1,-112.8 C-10.4,-126.7,20.9,-133,49.4,-125.3 C77.9,-117.6,103.4,-95.8,127.3,-70.2 Z"
        fill="#b8a4e8"
        transform="translate(200 200)"
        opacity="0.4"
      />
    </svg>
  );
}

export function CoralBlob({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M80.2,-80.7 C104.2,-57.7,124.8,-30.8,130.9,-0.5 C137,29.8,128.7,63.4,108.5,87.1 C88.3,110.8,56.3,124.6,23.5,130.4 C-9.2,136.2,-42.8,134,-69.7,119.1 C-96.5,104.2,-116.6,76.6,-126.6,45.3 C-136.5,14,-136.4,-21,-123.6,-49.2 C-110.7,-77.4,-85.2,-98.8,-57.2,-113.9 C-29.3,-129,1.2,-137.6,29.5,-130.7 C57.9,-123.8,83.8,-101.5,104.8,-76.6 Z"
        fill="#ff6b4a"
        transform="translate(200 200)"
        opacity="0.15"
      />
    </svg>
  );
}

// Smaller subject icons for cards
export function SubjectIcon({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    calculator: (
      <g>
        <rect x="8" y="4" width="24" height="32" rx="4" fill="currentColor" />
        <rect x="11" y="7" width="18" height="7" rx="1" fill="white" />
        <circle cx="14" cy="19" r="1.5" fill="white" />
        <circle cx="20" cy="19" r="1.5" fill="white" />
        <circle cx="26" cy="19" r="1.5" fill="white" />
        <circle cx="14" cy="25" r="1.5" fill="white" />
        <circle cx="20" cy="25" r="1.5" fill="white" />
        <circle cx="26" cy="25" r="1.5" fill="white" />
        <circle cx="14" cy="31" r="1.5" fill="white" />
        <circle cx="20" cy="31" r="1.5" fill="white" />
        <circle cx="26" cy="31" r="1.5" fill="white" />
      </g>
    ),
    'book-open': (
      <g>
        <path d="M4 8 L 16 4 L 28 8 L 28 28 L 16 24 L 4 28 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M16 4 L 16 24" stroke="currentColor" strokeWidth="2.5" />
      </g>
    ),
    atom: (
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="20" cy="20" rx="14" ry="6" />
        <ellipse cx="20" cy="20" rx="14" ry="6" transform="rotate(60 20 20)" />
        <ellipse cx="20" cy="20" rx="14" ry="6" transform="rotate(-60 20 20)" />
        <circle cx="20" cy="20" r="2.5" fill="currentColor" />
      </g>
    ),
    'flask-conical': (
      <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M12 4 L 12 14 L 5 30 L 35 30 L 28 14 L 28 4 Z" />
        <path d="M10 4 L 30 4" strokeLinecap="round" />
        <path d="M9 22 L 31 22" opacity="0.5" />
      </g>
    ),
    leaf: (
      <g>
        <path d="M8 28 C 8 14 20 6 34 8 C 34 22 24 32 12 30 Z" fill="currentColor" />
        <path d="M10 30 Q 20 20 32 10" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    ),
    'trending-up': (
      <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6,26 14,18 20,22 32,10" />
        <polyline points="24,10 32,10 32,18" />
      </g>
    ),
  };
  return (
    <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
      {icons[name] || icons['book-open']}
    </svg>
  );
}

// Small logo mark (can be used standalone)
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="12" fill="#0f0f23" />
      <path
        d="M10 28 L 10 14 Q 20 10 30 14 L 30 28 Q 20 24 10 28 Z"
        fill="#ff6b4a"
      />
      <circle cx="20" cy="21" r="3" fill="#ffd93d" />
    </svg>
  );
}

// Idrak wordmark
export function IdrakLogo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoMark className="w-9 h-9" />
      <div className="font-black text-xl tracking-tight text-navy">
        Idrak <span className="text-coral">AI</span>
      </div>
    </div>
  );
}
