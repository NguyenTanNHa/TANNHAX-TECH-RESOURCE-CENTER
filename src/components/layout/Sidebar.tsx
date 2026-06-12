"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Box, HardDrive, FileText, Settings, MessageSquare, Menu, X, AlertTriangle, Barcode } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: <LayoutDashboard size={20} />, external: false },
  { label: "Software", href: "/software", icon: <Box size={20} />, external: false },
  { label: "Drivers", href: "/drivers", icon: <HardDrive size={20} />, external: false },
  { label: "Documents", href: "/documents", icon: <FileText size={20} />, external: false },
  { label: "Feedback", href: "/feedback", icon: <MessageSquare size={20} />, external: false },
  { label: "Common Errors", href: "https://docs.google.com/document/d/18PbOQyQeR0ry3HUUZDZ0VUVkgiHlPKJbdGl2cgLPNCw/edit?tab=t.l6svnk6bv3jf", icon: <AlertTriangle size={20} />, external: true },
  { label: "Scanner Setup", href: "https://docs.google.com/document/d/1fpLRh7TMZju3dCdStFEwEvh_5ByYIFD2MTJhacqvqNs/edit?tab=t.s8hyz5c2k3yc", icon: <Barcode size={20} />, external: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-xl z-40 flex items-center justify-between px-4">
        <h2 className="text-xl font-bold tracking-tighter text-glow text-foreground">
          TanNha<span className="text-primary">X</span>
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-muted/30 text-muted hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`w-64 h-screen fixed left-0 top-0 border-r border-border bg-background/80 backdrop-blur-xl flex flex-col z-50 transition-transform duration-300 transform-gpu will-change-transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 hidden md:block">
          <h2 className="text-2xl font-bold tracking-tighter text-glow text-foreground">
            TanNha<span className="text-primary">X</span>
          </h2>
          <p className="text-xs text-muted mt-1">Tech Resource Center</p>
        </div>

        {/* Mobile Sidebar Header */}
        <div className="p-6 md:hidden flex justify-between items-center border-b border-border/50">
          <div>
            <h2 className="text-2xl font-bold tracking-tighter text-glow text-foreground">
              TanNha<span className="text-primary">X</span>
            </h2>
            <p className="text-xs text-muted mt-1">Tech Resource Center</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 text-muted hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {navItems.map((item) => {
            if (item.external) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative text-muted hover:text-foreground hover:bg-foreground/5"
                >
                  <span className="transition-colors group-hover:text-primary">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </a>
              );
            }

            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${active
                  ? "bg-primary/10 text-foreground border border-primary/20 shadow-[0_0_16px_-4px_rgba(59,130,246,0.3)]"
                  : "text-muted hover:text-foreground hover:bg-foreground/5"
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${active
                  ? "bg-primary/10 text-foreground border border-primary/20"
                  : "text-muted hover:text-foreground hover:bg-foreground/5"
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
    </>
  );
}
