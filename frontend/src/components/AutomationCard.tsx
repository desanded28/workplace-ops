"use client";

import { motion } from "framer-motion";
import type { Automation } from "@/lib/types";

interface AutomationCardProps {
  automation: Automation;
  onToggle: (id: number) => void;
  index?: number;
}

export function AutomationCard({ automation, onToggle, index = 0 }: AutomationCardProps) {
  const enabled = automation.enabled === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      className="bg-surface border border-border rounded-xl p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-1.5 h-1.5 rounded-full ${enabled ? "bg-success" : "bg-muted/40"}`} />
            <h3 className="text-[13px] font-medium text-white">{automation.name}</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-[10px] text-muted uppercase tracking-wider font-medium mt-0.5 shrink-0 w-12">
                When
              </span>
              <span className="text-[12px] text-gray-300 leading-relaxed">{automation.trigger_event}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[10px] text-muted uppercase tracking-wider font-medium mt-0.5 shrink-0 w-12">
                Then
              </span>
              <span className="text-[12px] text-gray-300 leading-relaxed">{automation.action}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onToggle(automation.id)}
          className={`relative shrink-0 w-9 h-5 rounded-full transition-colors mt-0.5 ${
            enabled ? "bg-accent" : "bg-white/[0.08]"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
              enabled ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </motion.div>
  );
}
