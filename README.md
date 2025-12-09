# Kanbo

Kanbo — a beautiful, responsive Kanban-style task management board built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Multiple Columns**: Organize tasks across "To Do", "In Progress", and "Done" columns
- **Drag & Drop**: Smooth drag-and-drop functionality using dnd-kit
- **CRUD Operations**: Create, read, update, and delete tasks
- **Persistent Storage**: Tasks are saved to localStorage and persist after page reload
- **Search**: Filter tasks by title or description
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Smooth Animations**: Elegant transitions and loading states
- **Empty States**: Helpful messages when columns are empty

## 🛠 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **dnd-kit** - Drag and drop functionality
- **Lucide React** - Icons

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd kanban-task-board

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚀 Running Locally

1. Ensure you have Node.js 18+ installed
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open `http://localhost:8080` in your browser

## 📁 Project Structure

```
src/
├── components/
│   ├── Board.tsx        # Main board with DnD context
│   ├── Column.tsx       # Droppable column component
│   ├── TaskCard.tsx     # Draggable task card
│   ├── AddTaskForm.tsx  # Form to add new tasks
│   └── EditTaskModal.tsx # Modal to edit existing tasks
├── lib/
│   └── storage.ts       # localStorage utilities
├── types/
│   └── task.ts          # TypeScript interfaces
└── pages/
    └── Index.tsx        # Main page
```

## 🌐 Deployment (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will auto-detect Vite and configure the build
4. Deploy!

Or use the Lovable publish feature by clicking "Share" → "Publish".

## ⚠️ Known Issues

- Drag preview may flicker briefly on slow devices
- Search clears when adding a new task (by design)

## 🤖 AI Assistance

This project was built with assistance from Lovable AI, an AI-powered development platform. The AI helped with:

- Component architecture and structure
- TypeScript type definitions
- Drag-and-drop implementation with dnd-kit
- Styling with Tailwind CSS
- localStorage persistence logic

## 📝 License

MIT License - feel free to use this project as you wish!
