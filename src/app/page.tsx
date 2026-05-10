"use client";

import { useState, useMemo } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { RefreshCw, Box, HardDrive, FileText, Database, Clock, TrendingUp, Lock } from "lucide-react";
import { useDriveResources } from "@/hooks/useDriveResources";
import { useDebounce } from "@/hooks/useDebounce";
import { Pagination } from "@/components/ui/Pagination";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import type { ResourceCategory, ResourceItem } from "@/components/resources/ResourceCard";

const ITEMS_PER_PAGE = 9;

// ─── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({
  label, value, icon, valueColor, iconBg, trend,
}: {
  label: string; value: number; icon: React.ReactNode;
  valueColor: string; iconBg: string; trend?: string;
}) => (
  <div className="group bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-primary/20 hover:shadow-[0_0_24px_-8px_rgba(59,130,246,0.07)] transition-all duration-300">
    <div className={`p-3 rounded-xl ${iconBg} flex-shrink-0`}>{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-muted text-sm font-medium truncate">{label}</p>
      <p className={`text-3xl font-bold tracking-tight ${valueColor}`}>{value}</p>
      {trend && <p className="text-xs text-muted mt-0.5">{trend}</p>}
    </div>
  </div>
);

// ─── CSS Donut Chart ─────────────────────────────────────────────────────────
const DonutChart = ({ data }: { data: { label: string; value: number; color: string; icon: React.ReactNode }[] }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  let angle = 0;
  const segments = data.map((d) => {
    const pct = (d.value / total) * 100;
    const from = angle;
    angle += pct;
    return { ...d, pct, from, to: angle };
  });

  const gradient = segments.map((s) => `${s.color} ${s.from.toFixed(1)}% ${s.to.toFixed(1)}%`).join(", ");

  return (
    <div className="flex items-center gap-8">
      {/* Donut */}
      <div className="relative flex-shrink-0 w-36 h-36" style={{ background: `conic-gradient(${gradient})`, borderRadius: "50%" }}>
        <div className="absolute inset-[22%] rounded-full bg-card flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground leading-none">{total}</span>
          <span className="text-[10px] text-muted mt-0.5">files</span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-col gap-3 flex-1">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-sm text-muted flex-1">{s.label}</span>
            <span className="text-sm font-semibold text-foreground">{s.value}</span>
            <span className="text-xs text-muted w-10 text-right">{s.pct.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Recent Item Row ─────────────────────────────────────────────────────────
const getCategoryMeta = (cat: ResourceCategory) => {
  if (cat === "software") return { icon: <Box size={15} className="text-blue-400" />, bg: "bg-blue-500/10", label: "Software" };
  if (cat === "driver") return { icon: <HardDrive size={15} className="text-emerald-400" />, bg: "bg-emerald-500/10", label: "Driver" };
  return { icon: <FileText size={15} className="text-amber-400" />, bg: "bg-amber-500/10", label: "Document" };
};

const RecentItem = ({ r }: { r: ResourceItem }) => {
  const meta = getCategoryMeta(r.category);
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group">
      <div className={`p-2 rounded-lg ${meta.bg} flex-shrink-0`}>{meta.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">{r.title}</p>
        <p className="text-xs text-muted capitalize">{meta.label} · {r.fileSize}</p>
      </div>
      {r.category === "document" && <Lock size={12} className="text-amber-500/60 flex-shrink-0" />}
      <span className="text-xs text-muted whitespace-nowrap">{r.updatedAt}</span>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { resources, isLoading, error, refetch } = useDriveResources();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const stats = useMemo(() => ({
    total: resources.length,
    software: resources.filter((r) => r.category === "software").length,
    driver: resources.filter((r) => r.category === "driver").length,
    document: resources.filter((r) => r.category === "document").length,
  }), [resources]);

  const recentResources = useMemo(() =>
    [...resources].sort((a, b) => {
      const da = new Date(a.updatedAt).getTime();
      const db = new Date(b.updatedAt).getTime();
      return isNaN(db - da) ? 0 : db - da;
    }).slice(0, 6),
    [resources]
  );

  const chartData = useMemo(() => [
    { label: "Software", value: stats.software, color: "#3b82f6", icon: <Box size={15} /> },
    { label: "Drivers", value: stats.driver, color: "#10b981", icon: <HardDrive size={15} /> },
    { label: "Documents", value: stats.document, color: "#f59e0b", icon: <FileText size={15} /> },
  ].filter((d) => d.value > 0), [stats]);

  const filteredResources = useMemo(() => {
    if (!debouncedSearchQuery) return resources;
    const q = debouncedSearchQuery.toLowerCase();
    return resources.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    );
  }, [resources, debouncedSearchQuery]);

  const [currentPage, setCurrentPage] = useState(1);
  useMemo(() => setCurrentPage(1), [debouncedSearchQuery]);
  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const currentResources = filteredResources.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-8 w-full">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Welcome to TanNha<span className="text-primary">X</span>
          </h1>
          <p className="text-muted text-lg mt-2">Search and download premium software, drivers, and technical documentation.</p>
        </div>
        <button onClick={refetch} disabled={isLoading}
          className="p-3 bg-muted/30 border border-border rounded-xl text-muted hover:text-foreground hover:bg-muted/50 transition-all active:scale-95 disabled:opacity-50 group"
          title="Refresh from Google Drive">
          <RefreshCw size={20} className={isLoading ? "animate-spin text-primary" : "group-hover:rotate-180 transition-transform duration-500"} />
        </button>
      </div>

      {/* Search */}
      <div className="sticky top-0 z-10 py-4 bg-background/80 backdrop-blur-md transform-gpu">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      {/* Stat Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#18181b] border border-border rounded-2xl p-5 h-[88px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Resources" value={stats.total}
            icon={<Database size={22} className="text-foreground" />} valueColor="text-foreground" iconBg="bg-muted/30" trend="All categories" />
          <StatCard label="Software" value={stats.software}
            icon={<Box size={22} className="text-blue-400" />} valueColor="text-blue-400" iconBg="bg-blue-500/10" trend="Apps & tools" />
          <StatCard label="Drivers" value={stats.driver}
            icon={<HardDrive size={22} className="text-emerald-400" />} valueColor="text-emerald-400" iconBg="bg-emerald-500/10" trend="Device drivers" />
          <StatCard label="Documents" value={stats.document}
            icon={<FileText size={22} className="text-amber-400" />} valueColor="text-amber-400" iconBg="bg-amber-500/10" trend="Technical docs" />
        </div>
      )}

      {/* Chart + Recent */}
      {!isLoading && !error && resources.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Donut Chart */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-primary/10 rounded-lg"><TrendingUp size={16} className="text-primary" /></div>
              <h2 className="font-semibold text-foreground">Resource Distribution</h2>
            </div>
            <DonutChart data={chartData} />

            {/* Mini Progress Bars */}
            <div className="mt-6 flex flex-col gap-3 pt-5 border-t border-border/50">
              {chartData.map((d) => (
                <div key={d.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted">{d.label}</span>
                    <span className="text-foreground font-medium">{stats.total > 0 ? ((d.value / stats.total) * 100).toFixed(0) : 0}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${stats.total > 0 ? (d.value / stats.total) * 100 : 0}%`, background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Resources */}
          <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-primary/10 rounded-lg"><Clock size={16} className="text-primary" /></div>
              <h2 className="font-semibold text-foreground">Recently Updated</h2>
              <span className="ml-auto text-xs text-muted bg-muted/30 px-2 py-0.5 rounded-full">{recentResources.length} files</span>
            </div>
            <div className="flex flex-col gap-2">
              {recentResources.map((r) => <RecentItem key={r.id} r={r} />)}
            </div>
          </div>
        </div>
      )}

      {/* Resource Grid */}
      {isLoading ? (
        <SkeletonGrid count={6} />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-red-400 bg-red-400/10 rounded-2xl border border-red-400/20">
          <p className="text-xl font-medium">Lỗi kết nối</p>
          <p className="text-sm mt-2 text-red-400/80 max-w-md text-center">{error}</p>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted">
          <p className="text-xl font-medium">No resources found.</p>
          <p className="text-sm mt-2">Try adjusting your search keywords.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </>
      )}

    </div>
  );
}
