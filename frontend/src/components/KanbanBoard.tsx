"use client";

import { useState, useCallback } from "react";
import type { Task, TaskStatus } from "@/lib/types";
import { statusLabels } from "@/lib/utils";
import { TaskCard } from "./TaskCard";

const columns: TaskStatus[] = ["backlog", "in_progress", "review", "done"];

const columnAccents: Record<string, string> = {
  backlog: "bg-gray-500",
  in_progress: "bg-blue-500",
  review: "bg-yellow-500",
  done: "bg-green-500",
};

interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onMove: (taskId: number, newStatus: TaskStatus) => void;
}

export function KanbanBoard({ tasks, onEdit, onMove }: KanbanBoardProps) {
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData("text/plain", String(taskId));
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, col: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(col);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverCol(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, status: TaskStatus) => {
      e.preventDefault();
      setDragOverCol(null);
      const taskId = Number(e.dataTransfer.getData("text/plain"));
      if (taskId) onMove(taskId, status);
    },
    [onMove]
  );

  return (
    <div className="grid grid-cols-4 gap-3">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col);
        return (
          <div
            key={col}
            onDragOver={(e) => handleDragOver(e, col)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col)}
            className={`rounded-xl p-2.5 min-h-[420px] transition-colors border ${
              dragOverCol === col
                ? "border-accent/25 bg-accent/[0.02]"
                : "border-transparent bg-white/[0.015]"
            }`}
          >
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className={`w-1.5 h-1.5 rounded-full ${columnAccents[col]}`} />
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                {statusLabels[col]}
              </h3>
              <span className="text-[10px] text-muted ml-auto font-mono">
                {colTasks.length}
              </span>
            </div>

            <div className="space-y-2">
              {colTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onDragStart={handleDragStart}
                />
              ))}
              {colTasks.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <p className="text-[11px] text-muted/50">Drop tasks here</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
