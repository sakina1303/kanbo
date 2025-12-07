// Step 5 — TaskCard Component with drag functionality

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types/task';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isDragOverlay?: boolean;
}

export function TaskCard({ task, onEdit, onDelete, isDragOverlay }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: task,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative bg-card rounded-lg border border-border p-4 transition-all duration-200',
        'hover:shadow-card-hover hover:border-primary/20',
        isDragging && 'opacity-50 shadow-lg scale-[1.02]',
        isDragOverlay && 'shadow-2xl rotate-2 scale-105 border-primary/30'
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        aria-label="Drag task"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="pl-5">
        {/* Title */}
        <h3 className="font-medium text-foreground text-sm leading-snug mb-1 pr-16">
          {task.title}
        </h3>

        {/* Description (truncated) */}
        {task.description && (
          <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Created date */}
        <p className="text-muted-foreground/60 text-[10px] mt-2">
          {new Date(task.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Action buttons */}
      <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Edit task"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Delete task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// Overlay version for drag preview
export function TaskCardOverlay({ task }: { task: Task }) {
  return (
    <div className="bg-card rounded-lg border border-primary/30 p-4 shadow-2xl rotate-2 scale-105 max-w-[280px]">
      <div className="pl-5">
        <h3 className="font-medium text-foreground text-sm leading-snug mb-1">
          {task.title}
        </h3>
        {task.description && (
          <p className="text-muted-foreground text-xs line-clamp-2">
            {task.description}
          </p>
        )}
      </div>
    </div>
  );
}
