'use client';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Action } from '@/lib/types';
import { Activity } from 'lucide-react';

interface ActionLogProps {
  actions: Action[];
}

export function ActionLog({ actions }: ActionLogProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <Card className="bg-zinc-900/50 border-zinc-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-500" />
          <h3 className="font-medium text-zinc-200">Action Log</h3>
        </div>
      </div>

      {/* Actions */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {actions.length === 0 ? (
            <p className="text-sm text-zinc-600 text-center py-4">
              No actions yet
            </p>
          ) : (
            actions.map((action) => (
              <div
                key={action.id}
                className="flex items-start gap-3 py-2 px-2 rounded hover:bg-zinc-800/30 transition-colors"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-300 break-words">{action.action}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{formatTime(action.timestamp)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
