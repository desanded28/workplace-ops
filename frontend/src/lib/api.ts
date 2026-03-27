import type { Task, TaskStats, Automation, LogEntry, Integration, WeeklyProgress } from "./types";

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// Tasks
export const getTasks = (filters?: Record<string, string>) => {
  const params = new URLSearchParams(filters || {});
  const qs = params.toString();
  return request<Task[]>(`/api/tasks${qs ? `?${qs}` : ""}`);
};

export const createTask = (data: Partial<Task>) =>
  request<Task>("/api/tasks", { method: "POST", body: JSON.stringify(data) });

export const updateTask = (id: number, data: Partial<Task>) =>
  request<Task>(`/api/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteTask = (id: number) =>
  request<void>(`/api/tasks/${id}`, { method: "DELETE" });

export const getTaskStats = () => request<TaskStats>("/api/tasks/stats");

// Automations
export const getAutomations = () => request<Automation[]>("/api/automations");
export const toggleAutomation = (id: number) =>
  request<Automation>(`/api/automations/${id}/toggle`, { method: "PUT" });
export const getAutomationLog = () => request<LogEntry[]>("/api/automations/log");

// Integrations
export const getIntegrations = () => request<Integration[]>("/api/integrations");
export const testConnection = (tool: string) =>
  request<{ success: boolean; message: string }>(`/api/integrations/${tool}/test`, { method: "POST" });

// Reports
export const getProgress = () => request<WeeklyProgress[]>("/api/reports/progress");
