import { NextResponse } from 'next/server';
import { dbOps } from '@/lib/db';

export async function GET() {
  try {
    const content = await dbOps.getNotes();
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { content } = await request.json();
    
    if (typeof content !== 'string') {
      return NextResponse.json({ error: 'Content must be a string' }, { status: 400 });
    }

    await dbOps.updateNotes(content);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update notes:', error);
    return NextResponse.json({ error: 'Failed to update notes' }, { status: 500 });
  }
}
