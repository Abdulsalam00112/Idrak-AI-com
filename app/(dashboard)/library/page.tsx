'use client';
import { Library, Bookmark, MessageCircleQuestion, FileText, FolderOpen, ExternalLink, Clock } from 'lucide-react';
import { Card, Badge, Tabs, EmptyState } from '@/components/ui';

const SAVED_ITEMS: { type: string; title: string; subject: string; topic: string; savedAt: string }[] = [];

export default function LibraryPage() {
  const typeIcon = (type: string) => {
    if (type === 'question') return <FileText className="w-4 h-4" />;
    if (type === 'explanation') return <MessageCircleQuestion className="w-4 h-4" />;
    if (type === 'conversation') return <MessageCircleQuestion className="w-4 h-4" />;
    return <Bookmark className="w-4 h-4" />;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <Badge tone="yellow" size="md" className="mb-3"><Library className="w-3.5 h-3.5" /> My Library</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-navy">Your saved content</h1>
        <p className="text-ink-soft mt-1">Questions, explanations, and tutor conversations you've saved for later.</p>
      </div>

      <Tabs
        tabs={[
          { id: 'all', label: 'All', count: SAVED_ITEMS.length },
          { id: 'question', label: 'Questions', count: SAVED_ITEMS.filter(i => i.type === 'question').length },
          { id: 'explanation', label: 'Explanations', count: SAVED_ITEMS.filter(i => i.type === 'explanation').length },
          { id: 'conversation', label: 'Tutor chats', count: SAVED_ITEMS.filter(i => i.type === 'conversation').length },
        ]}
        activeId="all"
        onChange={() => {}}
      />

      <div className="space-y-3">
        {SAVED_ITEMS.length === 0 ? <EmptyState icon={FolderOpen} title="Your library is empty" description="Questions, explanations, and tutor conversations you save will appear here." /> : SAVED_ITEMS.map((item, i) => (
          <Card key={i} padding="md" hoverable>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-yellow/25 flex items-center justify-center text-yellow-700 flex-shrink-0">
                {typeIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge tone="ink" size="sm">{item.subject}</Badge>
                  <Badge tone="gray" size="sm">{item.topic}</Badge>
                  <span className="text-xs text-ink-mute flex items-center gap-1 font-bold"><Clock className="w-3 h-3" /> {item.savedAt}</span>
                </div>
                <div className="font-bold text-navy leading-snug">{item.title}</div>
              </div>
              <button className="p-2 rounded-xl hover:bg-cream-dark text-ink-mute">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
