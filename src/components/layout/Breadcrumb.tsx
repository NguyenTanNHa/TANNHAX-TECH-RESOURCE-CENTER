"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const routeLabels: Record<string, string> = {
  software: "Software",
  drivers: "Drivers",
  documents: "Documents",
  feedback: "Feedback",
  settings: "Settings",
};

export function Breadcrumb() {
  const pathname = usePathname();

  // Don't render on dashboard root
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 text-sm mb-6">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-muted hover:text-white transition-colors"
      >
        <Home size={14} />
        <span>Dashboard</span>
      </Link>
      {segments.map((segment, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
        const isLast = i === segments.length - 1;
        return (
          <span key={href} className="flex items-center gap-1.5">
            <ChevronRight size={14} className="text-muted/50" />
            {isLast ? (
              <span className="text-white font-medium">{label}</span>
            ) : (
              <Link href={href} className="text-muted hover:text-white transition-colors">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
