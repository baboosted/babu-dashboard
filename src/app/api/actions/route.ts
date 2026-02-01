import { NextResponse } from 'next/server';
import { dbOps } from '@/lib/db';

export async function GET() {
  try {
    const actions = await dbOps.getActions();
    return NextResponse.json(actions);
  } catch (error) {
    console.error('Failed to fetch actions:', error);
    return NextResponse.json({ error: 'Failed to fetch actions' }, { status: 500 });
  }
}
