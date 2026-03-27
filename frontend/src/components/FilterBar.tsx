"use client";

interface FilterBarProps {
  filters: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

const departments = ["All", "Engineering", "Marketing", "Finance", "HR", "Product", "Operations"];
const priorities = ["All", "critical", "high", "medium", "low"];
const tools = ["All", "jira", "confluence", "airtable"];

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      <div className="flex items-center gap-1.5 text-muted mr-1">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
        </svg>
        <span className="text-[11px] font-medium">Filters</span>
      </div>
      <Select
        value={filters.department || ""}
        options={departments}
        onChange={(v) => onChange("department", v)}
        placeholder="Department"
      />
      <Select
        value={filters.priority || ""}
        options={priorities}
        onChange={(v) => onChange("priority", v)}
        placeholder="Priority"
      />
      <Select
        value={filters.tool || ""}
        options={tools}
        onChange={(v) => onChange("tool", v)}
        placeholder="Tool"
      />
    </div>
  );
}

function Select({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-surface border border-border rounded-lg px-2.5 py-1.5 text-[12px] text-gray-300 outline-none cursor-pointer hover:border-white/[0.12] transition-colors"
    >
      {options.map((o) => (
        <option key={o} value={o === "All" ? "" : o}>
          {o === "All" ? placeholder : o.charAt(0).toUpperCase() + o.slice(1)}
        </option>
      ))}
    </select>
  );
}
