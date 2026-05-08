"use client";

import { ArrowUpDown, ArrowUp, ArrowDown, Filter } from "lucide-react";
import { useState } from "react";

export type SortKey = "title" | "fileSize" | "updatedAt";
export type SortDir = "asc" | "desc";

export interface SortFilterState {
  sortKey: SortKey;
  sortDir: SortDir;
}

interface SortFilterBarProps {
  totalCount: number;
  filteredCount: number;
  value: SortFilterState;
  onChange: (v: SortFilterState) => void;
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "title", label: "Name" },
  { key: "updatedAt", label: "Date" },
  { key: "fileSize", label: "Size" },
];

export function SortFilterBar({ totalCount, filteredCount, value, onChange }: SortFilterBarProps) {
  const toggleSort = (key: SortKey) => {
    if (value.sortKey === key) {
      onChange({ ...value, sortDir: value.sortDir === "asc" ? "desc" : "asc" });
    } else {
      onChange({ sortKey: key, sortDir: "asc" });
    }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (value.sortKey !== k) return <ArrowUpDown size={14} className="opacity-40" />;
    return value.sortDir === "asc"
      ? <ArrowUp size={14} className="text-primary" />
      : <ArrowDown size={14} className="text-primary" />;
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Result count */}
      <span className="text-sm text-muted">
        <span className="text-white font-medium">{filteredCount}</span>
        {filteredCount !== totalCount && <span> of {totalCount}</span>}
        <span> results</span>
      </span>

      <div className="h-4 w-px bg-border" />

      {/* Sort buttons */}
      <div className="flex items-center gap-1">
        <Filter size={14} className="text-muted mr-1" />
        <span className="text-xs text-muted mr-2">Sort:</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => toggleSort(opt.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              value.sortKey === opt.key
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-white/5 text-muted hover:text-white border-transparent hover:border-border"
            }`}
          >
            {opt.label}
            <SortIcon k={opt.key} />
          </button>
        ))}
      </div>
    </div>
  );
}
