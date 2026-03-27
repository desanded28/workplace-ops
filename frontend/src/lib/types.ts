export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "backlog" | "in_progress" | "review" | "done";
  assignee: string | null;
  department: string;
  priority: "critical" | "high" | "medium" | "low";
  due_date: string | null;
  blockers: string | null;
  tool: "jira" | "confluence" | "airtable";
  created_at: string;
  updated_at: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  completion_rate: number;
  overdue: number;
  avg_completion_days: number;
  by_department: { department: string; total: number; done: number; rate: number }[];
  by_tool: { tool: string; count: number }[];
}

export interface Automation {
  id: number;
  name: string;
  trigger_event: string;
  action: string;
  enabled: number;
  created_at: string;
}

export interface LogEntry {
  id: number;
  automation_id: number;
  automation_name: string;
  fired_at: string;
  details: string | null;
}

export interface Integration {
  id: number;
  tool: string;
  display_name: string;
  status: "connected" | "disconnected";
  last_sync: string | null;
  items_synced: number;
  icon: string;
}

export interface WeeklyProgress {
  week_label: string;
  week_date: string;
  backlog: number;
  in_progress: number;
  review: number;
  done: number;
}

export type TaskStatus = Task["status"];
export type Priority = Task["priority"];
export type Tool = Task["tool"];
