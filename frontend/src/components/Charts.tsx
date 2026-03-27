"use client";

import { motion } from "framer-motion";
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLine,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "#001020",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    fontSize: 12,
    color: "#ededed",
    padding: "8px 12px",
  },
  itemStyle: { color: "#ededed" },
  cursor: { fill: "rgba(255,255,255,0.02)" },
};

const AXIS = {
  tick: { fontSize: 10, fill: "#475569" },
  axisLine: false as const,
  tickLine: false as const,
};

function ChartCard({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="bg-surface border border-border rounded-xl p-5"
    >
      <h3 className="text-[13px] font-medium text-white mb-4">{title}</h3>
      {children}
    </motion.div>
  );
}

// Department bar chart
export function DeptBarChart({
  data,
}: {
  data: { department: string; total: number; done: number }[];
}) {
  return (
    <ChartCard title="Tasks by Department" delay={0.2}>
      <ResponsiveContainer width="100%" height={220}>
        <RechartsBar data={data} barGap={2} barSize={14}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis dataKey="department" {...AXIS} />
          <YAxis {...AXIS} width={30} />
          <Tooltip {...TOOLTIP_STYLE} />
          <Bar dataKey="total" fill="#1e3a5f" radius={[3, 3, 0, 0]} name="Total" />
          <Bar dataKey="done" fill="#db0a40" radius={[3, 3, 0, 0]} name="Done" />
        </RechartsBar>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// Weekly progress line chart
export function ProgressLineChart({
  data,
}: {
  data: { week_label: string; backlog: number; in_progress: number; review: number; done: number }[];
}) {
  return (
    <ChartCard title="Weekly Progress" delay={0.3}>
      <ResponsiveContainer width="100%" height={220}>
        <RechartsLine data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis dataKey="week_label" {...AXIS} />
          <YAxis {...AXIS} width={30} />
          <Tooltip {...TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontSize: 10, color: "#64748b", paddingTop: 8 }} />
          <Line type="monotone" dataKey="done" stroke="#db0a40" strokeWidth={2} dot={false} name="Done" />
          <Line type="monotone" dataKey="in_progress" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="In Progress" />
          <Line type="monotone" dataKey="review" stroke="#eab308" strokeWidth={1.5} dot={false} name="Review" />
          <Line type="monotone" dataKey="backlog" stroke="#475569" strokeWidth={1} dot={false} strokeDasharray="4 4" name="Backlog" />
        </RechartsLine>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// Tool distribution — custom horizontal bars instead of pie (cleaner)
export function ToolDistribution({
  data,
}: {
  data: { tool: string; count: number }[];
}) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const colors: Record<string, string> = {
    jira: "#3b82f6",
    confluence: "#0ea5e9",
    airtable: "#10b981",
  };

  return (
    <ChartCard title="Tasks by Tool" delay={0.4}>
      <div className="space-y-4 mt-2">
        {data.map((d) => {
          const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
          return (
            <div key={d.tool}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: colors[d.tool] || "#64748b" }} />
                  <span className="text-[12px] text-gray-300 capitalize">{d.tool}</span>
                </div>
                <span className="text-[12px] text-muted font-mono">{d.count} ({pct}%)</span>
              </div>
              <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: colors[d.tool] || "#64748b" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}

// Department progress bars
export function DeptProgress({
  data,
}: {
  data: { department: string; total: number; done: number; rate: number }[];
}) {
  return (
    <ChartCard title="Completion by Department" delay={0.5}>
      <div className="space-y-3.5">
        {data.map((d, i) => (
          <div key={d.department}>
            <div className="flex justify-between text-[11px] mb-1.5">
              <span className="text-gray-300">{d.department}</span>
              <span className="text-muted font-mono">
                {d.done}/{d.total} · {d.rate}%
              </span>
            </div>
            <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.rate}%` }}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.05, ease: "easeOut" }}
                className="h-full bg-accent rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
