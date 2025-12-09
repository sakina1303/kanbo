import React from 'react';
import { AddTaskForm } from './AddTaskForm';
import { TaskStatus } from '@/types/task';

interface Props {
  status: TaskStatus;
  onAdd: (task: any) => void;
  onCancel: () => void;
}

export function FullScreenAddTaskModal({ status, onAdd, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-semibold mb-2 text-foreground">Create a new task</h2>
        <p className="text-sm text-muted-foreground mb-4">Quickly add a task to your board. Press <kbd className="px-2 py-0.5 rounded bg-muted text-xs">Esc</kbd> to close.</p>
        <AddTaskForm status={status} onAdd={onAdd} onCancel={onCancel} />
      </div>
    </div>
  );
}

export default FullScreenAddTaskModal;
