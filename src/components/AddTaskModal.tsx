import React from 'react';
import { AddTaskForm } from './AddTaskForm';
import { TaskStatus } from '@/types/task';

interface AddTaskModalProps {
  status: TaskStatus;
  onAdd: (task: any) => void;
  onCancel: () => void;
}

export function AddTaskModal({ status, onAdd, onCancel }: AddTaskModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 dark:bg-neutral-900/40 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl p-5 shadow-sm hover:shadow-md w-full max-w-lg transition-all ease-in-out duration-200">
        <AddTaskForm status={status} onAdd={onAdd} onCancel={onCancel} />
      </div>
    </div>
  );
}

export default AddTaskModal;
