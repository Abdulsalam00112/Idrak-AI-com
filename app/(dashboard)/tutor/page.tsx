'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Send, Lightbulb, BookOpen, Sparkles,
  MoreHorizontal, RefreshCcw, Paperclip, ThumbsUp, ThumbsDown,
  ChevronDown, X, Pencil, Trash2, FileText
} from 'lucide-react';
import { Button, Card, Badge, Tabs } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'student' | 'assistant';
  content: string;
}

const QUICK_ACTIONS = [
  { label: 'Give me a stronger hint', icon: Lightbulb, prompt: (level: number) => `Give me a stronger hint than before (hint level ${level} of 5 — be progressively more specific as this number goes up, but still don't give the final answer outright until level 5).` },
  { label: 'Show me an example', icon: BookOpen, prompt: () => 'Show me a worked example of a similar problem, fully solved, so I can see the method.' },
  { label: "I still don't understand", icon: Sparkles, prompt: () => "I still don't understand. Please explain it a completely different way — try a different analogy or approach than before." },
];

const SUGGESTED = [
  'Explain it differently',
  'Where does this come from?',
  'Give me a similar problem',
];

const ACCEPTED_FILE_TYPES = 'application/pdf,text/plain,text/markdown';

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<{ id: string; title: string; updated_at: string }[]>([]);
  const [conversationId, setConversationId] = useState<string>();
  const [conversationTitle, setConversationTitle] = useState('New conversation');
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);
  const [mode, setMode] = useState<'socratic' | 'direct' | 'professional'>('socratic');
  const [isThinking, setIsThinking] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [attaching, setAttaching] = useState(false);
  const [attachStatus, setAttachStatus] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    fetch('/api/conversations', { credentials: 'include' })
      .then((response) => response.json())
      .then((payload) => setConversations(payload.data ?? []))
      .catch(() => setConversations([]));
    // Default the mode to whatever the user picked in Settings > Study preferences.
    fetch('/api/profile', { credentials: 'include' })
      .then((r) => r.json())
      .then((payload) => { if (payload.data?.tutorMode) setMode(payload.data.tutorMode); })
      .catch(() => undefined);
  }, []);

  const refreshMessages = async (id: string) => {
    const response = await fetch(`/api/conversations/${id}`, { credentials: 'include' });
    if (!response.ok) return;
    const payload = await response.json();
    setMessages((payload.data?.messages ?? []).map((message: { id: string; role: string; content: string }) => ({ id: message.id, role: message.role === 'user' ? 'student' : 'assistant', content: message.content })));
    if (payload.data?.conversation?.title) setConversationTitle(payload.data.conversation.title);
  };

  const loadConversation = async (id: string) => {
    setConversationId(id);
    setMenuOpen(false);
    await refreshMessages(id);
  };

  const createConversation = async () => {
    const response = await fetch('/api/conversations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ title: 'New conversation' }) });
    if (!response.ok) return;
    const payload = await response.json();
    if (payload.data) { setConversationId(payload.data.id); setConversations((current) => [payload.data, ...current]); setMessages([]); setConversationTitle('New conversation'); setHintLevel(1); }
  };

  // "Reset" clears the current chat view without deleting anything — the
  // next message you send simply starts a new conversation, same as a fresh
  // visit to this page. Use the menu's "Delete conversation" if you actually
  // want to remove saved history.
  const resetConversation = () => {
    setMessages([]);
    setConversationId(undefined);
    setConversationTitle('New conversation');
    setHintLevel(1);
    setMenuOpen(false);
  };

  const renameConversation = async () => {
    if (!conversationId) return;
    const nextTitle = window.prompt('Rename conversation', conversationTitle);
    if (!nextTitle || !nextTitle.trim()) return;
    const response = await fetch(`/api/conversations/${conversationId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ title: nextTitle.trim() }) });
    if (response.ok) {
      setConversationTitle(nextTitle.trim());
      setConversations((current) => current.map((c) => c.id === conversationId ? { ...c, title: nextTitle.trim() } : c));
    }
    setMenuOpen(false);
  };

  const deleteConversation = async () => {
    if (!conversationId) return;
    if (!window.confirm('Delete this conversation and its messages? This cannot be undone.')) return;
    const response = await fetch(`/api/conversations/${conversationId}`, { method: 'DELETE', credentials: 'include' });
    if (response.ok) {
      setConversations((current) => current.filter((c) => c.id !== conversationId));
      resetConversation();
    }
    setMenuOpen(false);
  };

  const sendMessage = async (text: string, { isStrongerHint = false }: { isStrongerHint?: boolean } = {}) => {
    if (!text.trim() || isThinking) return;
    const nextHintLevel = isStrongerHint ? Math.min(hintLevel + 1, 5) : 1;
    setHintLevel(nextHintLevel);

    let activeConversationId = conversationId;
    if (!activeConversationId) {
      const conversationResponse = await fetch('/api/conversations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ title: text.slice(0, 80) }) });
      const conversationPayload = await conversationResponse.json();
      if (!conversationResponse.ok || !conversationPayload.data?.id) return;
      activeConversationId = conversationPayload.data.id;
      setConversationId(activeConversationId);
      setConversationTitle(conversationPayload.data.title || text.slice(0, 80));
      setConversations((current) => [conversationPayload.data, ...current]);
    }
    setMessages(prev => [...prev, { id: `pending-${Date.now()}`, role: 'student', content: text }]);
    setInput('');
    setIsThinking(true);
    try {
      const response = await fetch('/api/ai/query', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ message: text, mode, conversationId: activeConversationId }) });
      if (!response.ok || !response.body) throw new Error('Tutor unavailable');
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let content = '';
      setMessages(prev => [...prev, { id: `pending-${Date.now()}-ai`, role: 'assistant', content: '' }]);
      while (true) { const { done, value } = await reader.read(); if (done) break; content += decoder.decode(value, { stream: true }); setMessages(prev => prev.map((msg, index) => index === prev.length - 1 ? { ...msg, content } : msg)); }
      // Replace the temporary client-side ids with real database ids so
      // Helpful/Not-helpful feedback has something real to attach to.
      if (activeConversationId) await refreshMessages(activeConversationId);
    } catch { setMessages(prev => [...prev, { id: `pending-${Date.now()}-error`, role: 'assistant', content: 'I could not reach the tutor right now. Please try again.' }]); }
    finally { setIsThinking(false); }
  };

  const sendFeedback = async (messageId: string, rating: 1 | 5) => {
    if (messageId.startsWith('pending-')) return; // real id not available yet
    setFeedback((prev) => ({ ...prev, [messageId]: rating === 5 ? 'up' : 'down' }));
    try {
      await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ messageId, rating }) });
    } catch { /* keep the optimistic UI state even if this failed silently */ }
  };

  const handleAttach = async (file: File) => {
    setAttaching(true);
    setAttachStatus(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadResponse = await fetch('/api/documents', { method: 'POST', credentials: 'include', body: formData });
      const uploadPayload = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(uploadPayload.error?.message || 'Upload failed.');
      const documentId = uploadPayload.data.id;
      const processResponse = await fetch(`/api/documents/${documentId}/process`, { method: 'POST', credentials: 'include' });
      const processPayload = await processResponse.json();
      if (!processResponse.ok) throw new Error(processPayload.error?.message || 'Processing failed.');
      if (processPayload.data?.processingStatus === 'needs_extractor') {
        setAttachStatus(`"${file.name}" uploaded, but PDF text extraction isn't wired up yet — Idrak can't read its contents in this session.`);
      } else {
        setAttachStatus(`"${file.name}" is attached — Idrak can reference it in this conversation.`);
      }
    } catch (error) {
      setAttachStatus(error instanceof Error ? error.message : 'Unable to attach that file.');
    } finally {
      setAttaching(false);
    }
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
        <button onClick={createConversation} className="w-full flex items-center justify-center gap-2 bg-coral text-white rounded-2xl py-2.5 font-bold text-sm mb-4 hover:bg-coral-soft transition">
          <Sparkles className="w-4 h-4" /> New conversation
        </button>
        <div className="space-y-1">
          {conversations.length === 0 ? (
            <p className="px-3 py-6 text-sm leading-relaxed text-ink-mute">Your saved conversations will appear here.</p>
          ) : conversations.map((c) => (
            <button key={c.id} onClick={() => loadConversation(c.id)} className={cn('w-full text-left p-3 rounded-xl transition', c.id === conversationId ? 'bg-navy text-white' : 'hover:bg-cream-dark text-navy')}>
              <div className="text-sm font-bold truncate">{c.title}</div>
              <div className={cn('text-xs mt-0.5', c.id === conversationId ? 'text-white/70' : 'text-ink-mute')}>{new Date(c.updated_at).toLocaleDateString()}</div>
            </button>
          ))}
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-navy/30 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="bg-white rounded-3xl card-shadow p-4 mb-4 flex items-center justify-between gap-3 relative">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-cream-dark">
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-coral/15 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-coral" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-black text-navy truncate">{conversationTitle}</h2>
                <Badge tone="coral" size="sm" className="capitalize">{mode}</Badge>
              </div>
              {isThinking && (
                <div className="flex items-center gap-2 text-xs text-ink-soft">
                  <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse-soft" /> Idrak is thinking</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={resetConversation} className="p-2 rounded-xl hover:bg-cream-dark text-ink-soft" title="Reset conversation (clears this view)"><RefreshCcw className="w-4 h-4" /></button>
            <div className="relative">
              <button onClick={() => setMenuOpen((v) => !v)} className="p-2 rounded-xl hover:bg-cream-dark text-ink-soft" title="More options"><MoreHorizontal className="w-4 h-4" /></button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl card-shadow border border-line py-1 z-10">
                  <button onClick={renameConversation} disabled={!conversationId} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-navy hover:bg-cream-dark disabled:opacity-40 disabled:cursor-not-allowed">
                    <Pencil className="w-4 h-4" /> Rename
                  </button>
                  <button onClick={deleteConversation} disabled={!conversationId} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-coral hover:bg-cream-dark disabled:opacity-40 disabled:cursor-not-allowed">
                    <Trash2 className="w-4 h-4" /> Delete conversation
                  </button>
                </div>
              )}
            </div>
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
            onChange={(id) => setMode(id as 'socratic' | 'direct' | 'professional')}
          />
        </div>

        {/* Messages */}
        <div className="flex-1 bg-white rounded-3xl card-shadow p-4 md:p-6 overflow-y-auto space-y-5">
          {mode === 'professional' && (
            <div className="p-4 rounded-2xl bg-navy text-white mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-yellow" />
                <div className="font-black text-sm">Professional mode</div>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Idrak will emphasize <strong className="text-white">reasoning, step-by-step breakdown, and verification</strong>.
                Don't expect quick answers — expect to understand the concept deeply.
              </p>
            </div>
          )}

          {messages.length === 0 && !isThinking && (
            <div className="text-center py-12 text-ink-mute text-sm">Ask Idrak anything you're stuck on.</div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={cn('flex gap-3', msg.role === 'student' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <div className="w-9 h-9 rounded-xl bg-coral flex-shrink-0 flex items-center justify-center text-white font-black text-sm mt-0.5">I</div>
              )}
              <div className={cn(
                'max-w-[85%] rounded-3xl px-5 py-4',
                msg.role === 'student' ? 'bg-coral text-white rounded-tr-md' : 'bg-cream-dark text-navy rounded-tl-md'
              )}>
                <div className={cn('text-sm leading-relaxed whitespace-pre-line', msg.role === 'student' ? 'text-white' : 'text-navy')}>
                  {msg.content}
                </div>
                {msg.role === 'assistant' && msg.content && (
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-line/50">
                    <button
                      onClick={() => sendFeedback(msg.id, 5)}
                      disabled={msg.id.startsWith('pending-')}
                      className={cn('inline-flex items-center gap-1 text-xs font-bold transition disabled:opacity-40', feedback[msg.id] === 'up' ? 'text-coral' : 'text-ink-mute hover:text-coral')}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> Helpful
                    </button>
                    <button
                      onClick={() => sendFeedback(msg.id, 1)}
                      disabled={msg.id.startsWith('pending-')}
                      className={cn('inline-flex items-center gap-1 text-xs font-bold transition disabled:opacity-40', feedback[msg.id] === 'down' ? 'text-coral' : 'text-ink-mute hover:text-coral')}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              {msg.role === 'student' && (
                <div className="w-9 h-9 rounded-xl bg-navy flex-shrink-0 flex items-center justify-center text-white font-black text-sm mt-0.5">You</div>
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

        {attachStatus && (
          <div className="mt-3 p-3 rounded-xl bg-lavender-light text-sm font-semibold text-navy flex items-center justify-between gap-2">
            <span>{attachStatus}</span>
            <button onClick={() => setAttachStatus(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Quick actions */}
        {!isThinking && (
          <div className="flex flex-wrap gap-2 mt-3">
            {QUICK_ACTIONS.map(a => (
              <button
                key={a.label}
                onClick={() => sendMessage(a.prompt(hintLevel + 1), { isStrongerHint: a.label === 'Give me a stronger hint' })}
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
              <input ref={fileInputRef} type="file" accept={ACCEPTED_FILE_TYPES} className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleAttach(file); e.target.value = ''; }} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={attaching}
                className="p-2.5 rounded-xl hover:bg-cream-dark text-ink-soft flex-shrink-0 disabled:opacity-50"
                title="Attach a PDF, text, or Markdown file for Idrak to reference"
              >
                {attaching ? <div className="w-5 h-5 border-2 border-ink-mute border-t-transparent rounded-full animate-spin" /> : <Paperclip className="w-5 h-5" />}
              </button>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask Idrak a question. Don't be shy — say what you don't understand."
                rows={1}
                className="flex-1 resize-none bg-transparent border-0 focus:outline-none text-navy placeholder:text-ink-mute font-medium py-3 px-2 max-h-32"
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
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
            <FileText className="w-3.5 h-3.5 text-ink-mute" />
            <span className="text-xs text-ink-mute mr-2">PDF/text attachments only — image upload isn't supported by the backend yet.</span>
          </div>
          <div className="flex items-center gap-2 mt-1 px-1 flex-wrap">
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
