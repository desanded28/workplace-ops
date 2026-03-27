"use client";

import { motion } from "framer-motion";
import type { Integration } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

interface IntegrationCardProps {
  integration: Integration;
  onTest: (tool: string) => void;
  testing?: boolean;
  index?: number;
}

const toolIcons: Record<string, string> = {
  jira: "J",
  confluence: "C",
  airtable: "A",
  figma: "F",
};

const toolBgColors: Record<string, string> = {
  jira: "bg-blue-500/15 text-blue-400",
  confluence: "bg-sky-500/15 text-sky-400",
  airtable: "bg-emerald-500/15 text-emerald-400",
  figma: "bg-pink-500/15 text-pink-400",
};

export function IntegrationCard({ integration, onTest, testing, index = 0 }: IntegrationCardProps) {
  const connected = integration.status === "connected";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="bg-surface border border-border rounded-xl p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[13px] ${
            toolBgColors[integration.tool] || "bg-gray-500/15 text-gray-400"
          }`}
        >
          {toolIcons[integration.tool] || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-medium text-white">{integration.display_name}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-success" : "bg-muted/40"}`} />
            <span className="text-[11px] text-muted">
              {connected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

      {connected && (
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-white/[0.02] rounded-lg">
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider">Items Synced</p>
            <p className="text-[14px] font-semibold text-white mt-0.5">{integration.items_synced}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider">Last Sync</p>
            <p className="text-[14px] font-semibold text-white mt-0.5">
              {integration.last_sync ? timeAgo(integration.last_sync) : "Never"}
            </p>
          </div>
        </div>
      )}

      {!connected && (
        <div className="mb-4 p-3 bg-white/[0.02] rounded-lg">
          <p className="text-[11px] text-muted">Not connected. Test to verify endpoint availability.</p>
        </div>
      )}

      <button
        onClick={() => onTest(integration.tool)}
        disabled={testing}
        className="w-full bg-white/[0.04] hover:bg-white/[0.08] border border-border text-[12px] font-medium text-gray-300 hover:text-white py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        {testing ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 border-2 border-gray-500 border-t-gray-300 rounded-full animate-spin" />
            Testing...
          </span>
        ) : (
          "Test Connection"
        )}
      </button>
    </motion.div>
  );
}
