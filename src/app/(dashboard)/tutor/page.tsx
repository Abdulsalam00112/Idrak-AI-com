'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Send, Image as ImageIcon, Lightbulb, BookOpen, Sparkles,
  MoreHorizontal, RefreshCcw, Paperclip, ThumbsUp, ThumbsDown,
  ChevronDown, ArrowLeft, X
} from 'lucide-react';
import { Button, Card, Badge, Tabs } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'student' | 'assistant';
  content: string;
  type?: 'message' | 'hint' | 'example' | 'solution' | 'formula';
  hintLevel?: number;
  thinking?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    role: 'student',
    content: 'I don\'t understand how to solve x² − 5x + 6 = 0. Can you help?',
  },
  {
    id: 'm2',
    role: 'assistant',
    type: 'hint',
    hintLevel: 1,
    content: "Let's start with what we know. This is a **quadratic equation**, which means we're looking for values of x that make the equation equal to 0.\n\nWhen a quadratic factors neatly into the form (x + a)(x + b) = 0, our solutions come from setting each factor equal to zero.\n\nIn this equation, the constant term is **6** and the coefficient of x is **−5**. Can you think of two numbers that multiply to 6 and add up to −5?",
  },
];

const QUICK_ACTIONS = [
  { label: 'Give me a stronger hint', icon: Lightbulb },
  { label: 'Show me an example', icon: BookOpen },
  { label: 'I still don\'t understand', icon: Sparkles },
];

const SUGGESTED = [
  'Explain it differently',
  'Where does this come from?',
  'Give me a similar problem',
];

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);
  const [mode, setMode] = useState<'socratic' | 'direct' | 'professional'>('socratic');
  const [isThinking, setIsThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isThinking) return;
    setMessages(prev => [...prev, { id: `msg-${Date.now()}`, role: 'student', content: text }]);
    setInput('');
    setIsThinking(true);
    try {
      const response = await fetch('/api/ai/query', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, mode }) });
      if (!response.ok || !response.body) throw new Error('Tutor unavailable');
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let content = '';
      setMessages(prev => [...prev, { id: `msg-${Date.now()}-ai`, role: 'assistant', content: '' }]);
      while (true) { const { done, value } = await reader.read(); if (done) break; content += decoder.decode(value, { stream: true }); setMessages(prev => prev.map((msg, index) => index === prev.length - 1 ? { ...msg, content } : msg)); }
    } catch { setMessages(prev => [...prev, { id: `msg-${Date.now()}-error`, role: 'assistant', content: 'I could not reach the tutor right now. Please try again.' }]); }
    finally { setIsThinking(false); }
  };


  const requestStrongerHint = () => {
    if (isThinking) return;
    sendMessage('Give me a stronger hint without revealing the full solution.');
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-7rem)] flex gap-6">
      {/* Conversation list sidebar */}
      <aside className={cn(
        'w-72 bg-white rounded-3xl card-shadow p-4 flex-shrink-0 overflow-y-auto',
        'fixed lg:relative inset-y-0 left-0 z-30 lg:z-auto transition-transform',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-navy">Recent conversations</h3>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X className="w-5 h-5" /></button>
        </div>
        <button className="w-full flex items-center justify-center gap-2 bg-coral text-white rounded-2xl py-2.5 font-bold text-sm mb-4 hover:bg-coral-soft transition">
          <Sparkles className="w-4 h-4" /> New conversation
        </button>
        <div className="space-y-1">
          {[
            { title: 'Quadratic equations', subject: 'Mathematics', active: true, date: 'Today' },
            { title: 'Mole concept help', subject: 'Chemistry', active: false, date: 'Yesterday' },
            { title: 'Newton\'s laws', subject: 'Physics', active: false, date: '2 days ago' },
            { title: 'Genetics crosses', subject: 'Biology', active: false, date: '3 days ago' },
            { title: 'Comprehension tips', subject: 'English', active: false, date: 'Last week' },
          ].map((c, i) => (
            <button key={i} className={cn(
              'w-full text-left p-3 rounded-xl transition',
              c.active ? 'bg-navy text-white' : 'hover:bg-cream-dark text-navy'
            )}>
              <div className="text-sm font-bold truncate">{c.title}</div>
              <div className={cn('text-xs mt-0.5 flex justify-between', c.active ? 'text-white/70' : 'text-ink-mute')}>
                <span>{c.subject}</span>
                <span>{c.date}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-navy/30 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="bg-white rounded-3xl card-shadow p-4 mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-cream-dark">
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-coral/15 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-coral" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-black text-navy truncate">Quadratic Equations</h2>
                <Badge tone="coral" size="sm">Socratic</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-soft">
                <span>Mathematics</span><span>•</span><span>Algebra</span><span>•</span>
                <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse-soft" /> Idrak is guiding</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-xl hover:bg-cream-dark text-ink-soft" title="Reset conversation"><RefreshCcw className="w-4 h-4" /></button>
            <button className="p-2 rounded-xl hover:bg-cream-dark text-ink-soft" title="More options"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Mode switcher */}
        <div className="mb-4">
          <Tabs
            size="sm"
            tabs={[
              { id: 'socratic', label: 'Socratic (Guided)' },
              { id: 'direct', label: 'Direct' },
              { id: 'professional', label: 'Professional' },
            ]}
            activeId={mode}
            onChange={(id) => setMode(id as any)}
          />
        </div>

        {/* Messages */}
        <div className="flex-1 bg-white rounded-3xl card-shadow p-4 md:p-6 overflow-y-auto space-y-5">
          {mode === 'professional' && (
            <div className="p-4 rounded-2xl bg-navy text-white mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-yellow" />
                <div className="font-black text-sm">Professional mode (ICAN-style)</div>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Idrak will emphasize <strong className="text-white">reasoning, step-by-step breakdown, and verification</strong>.
                Don't expect quick answers — expect to understand the concept deeply.
              </p>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={cn(
              'flex gap-3',
              msg.role === 'student' ? 'justify-end' : 'justify-start'
            )}>
              {msg.role === 'assistant' && (
                <div className="w-9 h-9 rounded-xl bg-coral flex-shrink-0 flex items-center justify-center text-white font-black text-sm mt-0.5">I</div>
              )}
              <div className={cn(
                'max-w-[85%] rounded-3xl px-5 py-4',
                msg.role === 'student'
                  ? 'bg-coral text-white rounded-tr-md'
                  : msg.type === 'hint'
                    ? 'bg-yellow/20 text-navy rounded-tl-md border border-yellow/40'
                    : 'bg-cream-dark text-navy rounded-tl-md'
              )}>
                {msg.role === 'assistant' && msg.type === 'hint' && msg.hintLevel && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lightbulb className="w-3.5 h-3.5 text-yellow-700" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-yellow-700">
                      Hint level {msg.hintLevel} / 5
                    </span>
                  </div>
                )}
                <div className={cn(
                  'text-sm leading-relaxed whitespace-pre-line tutor-content',
                  msg.role === 'student' ? 'text-white' : 'text-navy'
                )}>
                  {msg.content.split('\\n').map((line, i) => {
                    if (line.trim() === '') return <div key={i} className="h-3" />;
                    // Bold markdown
                    const parts = line.split(/(\*\*[^*]+\*\*)/g);
                    return (
                      <div key={i}>
                        {parts.map((p, j) =>
                          p.startsWith('**') && p.endsWith('**')
                            ? <strong key={j} className={msg.role === 'student' ? 'text-white' : 'text-navy'}>{p.slice(2, -2)}</strong>
                            : <span key={j}>{p}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-line/50">
                    <button className="inline-flex items-center gap-1 text-xs font-bold text-ink-mute hover:text-coral transition">
                      <ThumbsUp className="w-3.5 h-3.5" /> Helpful
                    </button>
                    <button className="inline-flex items-center gap-1 text-xs font-bold text-ink-mute hover:text-coral transition">
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              {msg.role === 'student' && (
                <div className="w-9 h-9 rounded-xl bg-navy flex-shrink-0 flex items-center justify-center text-white font-black text-sm mt-0.5">
                  You
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-coral flex-shrink-0 flex items-center justify-center text-white font-black text-sm">I</div>
              <div className="bg-cream-dark rounded-3xl rounded-tl-md px-5 py-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-ink-mute animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-ink-mute animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-ink-mute animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick actions */}
        {hintLevel < 4 && !isThinking && (
          <div className="flex flex-wrap gap-2 mt-3">
            {QUICK_ACTIONS.map(a => (
              <button
                key={a.label}
                onClick={requestStrongerHint}
                className="inline-flex items-center gap-1.5 bg-white rounded-full px-4 py-2 text-sm font-bold text-navy hover:bg-lavender-light transition card-shadow"
              >
                <a.icon className="w-4 h-4 text-lavender-deep" />
                {a.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="mt-4">
          <Card padding="sm" className="bg-white">
            <div className="flex items-end gap-2">
              <button type="button" className="p-2.5 rounded-xl hover:bg-cream-dark text-ink-soft flex-shrink-0" title="Upload image of question">
                <Paperclip className="w-5 h-5" />
              </button>
              <button type="button" className="p-2.5 rounded-xl hover:bg-cream-dark text-ink-soft flex-shrink-0" title="Attach image">
                <ImageIcon className="w-5 h-5" />
              </button>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask Idrak a question. Don't be shy — say what you don't understand."
                rows={1}
                className="flex-1 resize-none bg-transparent border-0 focus:outline-none text-navy placeholder:text-ink-mute font-medium py-3 px-2 max-h-32"
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
              />
              <button type="submit" disabled={!input.trim() || isThinking} className="bg-coral text-white rounded-xl p-3 hover:bg-coral-soft transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </Card>
          <div className="flex items-center gap-2 mt-2 px-1 flex-wrap">
            {SUGGESTED.map(s => (
              <button key={s} type="button" onClick={() => sendMessage(s)} className="text-xs font-semibold text-ink-mute hover:text-coral transition">
                {s}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
