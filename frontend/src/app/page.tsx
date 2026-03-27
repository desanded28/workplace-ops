"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { TaskStats, WeeklyProgress } from "@/lib/types";
import { getTaskStats, getProgress } from "@/lib/api";
import { StatsCard } from "@/components/StatsCard";
import { DeptBarChart, ProgressLineChart, ToolDistribution, DeptProgress } from "@/components/Charts";

function ClipboardIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [progress, setProgress] = useState<WeeklyProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTaskStats(), getProgress()])
      .then(([s, p]) => {
        setStats(s);
        setProgress(p);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-muted text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 max-w-[1200px]">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <p className="text-[13px] text-muted mt-0.5">
          Jira Cloud migration overview and department progress
        </p>
      </motion.div>

      <div className="grid grid-cols-4 gap-3">
        <StatsCard label="Total Tasks" value={stats.total} icon={<ClipboardIcon />} index={0} />
        <StatsCard label="Completion Rate" value={`${stats.completion_rate}%`} accent icon={<TrendUpIcon />} index={1} />
        <StatsCard
          label="Overdue"
          value={stats.overdue}
          subtitle={stats.overdue > 0 ? "Needs attention" : "All on track"}
          icon={<AlertIcon />}
          index={2}
        />
        <StatsCard
          label="Avg Completion"
          value={`${stats.avg_completion_days}d`}
          subtitle="Days to complete"
          icon={<ClockIcon />}
          index={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DeptBarChart data={stats.by_department} />
        <ProgressLineChart data={progress} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ToolDistribution data={stats.by_tool} />
        <DeptProgress data={stats.by_department} />
      </div>
    </div>
  );
}
