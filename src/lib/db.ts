import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Initialize tables (run once on first request)
let initialized = false;

async function initDb() {
  if (initialized) return;
  
  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT DEFAULT 'todo' CHECK(status IN ('todo', 'in_progress', 'done', 'archived')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      position INTEGER DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS action_log (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY DEFAULT 'main',
      content TEXT DEFAULT ''
    )
  `;

  // Ensure main notes entry exists
  await sql`INSERT INTO notes (id, content) VALUES ('main', '') ON CONFLICT (id) DO NOTHING`;

  initialized = true;
}

export const dbOps = {
  // Tasks
  getAllTasks: async () => {
    await initDb();
    return sql`SELECT * FROM tasks ORDER BY position ASC, created_at DESC`;
  },

  getTaskById: async (id: string) => {
    await initDb();
    const rows = await sql`SELECT * FROM tasks WHERE id = ${id}`;
    return rows[0];
  },

  createTask: async (id: string, title: string, status: string = 'todo') => {
    await initDb();
    const posResult = await sql`SELECT COALESCE(MAX(position), 0) + 1 as pos FROM tasks WHERE status = ${status}`;
    const position = posResult[0]?.pos || 1;
    
    await sql`INSERT INTO tasks (id, title, status, position) VALUES (${id}, ${title}, ${status}, ${position})`;
    await sql`INSERT INTO action_log (id, action) VALUES (${crypto.randomUUID()}, ${'Created task: "' + title + '"'})`;
    
    const rows = await sql`SELECT * FROM tasks WHERE id = ${id}`;
    return rows[0];
  },

  updateTask: async (id: string, title: string, status: string, position: number) => {
    await initDb();
    const oldRows = await sql`SELECT * FROM tasks WHERE id = ${id}`;
    const oldTask = oldRows[0] as { title: string; status: string } | undefined;
    
    await sql`UPDATE tasks SET title = ${title}, status = ${status}, position = ${position}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`;
    
    if (oldTask && oldTask.status !== status) {
      await sql`INSERT INTO action_log (id, action) VALUES (${crypto.randomUUID()}, ${'Moved "' + title + '" to ' + status.replace('_', ' ')})`;
    }
    
    const rows = await sql`SELECT * FROM tasks WHERE id = ${id}`;
    return rows[0];
  },

  deleteTask: async (id: string) => {
    await initDb();
    const rows = await sql`SELECT * FROM tasks WHERE id = ${id}`;
    const task = rows[0] as { title: string } | undefined;
    
    await sql`DELETE FROM tasks WHERE id = ${id}`;
    
    if (task) {
      await sql`INSERT INTO action_log (id, action) VALUES (${crypto.randomUUID()}, ${'Deleted task: "' + task.title + '"'})`;
    }
  },

  // Notes
  getNotes: async () => {
    await initDb();
    const rows = await sql`SELECT content FROM notes WHERE id = 'main'`;
    return rows[0]?.content || '';
  },

  updateNotes: async (content: string) => {
    await initDb();
    await sql`INSERT INTO notes (id, content) VALUES ('main', ${content}) ON CONFLICT (id) DO UPDATE SET content = ${content}`;
  },

  // Action log
  getActions: async () => {
    await initDb();
    return sql`SELECT * FROM action_log ORDER BY timestamp DESC LIMIT 50`;
  },
};

export default sql;
