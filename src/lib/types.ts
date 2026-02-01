export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done' | 'archived';
  created_at: string;
  updated_at: string;
  position: number;
}

export interface Action {
  id: string;
  action: string;
  timestamp: string;
}

export type TaskStatus = Task['status'];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
  archived: 'Archived',
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: 'bg-slate-500',
  in_progress: 'bg-amber-500',
  done: 'bg-emerald-500',
  archived: 'bg-zinc-600',
};
