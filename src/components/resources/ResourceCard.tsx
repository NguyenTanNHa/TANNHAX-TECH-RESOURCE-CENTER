"use client";

import React, { useState, useRef, useEffect } from "react";
import { Download, File, HardDrive, Box, Eye, X, Lock, Loader2, Copy, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export type ResourceCategory = "software" | "driver" | "document";

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  fileSize: string;
  updatedAt: string;
  downloadUrl: string;
  previewUrl: string;
}

// ─── Highlight matching text ─────────────────────────────────────────────────
const HighlightText = React.memo(({ text, query }: { text: string; query?: string }) => {
  if (!query || !query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/25 text-primary rounded px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
});
HighlightText.displayName = "HighlightText";

// ─── Category helpers ─────────────────────────────────────────────────────────
const getCategoryIcon = (category: ResourceCategory) => {
  switch (category) {
    case "software": return <Box className="text-blue-400" size={24} />;
    case "driver":   return <HardDrive className="text-emerald-400" size={24} />;
    case "document": return <File className="text-amber-400" size={24} />;
  }
};

// ─── PIN Modal ────────────────────────────────────────────────────────────────
const PinModal = ({
  title, action, onConfirm, onClose,
}: {
  title: string; action: "download" | "preview";
  onConfirm: (pin: string) => void; onClose: () => void;
}) => {
  const [pin, setPin] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 transform-gpu"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#18181b] w-full max-w-sm rounded-2xl border border-white/10 shadow-[0_0_60px_-15px_rgba(251,191,36,0.3)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 rounded-xl">
                <Lock className="text-amber-500" size={20} />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Protected Document</p>
                <p className="text-xs text-muted line-clamp-1">{title}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/10 transition-colors">
              <X size={16} />
            </button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (pin.trim()) onConfirm(pin.trim()); }} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-2">
                Enter PIN to {action === "preview" ? "preview" : "download"} this document
              </label>
              <input
                ref={inputRef} type="password" value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-[#09090b] border border-border rounded-xl py-3 px-4 text-white text-center text-lg tracking-[0.5em] placeholder:tracking-normal placeholder:text-base placeholder:text-muted/40 focus:outline-none focus:border-amber-500/50 transition-colors"
                placeholder="••••" maxLength={20} required
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-muted hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
                Cancel
              </button>
              <button type="submit" disabled={!pin.trim()} className="flex-[2] py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white text-sm font-medium transition-all border border-amber-500/20 hover:border-amber-500 disabled:opacity-40 disabled:cursor-not-allowed">
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── Copy Button ──────────────────────────────────────────────────────────────
const CopyButton = ({ url, isProtected }: { url: string; isProtected: boolean }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isProtected) {
      toast.info("Link is protected — unlock the document first.");
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2.5 rounded-xl border border-border hover:bg-white/5 hover:text-white text-muted transition-all flex items-center justify-center"
      title={isProtected ? "Link protected" : "Copy download link"}
    >
      {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
    </button>
  );
};

// ─── Main ResourceCard ────────────────────────────────────────────────────────
export const ResourceCard = React.memo(({ resource, searchQuery }: { resource: ResourceItem; searchQuery?: string }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"download" | "preview">("download");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockedData, setUnlockedData] = useState<{ downloadUrl: string; previewUrl: string } | null>(null);

  const handleAction = (action: "download" | "preview", e: React.MouseEvent) => {
    e.preventDefault();
    if (resource.category === "document") {
      if (unlockedData) {
        if (action === "preview") setIsPreviewOpen(true);
        else window.open(unlockedData.downloadUrl, "_blank", "noopener,noreferrer");
        return;
      }
      setPendingAction(action);
      setIsPinModalOpen(true);
    } else {
      if (action === "preview") setIsPreviewOpen(true);
      else window.open(resource.downloadUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handlePinConfirm = async (pin: string) => {
    setIsPinModalOpen(false);
    setIsUnlocking(true);
    const toastId = toast.loading("Verifying PIN...");
    try {
      const res = await fetch("/api/drive/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, fileId: resource.id }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUnlockedData(data.data);
        toast.success("Unlocked successfully!", { id: toastId });
        if (pendingAction === "preview") setIsPreviewOpen(true);
        else window.open(data.data.downloadUrl, "_blank", "noopener,noreferrer");
      } else {
        toast.error(data.message || "Incorrect PIN!", { id: toastId });
      }
    } catch {
      toast.error("Server connection error. Please try again.", { id: toastId });
    } finally {
      setIsUnlocking(false);
    }
  };

  const isProtected = resource.category === "document" && !unlockedData;

  return (
    <>
      <div className="group relative bg-[#18181b] border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] hover:border-primary/30 flex flex-col h-full transform-gpu will-change-transform">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:bg-primary/10 transition-colors">
            {getCategoryIcon(resource.category)}
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 text-muted border border-border group-hover:text-white transition-colors capitalize">
            {resource.category}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          <HighlightText text={resource.title} query={searchQuery} />
        </h3>

        <p className="text-sm text-muted mb-6 line-clamp-2 flex-grow">
          <HighlightText text={resource.description} query={searchQuery} />
        </p>

        <div className="flex items-center justify-between text-xs text-muted mb-6">
          <span>{resource.fileSize}</span>
          <span>{resource.updatedAt}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-border/50 flex gap-2">
          {resource.category === "document" ? (
            <>
              <button onClick={(e) => handleAction("preview", e)} disabled={isUnlocking}
                className="flex flex-1 items-center justify-center gap-2 bg-white/5 hover:bg-amber-500/10 text-muted hover:text-amber-500 py-2.5 rounded-xl font-medium transition-all duration-300 border border-white/5 hover:border-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed">
                {isUnlocking ? <Loader2 size={18} className="animate-spin" /> : <Eye size={18} />}
                <span>Preview</span>
              </button>
              <button onClick={(e) => handleAction("download", e)} disabled={isUnlocking}
                className="flex-[2] flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white py-2.5 rounded-xl font-medium transition-all duration-300 border border-amber-500/20 hover:border-amber-500 disabled:opacity-40 disabled:cursor-not-allowed">
                {isUnlocking ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                <span>{isUnlocking ? "Unlocking..." : unlockedData ? "Download" : "Unlock"}</span>
              </button>
            </>
          ) : (
            <Link href={resource.downloadUrl} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white py-2.5 rounded-xl font-medium transition-all duration-300 border border-primary/20 hover:border-primary">
              <Download size={18} />
              <span>Download</span>
            </Link>
          )}
          <CopyButton url={unlockedData?.downloadUrl || resource.downloadUrl} isProtected={isProtected} />
        </div>
      </div>

      {isPinModalOpen && (
        <PinModal title={resource.title} action={pendingAction} onConfirm={handlePinConfirm} onClose={() => setIsPinModalOpen(false)} />
      )}

      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10 transform-gpu will-change-transform">
          <div className="bg-[#18181b] w-full max-w-6xl h-full max-h-[90vh] rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 transform-gpu">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#09090b]">
              <h3 className="font-bold text-white flex items-center gap-3">
                {getCategoryIcon(resource.category)}
                <span className="line-clamp-1">{resource.title}</span>
              </h3>
              <div className="flex items-center gap-4">
                <Link href={unlockedData?.downloadUrl || resource.downloadUrl} target="_blank"
                  className="text-sm font-medium text-amber-400 hover:text-amber-300 flex items-center gap-2 transition-colors">
                  <Download size={16} />
                  Download
                </Link>
                <button onClick={() => setIsPreviewOpen(false)}
                  className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg text-muted hover:text-red-400 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-grow bg-[#202124] relative w-full h-full">
              {unlockedData?.previewUrl || resource.previewUrl ? (
                <iframe src={unlockedData?.previewUrl || resource.previewUrl}
                  className="w-full h-full border-none" allow="autoplay"
                  title={`Preview of ${resource.title}`} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/50 gap-4">
                  <File size={48} className="opacity-20" />
                  <p>No preview available for this file.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

ResourceCard.displayName = "ResourceCard";
