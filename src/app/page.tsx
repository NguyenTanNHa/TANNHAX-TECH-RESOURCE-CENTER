"use client";

import { useState, useMemo } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { RefreshCw } from "lucide-react";
import { useDriveResources } from "@/hooks/useDriveResources";
import { useDebounce } from "@/hooks/useDebounce";
import { Pagination } from "@/components/ui/Pagination";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import type { ResourceCategory, ResourceItem } from "@/components/resources/ResourceCard";

const ITEMS_PER_PAGE = 9;


// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { resources, isLoading, error, refetch } = useDriveResources();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);



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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Welcome to TanNha<span className="text-primary">X</span>
          </h1>
          <p className="text-muted text-base sm:text-lg mt-2">Search and download premium software, drivers, and technical documentation.</p>
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
