'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { StickyNote } from 'lucide-react';

interface NotesSectionProps {
  initialContent?: string;
  onSave: (content: string) => void;
}

export function NotesSection({ initialContent = '', onSave }: NotesSectionProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  // Update content when initialContent changes
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // Debounced save
  const debouncedSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (newContent: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setIsSaving(true);
          onSave(newContent);
          setTimeout(() => setIsSaving(false), 500);
        }, 1000);
      };
    })(),
    [onSave]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    debouncedSave(newContent);
  };

  return (
    <Card className="bg-zinc-900/50 border-zinc-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-amber-500" />
            <h3 className="font-medium text-zinc-200">Notes for Babu</h3>
          </div>
          {isSaving && (
            <span className="text-xs text-zinc-500">Saving...</span>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="flex-1 p-3">
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="Add tasks here — Babu checks on every heartbeat"
          className="w-full h-full min-h-[120px] bg-transparent border-0 text-sm text-zinc-300 placeholder:text-zinc-600 resize-none focus:outline-none focus:ring-0"
        />
      </div>
    </Card>
  );
}
