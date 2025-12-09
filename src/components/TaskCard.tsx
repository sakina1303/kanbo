// Step 5 — TaskCard Component with drag functionality

import React, { useState, MouseEvent } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types/task';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';

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

  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  function handleMouseDown(e: MouseEvent<HTMLDivElement>) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r, { x, y, id }]);
    setTimeout(() => setRipples((r) => r.filter((rr) => rr.id !== id)), 450);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseDown={handleMouseDown}
      tabIndex={0}
      className={`relative group bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg p-4 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all ease-in-out duration-200 transform-gpu will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
        isDragging ? 'scale-[1.02] shadow-lg ring-1 ring-blue-200' : ''
      }`}
      role="article"
      aria-label={task.title}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute left-3 top-3 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 z-10"
        aria-label="Drag task"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="ml-6">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{task.title}</h3>
        {task.description && (
          <p className="line-clamp-1 text-gray-500 dark:text-gray-300 text-xs mt-1">{task.description}</p>
        )}
      </div>

      <div className="absolute right-3 top-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Edit task"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            // ask for confirmation before deleting
            // eslint-disable-next-line no-alert
            if (window.confirm('Are you sure you want to delete this task?')) {
              onDelete(task.id);
            }
          }}
          className="p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-500 hover:text-red-600 transition-colors"
          aria-label="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
        {ripples.map((r) => (
          <span
            key={r.id}
            style={{ left: r.x, top: r.y }}
            className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-blue-300/60 rounded-full animate-ripple"
          />
        ))}
      </div>

      <style jsx>{`\n        .animate-ripple { animation: ripple 450ms ease-out forwards; }\n        @keyframes ripple { from { transform: scale(0.3); opacity: 0.6 } to { transform: scale(12); opacity: 0 } }\n      `}</style>
    </div>
  );
}

export function TaskCardOverlay({ task }: { task: Task }) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg p-3 shadow-2xl max-w-[320px] transform-gpu scale-105 motion-reduce:transform-none transition-all duration-200 ease-in-out opacity-95">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{task.title}</div>
        <div className="line-clamp-2 text-gray-500 dark:text-gray-300 text-xs mt-1">{task.description}</div>
      </div>
    </div>
  );
}
