"use client";

import React from "react";

export const SkeletonCard = () => (
  <div className="group relative bg-card border border-border rounded-2xl p-6 flex flex-col h-full animate-pulse">
    {/* Header row: icon + badge */}
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-muted/30" />
      <div className="w-16 h-6 rounded-full bg-muted/30" />
    </div>

    {/* Title */}
    <div className="h-6 w-3/4 rounded-lg bg-muted/30 mb-3" />

    {/* Description lines */}
    <div className="flex flex-col gap-2 mb-6 flex-grow">
      <div className="h-4 w-full rounded-lg bg-muted/30" />
      <div className="h-4 w-5/6 rounded-lg bg-muted/30" />
    </div>

    {/* Meta: size + date */}
    <div className="flex items-center justify-between mb-6">
      <div className="h-4 w-20 rounded-lg bg-muted/30" />
      <div className="h-4 w-24 rounded-lg bg-muted/30" />
    </div>

    {/* Action buttons */}
    <div className="pt-4 border-t border-border/50 flex gap-3">
      <div className="flex-1 h-10 rounded-xl bg-muted/30" />
      <div className="w-10 h-10 rounded-xl bg-muted/30" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
