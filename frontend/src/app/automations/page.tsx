"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Automation, LogEntry } from "@/lib/types";
import { getAutomations, toggleAutomation, getAutomationLog } from "@/lib/api";
import { AutomationCard } from "@/components/AutomationCard";
import { ActivityLog } from "@/components/ActivityLog";
import { useToast } from "@/components/Toast";

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([getAutomations(), getAutomationLog()])
      .then(([a, l]) => {
        setAutomations(a);
        setLog(l);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id: number) => {
    try {
      const updated = await toggleAutomation(id);
      setAutomations((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      toast(updated.enabled ? "Automation enabled" : "Automation disabled");
    } catch {
      toast("Failed to toggle automation", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-muted text-sm">Loading automations...</p>
        </div>
      </div>
    );
  }

  const enabled = automations.filter((a) => a.enabled === 1).length;

  return (
    <div className="space-y-6 max-w-[1200px]">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-xl font-semibold text-white">Automations</h1>
          <p className="text-[13px] text-muted mt-0.5">
            Workflow rules that trigger actions across connected tools
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-muted">Active Rules</p>
          <p className="text-lg font-semibold text-white">{enabled}/{automations.length}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {automations.map((a, i) => (
          <AutomationCard key={a.id} automation={a} onToggle={handleToggle} index={i} />
        ))}
      </div>

      <ActivityLog entries={log} />
    </div>
  );
}
