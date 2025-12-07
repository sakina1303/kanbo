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
        'flex flex-col w-full md:w-80 shrink-0 rounded-xl',
        styles.bg,
        'border border-border/50'
      )}
    >
      {/* Column header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <span className={cn('w-2.5 h-2.5 rounded-full', styles.dot)} />
          <h2 className="font-semibold text-foreground text-sm">{title}</h2>
          <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-background text-muted-foreground text-xs font-medium">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddClick}
          className="p-1.5 rounded-md hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
          aria-label={`Add task to ${title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable area */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 p-3 space-y-3 min-h-[200px] transition-colors duration-200 overflow-y-auto scrollbar-thin',
          isOver && 'bg-primary/5 ring-2 ring-primary/20 ring-inset rounded-b-xl'
        )}
      >
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[150px]">
            <p className="text-muted-foreground/60 text-sm italic">
              No tasks yet
            </p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={task.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TaskCard
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
