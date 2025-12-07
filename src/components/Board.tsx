// Step 3 & 7 — Main Board Component with DnD Context

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { Task, TaskStatus, COLUMNS } from '@/types/task';
import { getTasks, saveTasks } from '@/lib/storage';
import { Column } from './Column';
import { AddTaskForm } from './AddTaskForm';
import { EditTaskModal } from './EditTaskModal';
import { TaskCardOverlay } from './TaskCard';
import { Search, LayoutGrid, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<TaskStatus | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Configure drag sensor with activation constraint
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading
      const storedTasks = getTasks();
      setTasks(storedTasks);
      setIsLoading(false);
    };
    loadTasks();
  }, []);

  // Persist tasks when updated
  useEffect(() => {
    if (!isLoading) {
      saveTasks(tasks);
    }
  }, [tasks, isLoading]);

  // Filter tasks by search query
  const filteredTasks = searchQuery
    ? tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tasks;

  // Get tasks for a specific column
  const getTasksByStatus = (status: TaskStatus) =>
    filteredTasks.filter((task) => task.status === status);

  // Handle adding a new task
  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
    setAddingToColumn(null);
  };

  // Handle editing a task
  const handleEditTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditingTask(null);
  };

  // Handle deleting a task
  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  // Handle drag end - update task status
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    // Only update if dropped on a valid column
    if (COLUMNS.some((col) => col.id === newStatus)) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Task Board</h1>
                <p className="text-muted-foreground text-sm">
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className={cn(
                  'w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-input bg-background text-foreground',
                  'placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                  'transition-colors'
                )}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Board */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 overflow-x-auto pb-4">
            {COLUMNS.map((column) => (
              <div key={column.id} className="flex flex-col gap-3">
                <Column
                  title={column.title}
                  tasks={getTasksByStatus(column.id)}
                  status={column.id}
                  onEdit={setEditingTask}
                  onDelete={handleDeleteTask}
                  onAddClick={() => setAddingToColumn(column.id)}
                />
                
                {/* Add task form for this column */}
                {addingToColumn === column.id && (
                  <div className="w-full md:w-80 px-3">
                    <AddTaskForm
                      status={column.id}
                      onAdd={handleAddTask}
                      onCancel={() => setAddingToColumn(null)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeTask && <TaskCardOverlay task={activeTask} />}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Edit Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={handleEditTask}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
