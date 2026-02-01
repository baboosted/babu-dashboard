'use client';

import { Task, TaskStatus } from '@/lib/types';
import { KanbanColumn } from './KanbanColumn';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';

interface KanbanBoardProps {
  tasks: Task[];
  onAddTask: (title: string, status: TaskStatus) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

const COLUMNS: TaskStatus[] = ['todo', 'in_progress', 'done', 'archived'];

export function KanbanBoard({ tasks, onAddTask, onUpdateTask, onDeleteTask }: KanbanBoardProps) {
  const tasksByStatus = COLUMNS.reduce((acc, status) => {
    acc[status] = tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.position - b.position);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    const newPosition = destination.index;

    onUpdateTask(draggableId, {
      status: newStatus,
      position: newPosition,
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-4 gap-4 h-full">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            onAddTask={onAddTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
