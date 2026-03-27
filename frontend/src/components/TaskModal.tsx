"use client";

import { useState, useEffect } from "react";
import type { Task } from "@/lib/types";

interface TaskModalProps {
  task: Task | null;
  isNew: boolean;
  onClose: () => void;
  onSave: (data: Partial<Task>) => void;
  onDelete?: (id: number) => void;
}

export function TaskModal({ task, isNew, onClose, onSave, onDelete }: TaskModalProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "backlog" as Task["status"],
    assignee: "",
    department: "Engineering",
    priority: "medium" as Task["priority"],
    due_date: "",
    blockers: "",
    tool: "jira" as Task["tool"],
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || "",
        status: task.status,
        assignee: task.assignee || "",
        department: task.department,
        priority: task.priority,
        due_date: task.due_date || "",
        blockers: task.blockers || "",
        tool: task.tool,
      });
    }
  }, [task]);

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave({
      ...form,
      description: form.description || null,
      assignee: form.assignee || null,
      due_date: form.due_date || null,
      blockers: form.blockers || null,
    });
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#001a30] border border-border rounded-xl w-full max-w-lg p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-white mb-5">
          {isNew ? "Create Task" : "Edit Task"}
        </h2>

        <div className="space-y-4">
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Task title"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-muted"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              placeholder="Optional description"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-muted resize-none"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white outline-none"
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </Field>

            <Field label="Priority">
              <select
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white outline-none"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </Field>

            <Field label="Department">
              <select
                value={form.department}
                onChange={(e) => set("department", e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white outline-none"
              >
                {["Engineering", "Marketing", "Finance", "HR", "Product", "Operations"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </Field>

            <Field label="Tool">
              <select
                value={form.tool}
                onChange={(e) => set("tool", e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white outline-none"
              >
                <option value="jira">Jira</option>
                <option value="confluence">Confluence</option>
                <option value="airtable">Airtable</option>
              </select>
            </Field>

            <Field label="Assignee">
              <input
                value={form.assignee}
                onChange={(e) => set("assignee", e.target.value)}
                placeholder="Optional"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-muted"
              />
            </Field>

            <Field label="Due Date">
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => set("due_date", e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white outline-none"
              />
            </Field>
          </div>

          <Field label="Blockers">
            <input
              value={form.blockers}
              onChange={(e) => set("blockers", e.target.value)}
              placeholder="Any blockers?"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-muted"
            />
          </Field>
        </div>

        <div className="flex justify-between mt-6">
          <div>
            {!isNew && onDelete && task && (
              <button
                onClick={() => onDelete(task.id)}
                className="px-4 py-2 text-sm text-danger hover:text-red-400 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {isNew ? "Create" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-muted font-medium mb-1 block">{label}</label>
      {children}
    </div>
  );
}
