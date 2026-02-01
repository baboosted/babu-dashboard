'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task, STATUS_COLORS } from '@/lib/types';
import { Trash2, GripVertical } from 'lucide-react';
import { DraggableProvided } from '@hello-pangea/dnd';

interface TaskCardProps {
  task: Task;
  provided: DraggableProvided;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, provided, onDelete }: TaskCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <Card
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="bg-zinc-800/50 border-zinc-700 p-3 hover:bg-zinc-800/80 transition-colors group"
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <div
          {...provided.dragHandleProps}
          className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-zinc-500" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`h-2 w-2 rounded-full flex-shrink-0 ${STATUS_COLORS[task.status]}`} />
              <p className="text-sm text-zinc-200 truncate">{task.title}</p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          
          <p className="text-xs text-zinc-500 mt-1 ml-4">
            {formatDate(task.created_at)}
          </p>
        </div>
      </div>
    </Card>
  );
}
