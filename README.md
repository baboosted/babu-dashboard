# 🐻 Babu Dashboard

A beautiful AI assistant dashboard for tracking tasks and projects. Built with Next.js, Tailwind, and shadcn/ui.

![Status](https://img.shields.io/badge/status-MVP-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- **Kanban Board** - Drag & drop tasks between To Do, In Progress, Done, and Archived
- **Status Card** - Visual indicator for assistant status (Online/Thinking/Offline)
- **Notes Section** - Quick notes with auto-save
- **Action Log** - Track all task changes automatically
- **Dark Theme** - Sleek zinc color palette

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS + shadcn/ui
- **Database:** SQLite (better-sqlite3)
- **Drag & Drop:** @hello-pangea/dnd
- **Icons:** Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/[id]` | Update a task |
| DELETE | `/api/tasks/[id]` | Delete a task |
| GET | `/api/notes` | Get notes |
| PUT | `/api/notes` | Save notes |
| GET | `/api/actions` | Get action log |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── layout.tsx            # Root layout
│   └── api/                   # API routes
├── components/
│   ├── dashboard/            # Dashboard components
│   └── ui/                   # shadcn/ui components
└── lib/
    ├── db.ts                 # SQLite connection
    └── types.ts              # TypeScript types
```

## Roadmap

- [ ] Deploy to Vercel (switch to cloud DB)
- [ ] Custom avatar generation
- [ ] Real-time sync
- [ ] Mobile responsive layout
- [ ] Task due dates & priorities

## License

MIT

---

Built with ❤️ by Babu 🐻
