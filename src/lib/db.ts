import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'dashboard.db'));

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'todo' CHECK(status IN ('todo', 'in_progress', 'done', 'archived')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    position INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS action_log (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY DEFAULT 'main',
    content TEXT DEFAULT ''
  );

  -- Ensure main notes entry exists
  INSERT OR IGNORE INTO notes (id, content) VALUES ('main', '');
`);

// Prepared statements for tasks
const getAllTasks = db.prepare('SELECT * FROM tasks ORDER BY position ASC, created_at DESC');
const getTaskById = db.prepare('SELECT * FROM tasks WHERE id = ?');
const createTask = db.prepare(`
  INSERT INTO tasks (id, title, status, position) 
  VALUES (?, ?, ?, (SELECT COALESCE(MAX(position), 0) + 1 FROM tasks WHERE status = ?))
`);
const updateTask = db.prepare(`
  UPDATE tasks SET title = ?, status = ?, position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
`);
const deleteTask = db.prepare('DELETE FROM tasks WHERE id = ?');

// Prepared statements for notes
const getNotes = db.prepare('SELECT content FROM notes WHERE id = ?');
const updateNotes = db.prepare('INSERT OR REPLACE INTO notes (id, content) VALUES (?, ?)');

// Prepared statements for action log
const getActions = db.prepare('SELECT * FROM action_log ORDER BY timestamp DESC LIMIT 50');
const createAction = db.prepare('INSERT INTO action_log (id, action) VALUES (?, ?)');

export const dbOps = {
  // Tasks
  getAllTasks: () => getAllTasks.all(),
  getTaskById: (id: string) => getTaskById.get(id),
  createTask: (id: string, title: string, status: string = 'todo') => {
    createTask.run(id, title, status, status);
    createAction.run(crypto.randomUUID(), `Created task: "${title}"`);
    return getTaskById.get(id);
  },
  updateTask: (id: string, title: string, status: string, position: number) => {
    const oldTask = getTaskById.get(id) as { title: string; status: string } | undefined;
    updateTask.run(title, status, position, id);
    if (oldTask && oldTask.status !== status) {
      createAction.run(crypto.randomUUID(), `Moved "${title}" to ${status.replace('_', ' ')}`);
    }
    return getTaskById.get(id);
  },
  deleteTask: (id: string) => {
    const task = getTaskById.get(id) as { title: string } | undefined;
    deleteTask.run(id);
    if (task) {
      createAction.run(crypto.randomUUID(), `Deleted task: "${task.title}"`);
    }
  },

  // Notes
  getNotes: () => {
    const result = getNotes.get('main') as { content: string } | undefined;
    return result?.content || '';
  },
  updateNotes: (content: string) => {
    updateNotes.run('main', content);
  },

  // Action log
  getActions: () => getActions.all(),
};

export default db;
