"use client";

import React, { useState, useEffect, useRef } from "react";
import { Lock, Eye, EyeOff, ShieldAlert, CheckCircle2 } from "lucide-react";

interface PasswordGuardProps {
  children: React.ReactNode;
}

export function PasswordGuard({ children }: PasswordGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Read environment password (publicly exposed in NextJS)
  const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_SITE_PASSWORD || "140703";

  useEffect(() => {
    // Check auth status on client side
    const isAuthLocal = localStorage.getItem("site_authenticated") === "true";
    const isAuthSession = sessionStorage.getItem("site_authenticated") === "true";

    if (isAuthLocal || isAuthSession) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      // Focus on input field once mounted
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Vui lòng nhập mật khẩu.");
      inputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate a minor delay for a premium feel
    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        setIsSuccess(true);
        setTimeout(() => {
          if (rememberMe) {
            localStorage.setItem("site_authenticated", "true");
          } else {
            sessionStorage.setItem("site_authenticated", "true");
          }
          setIsAuthenticated(true);
        }, 600); // Wait for success animation
      } else {
        setError("Mật khẩu không chính xác. Vui lòng thử lại!");
        setIsSubmitting(false);
        setPassword("");
        inputRef.current?.focus();
      }
    }, 400);
  };

  // Prevent flash of content during initial client check
  if (isAuthenticated === null) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-muted text-sm font-medium animate-pulse">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Render children if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4 z-50 overflow-y-auto">
      {/* Background visual effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Embedded Shake Keyframes style */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .shake-animation {
          animation: shake 0.4s ease-in-out;
        }
      `}} />

      {/* Main Lock Card */}
      <div 
        className={`w-full max-w-md bg-card/60 backdrop-blur-xl border border-border rounded-3xl p-6 sm:p-10 shadow-2xl transition-all duration-500 scale-95 hover:scale-100 hover:border-primary/20 hover:shadow-primary/5 ${
          error ? "shake-animation border-red-500/30" : ""
        }`}
      >
        <div className="flex flex-col items-center text-center">
          {/* Glowing Lock Icon */}
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
            isSuccess 
              ? "bg-green-500/10 text-green-500 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-bounce" 
              : "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
          }`}>
            {isSuccess ? <CheckCircle2 size={32} /> : <Lock size={30} className={isSubmitting ? "animate-pulse" : ""} />}
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            TanNha<span className="text-primary text-glow">X</span>
          </h2>
          <p className="text-muted text-sm sm:text-base mt-2">
            Hệ thống Quản lý Tài nguyên Kỹ thuật
          </p>
          <div className="w-12 h-1 bg-border rounded-full my-4 sm:my-6" />
          <p className="text-xs sm:text-sm text-muted max-w-xs mb-8">
            Trang web này được bảo mật. Vui lòng nhập mật khẩu để mở khóa tài nguyên.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted pointer-events-none">
                <Lock size={18} />
              </span>
              <input
                ref={inputRef}
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu truy cập..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                disabled={isSubmitting || isSuccess}
                className="w-full pl-10 pr-10 py-3 bg-background/50 border border-border rounded-2xl text-foreground placeholder-muted/80 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm font-medium"
              />
              {password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs font-semibold px-1 mt-1 transition-all">
                <ShieldAlert size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Remember Me Toggle */}
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isSubmitting || isSuccess}
                className="w-4.5 h-4.5 rounded border-border text-primary focus:ring-primary/50 bg-background/50 cursor-pointer"
              />
              <span className="text-xs text-muted group-hover:text-foreground transition-colors font-medium select-none">
                Ghi nhớ đăng nhập
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden shadow-lg ${
              isSuccess
                ? "bg-green-500 text-white shadow-green-500/20"
                : "bg-primary text-white hover:bg-primary/90 hover:shadow-primary/25"
            } disabled:opacity-85 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Đang kiểm tra...</span>
              </>
            ) : isSuccess ? (
              <span>Thành công! Đang truy cập...</span>
            ) : (
              <span>Xác nhận</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
