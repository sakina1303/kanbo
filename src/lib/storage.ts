// Step 2 — Storage logic with safe JSON parsing

import { Task } from '@/types/task';

const STORAGE_KEY = 'kanban-tasks';

/**
 * Retrieves all tasks from localStorage
 */
export function getTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    
    return parsed;
  } catch (error) {
    console.error('Error reading tasks from storage:', error);
    return [];
  }
}

/**
 * Saves all tasks to localStorage
 */
export function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to storage:', error);
  }
}

/**
 * Updates a single task and returns the updated array
 */
export function updateTask(updated: Task): Task[] {
  const tasks = getTasks();
  const updatedTasks = tasks.map((task) =>
    task.id === updated.id ? updated : task
  );
  saveTasks(updatedTasks);
  return updatedTasks;
}

/**
 * Deletes a task by ID and returns the updated array
 */
export function deleteTask(id: string): Task[] {
  const tasks = getTasks();
  const updatedTasks = tasks.filter((task) => task.id !== id);
  saveTasks(updatedTasks);
  return updatedTasks;
}

/**
 * Generates a unique ID for new tasks
 */
export function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
