import Link from "next/link";
import { LayoutDashboard, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="p-6 bg-primary/10 rounded-full mb-8">
        <Compass className="text-primary w-16 h-16" />
      </div>
      
      <h2 className="text-4xl font-bold tracking-tight text-white mb-4">
        Tính năng đang được phát triển
      </h2>
      
      <p className="text-muted text-lg max-w-lg mx-auto mb-10">
        Bạn đã truy cập vào một trang hoặc tính năng chưa hoàn thiện. Chúng tôi đang nỗ lực cập nhật để mang đến trải nghiệm tốt nhất!
      </p>

      <Link
        href="/"
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-medium transition-all shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]"
      >
        <LayoutDashboard size={20} />
        <span>Quay về Trang Chủ</span>
      </Link>
    </div>
  );
}
