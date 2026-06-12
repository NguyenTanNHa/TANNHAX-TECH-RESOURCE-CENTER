import type { Metadata } from "next";
import "@/styles/globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PasswordGuard } from "@/components/layout/PasswordGuard";

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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground flex transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PasswordGuard>
            <Sidebar />
            <main className="flex-1 md:ml-64 min-h-screen relative pt-16 md:pt-0">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none -z-10" />
              <div className="p-4 sm:p-8 md:p-12 lg:p-16 max-w-7xl mx-auto">
                <Breadcrumb />
                {children}
              </div>
            </main>
          </PasswordGuard>
          <Toaster
            theme="system"
            position="bottom-right"
            richColors
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
