# Babu Dashboard - Build Task

## Overview
Build a beautiful AI assistant dashboard similar to the "Klaus Dashboard" style. This is a personal dashboard for an AI assistant named "Babu" (🐻) to track tasks and projects.

## Tech Stack (Already Set Up)
- Next.js 14 with App Router
- TailwindCSS + shadcn/ui components
- SQLite via better-sqlite3
- @hello-pangea/dnd for drag-and-drop
- lucide-react for icons

## Design Requirements
- **Dark theme** - sleek, modern, dark background (#0a0a0a or similar)
- **Accent color** - Use a warm accent (amber/orange works well)
- **Clean typography** - Use good font hierarchy
- **Smooth animations** - Subtle transitions on interactions

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Header: "Babu Dashboard" with status indicator (● Online)       │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│  Status  │              Kanban Board                            │
│  Card    │  ┌────────┬────────┬────────┬──────────┐            │
│          │  │ To Do  │In Prog │  Done  │ Archived │            │
│  Avatar  │  │        │        │        │          │            │
│  Name    │  │ [task] │ [task] │ [task] │  [task]  │            │
│  Status  │  │ [task] │        │        │          │            │
│          │  └────────┴────────┴────────┴──────────┘            │
│          │                                                      │
├──────────┼──────────────────────────────────────────────────────┤
│  Notes   │                    Action Log                        │
│  Section │  • [timestamp] Action description                    │
│          │  • [timestamp] Action description                    │
└──────────┴──────────────────────────────────────────────────────┘
```

## Components to Build

### 1. StatusCard (left sidebar top)
- Avatar placeholder (circle, can use emoji 🐻 for now)
- Name: "Babu"
- Status indicator: Online (green dot), Thinking (yellow pulse), Offline (gray)
- "Just finished • Ready" style subtitle

### 2. KanbanBoard (main area)
- 4 columns: To Do, In Progress, Done, Archived
- Each column has a header with icon and count
- Tasks are cards with:
  - Title
  - Date created
  - Optional status dot
- Drag and drop between columns
- Add task button (+ icon) in each column header

### 3. NotesSection (left sidebar bottom)
- Simple textarea for notes
- Auto-save to localStorage or DB
- "Notes for Babu" header

### 4. ActionLog (bottom right)
- Scrollable list of recent actions
- Timestamp + description format
- Auto-updates when tasks change

## Database Schema (SQLite)

```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'todo', -- 'todo', 'in_progress', 'done', 'archived'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  position INTEGER DEFAULT 0
);

CREATE TABLE action_log (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
  id TEXT PRIMARY KEY DEFAULT 'main',
  content TEXT DEFAULT ''
);
```

## API Routes

- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/[id]` - Update task (status, title, position)
- `DELETE /api/tasks/[id]` - Delete task
- `GET /api/notes` - Get notes
- `PUT /api/notes` - Save notes
- `GET /api/actions` - Get action log (last 50)

## File Structure to Create

```
src/
├── app/
│   ├── page.tsx              # Main dashboard page
│   ├── layout.tsx            # Root layout (update fonts/theme)
│   ├── globals.css           # Already exists, may need tweaks
│   └── api/
│       ├── tasks/
│       │   ├── route.ts      # GET, POST
│       │   └── [id]/
│       │       └── route.ts  # PATCH, DELETE
│       ├── notes/
│       │   └── route.ts      # GET, PUT
│       └── actions/
│           └── route.ts      # GET
├── components/
│   ├── dashboard/
│   │   ├── StatusCard.tsx
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── TaskCard.tsx
│   │   ├── NotesSection.tsx
│   │   └── ActionLog.tsx
│   └── ui/                   # shadcn components (already here)
└── lib/
    ├── db.ts                 # SQLite connection + init
    └── utils.ts              # Already exists
```

## Priority Order
1. Set up database (lib/db.ts)
2. Create API routes
3. Build StatusCard
4. Build KanbanBoard with drag-drop
5. Build NotesSection
6. Build ActionLog
7. Wire everything together in page.tsx
8. Polish styling and animations

## Notes
- Use `crypto.randomUUID()` for IDs
- The dashboard should work fully offline (SQLite is local)
- Make it responsive but desktop-first
- Keep the code clean and well-organized

Go build this! Make it beautiful! 🐻
