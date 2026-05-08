"use client";

import { useState, useMemo } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { RefreshCw, FileText } from "lucide-react";
import { useDriveResources } from "@/hooks/useDriveResources";
import { useDebounce } from "@/hooks/useDebounce";
import { Pagination } from "@/components/ui/Pagination";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import { SortFilterBar, SortFilterState } from "@/components/ui/SortFilterBar";
import { ResourceItem } from "@/components/resources/ResourceCard";

const ITEMS_PER_PAGE = 9;

function sortResources(list: ResourceItem[], { sortKey, sortDir }: SortFilterState) {
  return [...list].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "title") cmp = a.title.localeCompare(b.title);
    else if (sortKey === "updatedAt") cmp = a.updatedAt.localeCompare(b.updatedAt);
    else if (sortKey === "fileSize") cmp = a.fileSize.localeCompare(b.fileSize);
    return sortDir === "asc" ? cmp : -cmp;
  });
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortFilter, setSortFilter] = useState<SortFilterState>({ sortKey: "title", sortDir: "asc" });
  const { resources, isLoading, error, refetch } = useDriveResources();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const baseResources = useMemo(() => resources.filter(r => r.category === "document"), [resources]);

  const filteredResources = useMemo(() => {
    let result = baseResources;
    if (debouncedSearchQuery) {
      const q = debouncedSearchQuery.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      );
    }
    return sortResources(result, sortFilter);
  }, [baseResources, debouncedSearchQuery, sortFilter]);

  const [currentPage, setCurrentPage] = useState(1);
  useMemo(() => setCurrentPage(1), [debouncedSearchQuery, sortFilter]);
  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const currentResources = filteredResources.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <FileText className="text-amber-500" size={32} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">Documents</h1>
          </div>
          <p className="text-muted text-lg max-w-2xl">
            Technical manuals, user guides and documentation (password-protected).
          </p>
        </div>
        <button onClick={refetch} disabled={isLoading}
          className="p-3 bg-white/5 border border-white/10 rounded-xl text-muted hover:text-white hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 group"
          title="Force refresh data from Google Drive">
          <RefreshCw size={20} className={isLoading ? "animate-spin text-primary" : "group-hover:rotate-180 transition-transform duration-500"} />
        </button>
      </div>

      <div className="sticky top-0 z-10 py-4 bg-background/80 backdrop-blur-md transform-gpu">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      {!isLoading && !error && (
        <SortFilterBar
          totalCount={baseResources.length}
          filteredCount={filteredResources.length}
          value={sortFilter}
          onChange={setSortFilter}
        />
      )}

      {isLoading ? (
        <SkeletonGrid count={6} />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-red-400 bg-red-400/10 rounded-2xl border border-red-400/20">
          <p className="text-xl font-medium">Connection Error</p>
          <p className="text-sm mt-2 text-red-400/80 max-w-md text-center">{error}</p>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted">
          <p className="text-xl font-medium">No documents found.</p>
          <p className="text-sm mt-2">Try adjusting your search or sort options.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} searchQuery={debouncedSearchQuery} />
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
