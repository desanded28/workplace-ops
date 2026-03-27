"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Task, TaskStatus } from "@/lib/types";
import { getTasks, createTask, updateTask, deleteTask } from "@/lib/api";
import { KanbanBoard } from "@/components/KanbanBoard";
import { FilterBar } from "@/components/FilterBar";
import { TaskModal } from "@/components/TaskModal";
import { useToast } from "@/components/Toast";

export default function MigrationPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [modal, setModal] = useState<{ task: Task | null; isNew: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = useCallback(async () => {
    const clean: Record<string, string> = {};
    for (const [k, v] of Object.entries(filters)) {
      if (v) clean[k] = v;
    }
    const data = await getTasks(clean);
    setTasks(data);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const handleMove = async (taskId: number, newStatus: TaskStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      toast("Task moved");
    } catch {
      toast("Failed to move task", "error");
    }
  };

  const handleSave = async (data: Partial<Task>) => {
    try {
      if (modal?.isNew) {
        const created = await createTask(data);
        setTasks((prev) => [...prev, created]);
        toast("Task created");
      } else if (modal?.task) {
        const updated = await updateTask(modal.task.id, data);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        toast("Task updated");
      }
      setModal(null);
    } catch {
      toast("Failed to save task", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setModal(null);
      toast("Task deleted");
    } catch {
      toast("Failed to delete task", "error");
    }
  };

  // Compute per-department progress
  const deptMap = new Map<string, { total: number; done: number }>();
  for (const t of tasks) {
    const d = deptMap.get(t.department) || { total: 0, done: 0 };
    d.total++;
    if (t.status === "done") d.done++;
    deptMap.set(t.department, d);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-muted text-sm">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-xl font-semibold text-white">Migration Tracker</h1>
          <p className="text-[13px] text-muted mt-0.5">
            Drag tasks between columns to update status
          </p>
        </div>
        <button
          onClick={() => setModal({ task: null, isNew: true })}
          className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Task
        </button>
      </motion.div>

      <FilterBar filters={filters} onChange={handleFilterChange} />

      {/* Department progress chips */}
      <div className="flex gap-2.5 overflow-x-auto pb-1">
        {Array.from(deptMap.entries()).map(([dept, { total, done }]) => {
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          return (
            <div key={dept} className="shrink-0 bg-surface border border-border rounded-lg px-3.5 py-2 min-w-[140px]">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] text-gray-400">{dept}</p>
                <span className="text-[10px] text-muted font-mono">{pct}%</span>
              </div>
              <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <KanbanBoard tasks={tasks} onEdit={(t) => setModal({ task: t, isNew: false })} onMove={handleMove} />

      {modal && (
        <TaskModal
          task={modal.task}
          isNew={modal.isNew}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
