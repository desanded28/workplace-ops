"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Integration } from "@/lib/types";
import { getIntegrations, testConnection } from "@/lib/api";
import { IntegrationCard } from "@/components/IntegrationCard";
import { useToast } from "@/components/Toast";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    getIntegrations()
      .then(setIntegrations)
      .finally(() => setLoading(false));
  }, []);

  const handleTest = async (tool: string) => {
    setTesting(tool);
    try {
      const result = await testConnection(tool);
      toast(result.message, result.success ? "success" : "error");
    } catch {
      toast("Connection test failed", "error");
    }
    setTesting(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-muted text-sm">Loading integrations...</p>
        </div>
      </div>
    );
  }

  const connected = integrations.filter((i) => i.status === "connected").length;

  return (
    <div className="space-y-6 max-w-[1200px]">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-xl font-semibold text-white">Integrations</h1>
          <p className="text-[13px] text-muted mt-0.5">
            Connected tools and sync status
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-muted">Connected</p>
          <p className="text-lg font-semibold text-white">{connected}/{integrations.length}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {integrations.map((integration, i) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onTest={handleTest}
            testing={testing === integration.tool}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
