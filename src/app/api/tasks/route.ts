import { NextResponse } from 'next/server';
import { dbOps } from '@/lib/db';

export async function GET() {
  try {
    const tasks = dbOps.getAllTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, status = 'todo' } = await request.json();
    
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const task = dbOps.createTask(id, title.trim(), status);
    
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
