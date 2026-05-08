"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Box, HardDrive, FileText, Settings, MessageSquare } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: <LayoutDashboard size={20} /> },
  { label: "Software", href: "/software", icon: <Box size={20} /> },
  { label: "Drivers", href: "/drivers", icon: <HardDrive size={20} /> },
  { label: "Documents", href: "/documents", icon: <FileText size={20} /> },
  { label: "Feedback", href: "/feedback", icon: <MessageSquare size={20} /> },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 border-r border-border bg-[#09090b]/80 backdrop-blur-xl flex flex-col z-40 transition-all duration-300 transform-gpu will-change-transform">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tighter text-glow text-white">
          TanNha<span className="text-primary">X</span>
        </h2>
        <p className="text-xs text-muted mt-1">Tech Resource Center</p>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                active
                  ? "bg-primary/10 text-white border border-primary/20 shadow-[0_0_16px_-4px_rgba(59,130,246,0.3)]"
                  : "text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              {/* Active left accent bar */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />
              )}
              <span className={`transition-colors ${active ? "text-primary" : "group-hover:text-primary"}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        {(() => {
          const active = pathname === "/settings";
          return (
            <Link
              href="/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                active
                  ? "bg-primary/10 text-white border border-primary/20"
                  : "text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />
              )}
              <span className={`transition-colors ${active ? "text-primary" : "group-hover:text-primary"}`}>
                <Settings size={20} />
              </span>
              <span className="font-medium">Settings</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })()}
      </div>
    </aside>
  );
}
