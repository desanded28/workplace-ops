"use client";

import { motion } from "framer-motion";

interface StatsCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: boolean;
  icon?: React.ReactNode;
  index?: number;
}

export function StatsCard({ label, value, subtitle, accent, icon, index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="bg-surface border border-border rounded-xl p-5 relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-muted font-medium uppercase tracking-wider">{label}</p>
          <p className={`text-[28px] font-semibold mt-1 leading-none ${accent ? "text-accent" : "text-white"}`}>
            {value}
          </p>
          {subtitle && <p className="text-[11px] text-muted mt-1.5">{subtitle}</p>}
        </div>
        {icon && (
          <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center text-muted">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
