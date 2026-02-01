'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task, TaskStatus, STATUS_LABELS, STATUS_COLORS } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { Plus, ListTodo, Clock, CheckCircle2, Archive } from 'lucide-react';
import { Droppable, Draggable } from '@hello-pangea/dnd';

const STATUS_ICONS: Record<TaskStatus, typeof ListTodo> = {
  todo: ListTodo,
  in_progress: Clock,
  done: CheckCircle2,
  archived: Archive,
};

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (title: string, status: TaskStatus) => void;
  onDeleteTask: (id: string) => void;
}

export function KanbanColumn({ status, tasks, onAddTask, onDeleteTask }: KanbanColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const Icon = STATUS_ICONS[status];

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim(), status);
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewTaskTitle('');
    }
  };

  return (
    <Card className="bg-zinc-900/30 border-zinc-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${STATUS_COLORS[status].replace('bg-', 'text-')}`} />
            <h3 className="font-medium text-zinc-200">{STATUS_LABELS[status]}</h3>
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 text-xs">
              {tasks.length}
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-500 hover:text-zinc-200"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Add task input */}
        {isAdding && (
          <div className="mt-3">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (!newTaskTitle.trim()) {
                  setIsAdding(false);
                }
              }}
              placeholder="Task title..."
              className="bg-zinc-800 border-zinc-700 text-zinc-200 text-sm"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Tasks */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <ScrollArea className="flex-1">
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`p-3 space-y-2 min-h-[200px] transition-colors ${
                snapshot.isDraggingOver ? 'bg-zinc-800/30' : ''
              }`}
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <TaskCard
                      task={task}
                      provided={provided}
                      onDelete={onDeleteTask}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </ScrollArea>
        )}
      </Droppable>
    </Card>
  );
}
