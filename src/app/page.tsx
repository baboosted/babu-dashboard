'use client';

import { useEffect, useState, useCallback } from 'react';
import { StatusCard, KanbanBoard, NotesSection, ActionLog } from '@/components/dashboard';
import { Task, Action, TaskStatus } from '@/lib/types';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState('');
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      const [tasksRes, notesRes, actionsRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/notes'),
        fetch('/api/actions'),
      ]);

      const [tasksData, notesData, actionsData] = await Promise.all([
        tasksRes.json(),
        notesRes.json(),
        actionsRes.json(),
      ]);

      setTasks(tasksData);
      setNotes(notesData.content || '');
      setActions(actionsData);
      setLastSync(new Date());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh actions every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const actionsRes = await fetch('/api/actions');
        const actionsData = await actionsRes.json();
        setActions(actionsData);
      } catch (error) {
        console.error('Failed to refresh actions:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Task operations
  const handleAddTask = async (title: string, status: TaskStatus) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, status }),
      });
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      
      // Refresh actions
      const actionsRes = await fetch('/api/actions');
      const actionsData = await actionsRes.json();
      setActions(actionsData);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updatedTask = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updatedTask : t))
      );
      
      // Refresh actions
      const actionsRes = await fetch('/api/actions');
      const actionsData = await actionsRes.json();
      setActions(actionsData);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      setTasks((prev) => prev.filter((t) => t.id !== id));
      
      // Refresh actions
      const actionsRes = await fetch('/api/actions');
      const actionsData = await actionsRes.json();
      setActions(actionsData);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  // Notes operations
  const handleSaveNotes = async (content: string) => {
    try {
      await fetch('/api/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  };

  const formatSyncTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-zinc-100">Babu Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-zinc-400">Online</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {lastSync && (
            <span className="text-xs text-zinc-500">
              Last sync: {formatSyncTime(lastSync)}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-zinc-200"
            onClick={fetchData}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
        {/* Left Sidebar */}
        <div className="col-span-2 flex flex-col gap-4">
          <StatusCard status="online" />
          <div className="flex-1">
            <NotesSection initialContent={notes} onSave={handleSaveNotes} />
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-7">
          <KanbanBoard
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3">
          <ActionLog actions={actions} />
        </div>
      </div>
    </div>
  );
}
