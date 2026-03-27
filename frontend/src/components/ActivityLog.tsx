"use client";

import { motion } from "framer-motion";
import type { LogEntry } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export function ActivityLog({ entries }: { entries: LogEntry[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      className="bg-surface border border-border rounded-xl overflow-hidden"
    >
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
        <h3 className="text-[13px] font-medium text-white">Recent Activity</h3>
        <span className="text-[10px] text-muted">{entries.length} events</span>
      </div>
      <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
        {entries.map((entry, i) => (
          <div key={entry.id} className="px-5 py-3 flex items-start gap-3 hover:bg-white/[0.01] transition-colors">
            <div className="relative mt-1.5 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              {i < entries.length - 1 && (
                <div className="absolute top-2.5 left-[2.5px] w-px h-[calc(100%+8px)] bg-border" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-gray-300 leading-relaxed">
                <span className="font-medium text-white">{entry.automation_name}</span>
                {entry.details && (
                  <span className="text-muted"> — {entry.details}</span>
                )}
              </p>
              <p className="text-[10px] text-muted mt-0.5">{timeAgo(entry.fired_at)}</p>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-[12px] text-muted text-center py-8">No activity yet</p>
        )}
      </div>
    </motion.div>
  );
}
