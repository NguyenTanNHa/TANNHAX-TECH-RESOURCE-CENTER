import type { Metadata } from "next";
import "@/styles/globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TanNhaX - Tech Resource Center",
  description: "Manage, search, and download technical resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-background text-foreground flex">
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none -z-10" />
          <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto">
            <Breadcrumb />
            {children}
          </div>
        </main>
        <Toaster
          theme="dark"
          position="bottom-right"
          richColors
          toastOptions={{
            style: {
              background: "#18181b",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
