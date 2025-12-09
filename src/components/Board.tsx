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
import { SortableContext, arrayMove, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus, COLUMNS } from '@/types/task';
import { getTasks, saveTasks, getColumnsOrder, saveColumnsOrder } from '@/lib/storage';
import { Column } from './Column';
import SortableColumn from './SortableColumn';
import { AddTaskForm } from './AddTaskForm';
import { AddTaskModal } from './AddTaskModal';
import { EditTaskModal } from './EditTaskModal';
import { TaskCardOverlay } from './TaskCard';
import FullScreenAddTaskModal from './FullScreenAddTaskModal';
import { Search, LayoutGrid, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';

export function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columnsOrder, setColumnsOrder] = useState<string[]>(COLUMNS.map((c) => c.id));
  const [isLoading, setIsLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<TaskStatus | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showFullAdd, setShowFullAdd] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
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
      const storedOrder = getColumnsOrder();
      if (storedOrder && storedOrder.length) setColumnsOrder(storedOrder);
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

  useEffect(() => {
    if (!isLoading) {
      saveColumnsOrder(columnsOrder);
    }
  }, [columnsOrder, isLoading]);

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

  // Keyboard shortcuts: 'n' opens full modal, 'N' (shift) opens quick panel, Escape closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'n' && !e.shiftKey && (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        setShowFullAdd(true);
      }
      if (e.key === 'N' || (e.key === 'n' && e.shiftKey)) {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setShowQuickCreate((s) => !s);
        }
      }
      if (e.key === 'Escape') {
        setShowFullAdd(false);
        setShowQuickCreate(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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

            {/* Search + Theme */}
            <div className="relative w-full sm:w-72 flex items-center gap-3">
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
              <div className="ml-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Board */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={columnsOrder} strategy={horizontalListSortingStrategy}>
            <div className="flex flex-row md:flex-row gap-6 w-full overflow-x-auto pb-8 py-2 items-start">
              {columnsOrder.map((colId) => {
                const column = COLUMNS.find((c) => c.id === colId)!;
                return (
                  <SortableColumn key={column.id} id={column.id}>
                    <div className="min-w-[280px]">
                      <Column
                        title={column.title}
                        tasks={getTasksByStatus(column.id)}
                        status={column.id}
                        onEdit={setEditingTask}
                        onDelete={handleDeleteTask}
                        onAddClick={() => setAddingToColumn(column.id)}
                      />

                      {/* Add Task modal */}
                      {addingToColumn === column.id && (
                        <AddTaskModal
                          status={column.id}
                          onAdd={handleAddTask}
                          onCancel={() => setAddingToColumn(null)}
                        />
                      )}
                    </div>
                  </SortableColumn>
                );
              })}
              {/* Floating Add Task button (quick access) */}
              <div className="flex items-start relative">
                <button
                  onClick={() => setShowFullAdd(true)}
                  className="ml-2 h-10 w-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-0.5"
                  title="Add task"
                  aria-label="Add task (n)"
                >
                  <span className="text-lg font-bold">+</span>
                </button>

                {/* Quick create inline panel */}
                {showQuickCreate && (
                  <div className="absolute left-0 top-12 w-80 z-40">
                    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl p-3 shadow-lg">
                      <AddTaskForm status={columnsOrder[0] as TaskStatus} onAdd={(t) => { handleAddTask(t); setShowQuickCreate(false); }} onCancel={() => setShowQuickCreate(false)} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SortableContext>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeTask && <TaskCardOverlay task={activeTask} />}
          </DragOverlay>
        </DndContext>

          {/* Full-screen Add Task modal (opened by FAB or 'n' shortcut) */}
          {showFullAdd && (
            <FullScreenAddTaskModal
              status={columnsOrder[0] as TaskStatus}
              onAdd={(t: Task) => {
                handleAddTask(t);
                setShowFullAdd(false);
              }}
              onCancel={() => setShowFullAdd(false)}
            />
          )}
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
