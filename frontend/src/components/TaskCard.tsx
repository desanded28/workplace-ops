"use client";

import type { Task } from "@/lib/types";
import { priorityColors, toolColors, isOverdue, formatDate } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDragStart: (e: React.DragEvent, taskId: number) => void;
}

export function TaskCard({ task, onEdit, onDragStart }: TaskCardProps) {
  const overdue = isOverdue(task.due_date, task.status);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onEdit(task)}
      className="bg-[#00111f] border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:bg-[#001528] hover:border-white/[0.12] transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h4 className="text-[12px] font-medium text-white leading-snug">{task.title}</h4>
        <span
          className={`shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-[11px] text-muted mb-2 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${toolColors[task.tool]}`}>
          {task.tool}
        </span>
        {task.assignee && (
          <>
            <span className="text-[9px] text-muted">·</span>
            <span className="text-[10px] text-gray-400">{task.assignee.split(" ")[0]}</span>
          </>
        )}
      </div>

      {task.due_date && (
        <div className={`mt-2 text-[10px] flex items-center gap-1 ${overdue ? "text-danger" : "text-muted"}`}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatDate(task.due_date)}
        </div>
      )}

      {task.blockers && (
        <div className="mt-1.5 text-[10px] text-warning flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {task.blockers}
        </div>
      )}
    </div>
  );
}
