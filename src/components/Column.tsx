// Step 4 — Column Component with droppable area

import { useDroppable } from '@dnd-kit/core';
import { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface ColumnProps {
  title: string;
  tasks: Task[];
  status: TaskStatus;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

const statusStyles: Record<TaskStatus, { dot: string; bg: string }> = {
  'todo': { dot: 'bg-status-todo', bg: 'bg-status-todo-bg' },
  'in-progress': { dot: 'bg-status-progress', bg: 'bg-status-progress-bg' },
  'done': { dot: 'bg-status-done', bg: 'bg-status-done-bg' },
};

export function Column({ title, tasks, status, onEdit, onDelete, onAddClick }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const styles = statusStyles[status];

  return (
    <div
      className={cn(
        'flex flex-col w-full md:w-80 shrink-0 rounded-xl transition-all duration-200 bg-gray-50 dark:bg-neutral-900',
        'border border-gray-200 dark:border-neutral-700',
        'shadow-sm hover:shadow-md'
      )}
    >
      {/* Column header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/30">
        <div className="flex items-center gap-2.5">
          <span className={cn('w-2.5 h-2.5 rounded-full', styles.dot)} />
          <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
          <span className="flex items-center justify-center min-w-[26px] h-6 px-2 rounded-full bg-white dark:bg-neutral-800 text-gray-500 text-xs font-medium border border-gray-100 dark:border-neutral-700">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddClick}
          className="p-1.5 rounded-md hover:bg-background text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          aria-label={`Add task to ${title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable area */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 p-4 space-y-4 min-h-[200px] transition-colors duration-200 overflow-y-auto scrollbar-thin',
          isOver && 'bg-primary/5 ring-2 ring-primary/20 ring-inset rounded-b-xl',
          !isOver && 'rounded-b-xl'
        )}
        tabIndex={0}
      >
        {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[150px] gap-3 text-center px-2">
              {/* Simple SVG empty state per column */}
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
                <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" className="text-muted-foreground" />
                <circle cx="8.5" cy="12" r="1" fill="currentColor" className="text-muted-foreground" />
                <rect x="11" y="11" width="6" height="1.5" rx="0.5" fill="currentColor" className="text-muted-foreground" />
              </svg>
              <p className="text-muted-foreground/70 text-sm italic">
                No tasks yet
              </p>
              <p className="text-xs text-muted-foreground/50">Click + to add your first task</p>
            </div>
        ) : (
          tasks.map((task, index) => (
              <div key={task.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
              </div>
          ))
        )}
      </div>
    </div>
  );
}
