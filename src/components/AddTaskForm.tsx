// Step 6 — AddTaskForm Component with controlled inputs

import { useState } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { generateId } from '@/lib/storage';
import { X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddTaskFormProps {
  status: TaskStatus;
  onAdd: (task: Task) => void;
  onCancel: () => void;
}

export function AddTaskForm({ status, onAdd, onCancel }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSaving(true);

    // Simulate async save
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      status,
      createdAt: new Date().toISOString(),
    };

    onAdd(newTask);
    setIsSaving(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-all ease-in-out duration-200 animate-scale-in"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground">New Task</h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Title input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className={cn(
              'w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300',
              'transition-all ease-in-out duration-200',
              error ? 'border-destructive' : 'border-gray-200 dark:border-neutral-700'
            )}
            autoFocus
            disabled={isSaving}
          />
          {error && (
            <p className="text-destructive text-xs mt-1">{error}</p>
          )}
        </div>

        {/* Description input */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          className={cn(
            'w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300',
            'transition-all ease-in-out duration-200 resize-none border-gray-200 dark:border-neutral-700'
          )}
          disabled={isSaving}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className={cn(
              'px-3 py-1.5 text-sm rounded-md font-medium transition-all',
              'bg-primary text-primary-foreground hover:bg-primary/90',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center gap-1.5'
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              'Add Task'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
