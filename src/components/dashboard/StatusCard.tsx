'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

interface StatusCardProps {
  status?: 'online' | 'thinking' | 'offline';
}

export function StatusCard({ status = 'online' }: StatusCardProps) {
  const statusConfig = {
    online: {
      color: 'bg-emerald-500',
      text: 'Online',
      subtitle: 'Ready to help',
      pulse: false,
    },
    thinking: {
      color: 'bg-amber-500',
      text: 'Thinking...',
      subtitle: 'Processing',
      pulse: true,
    },
    offline: {
      color: 'bg-zinc-500',
      text: 'Offline',
      subtitle: 'Away',
      pulse: false,
    },
  };

  const config = statusConfig[status];

  return (
    <Card className="bg-zinc-900/50 border-zinc-800 p-6">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-zinc-800">
            <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-4xl">
              🐻
            </AvatarFallback>
          </Avatar>
          
          {/* Status indicator */}
          <div className="absolute -bottom-1 -right-1">
            <div className={`h-5 w-5 rounded-full border-4 border-zinc-900 ${config.color} ${config.pulse ? 'animate-pulse' : ''}`} />
          </div>
        </div>

        {/* Name & Status */}
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-zinc-100">Babu</h2>
          <div className="flex items-center justify-center gap-2">
            <span className={`inline-block h-2 w-2 rounded-full ${config.color} ${config.pulse ? 'animate-pulse' : ''}`} />
            <span className="text-sm text-zinc-400">{config.text}</span>
          </div>
          <p className="text-xs text-zinc-500">{config.subtitle}</p>
        </div>
      </div>
    </Card>
  );
}
