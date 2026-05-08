"use client";

import { useState, useEffect } from "react";
import { Settings2, Bell, Shield, Moon, Monitor, Palette, Lock, User, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check session storage on mount
    const authStatus = sessionStorage.getItem("tannhax_admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        sessionStorage.setItem("tannhax_admin_auth", "true");
        toast.success("Đăng nhập thành công!");
        setIsAuthenticated(true);
      } else {
        toast.error(data.message || "Tài khoản hoặc mật khẩu không chính xác.");
      }
    } catch (err) {
      toast.error("Đã xảy ra lỗi hệ thống khi đăng nhập.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("tannhax_admin_auth");
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  // Prevent hydration mismatch by returning a loading state
  if (isChecking) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-muted flex flex-col items-center gap-4">
          <Shield className="w-10 h-10 text-primary/50" />
          <span>Checking security...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="w-full max-w-md bg-[#18181b] border border-border rounded-3xl p-8 shadow-[0_0_40px_-10px_rgba(59,130,246,0.15)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500"></div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <Lock className="text-primary w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
            <p className="text-muted text-sm mt-2 text-center">Sign in to access system settings</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-muted" />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#09090b] border border-border rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-muted" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#09090b] border border-border rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl mt-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <><Loader2 size={18} className="animate-spin" /> Signing in...</>
              ) : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Settings2 className="text-primary" size={32} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Settings
            </h1>
          </div>
          <p className="text-muted text-lg">
            Configure system preferences and personalize your interface.
          </p>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-medium transition-all border border-red-500/20"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Appearance Settings */}
        <div className="bg-[#18181b] border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="text-purple-400" size={24} />
            <h2 className="text-xl font-semibold text-white">Appearance</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Moon size={20} className="text-muted" />
                <div>
                  <p className="font-medium text-white">Dark Mode</p>
                  <p className="text-sm text-muted">Toggle dark background theme</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <Monitor size={20} className="text-muted" />
                <div>
                  <p className="font-medium text-white">Follow System Theme</p>
                  <p className="text-sm text-muted">Coming soon</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-white/10 rounded-full relative">
                <div className="absolute left-1 top-1 w-4 h-4 bg-muted rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Notifications */}
        <div className="bg-[#18181b] border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-emerald-400" size={24} />
            <h2 className="text-xl font-semibold text-white">Security & Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-muted" />
                <div>
                  <p className="font-medium text-white">Change Document PIN</p>
                  <p className="text-sm text-muted">Current PIN is set in environment variables</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-muted" />
                <div>
                  <p className="font-medium text-white">System Notifications</p>
                  <p className="text-sm text-muted">Coming soon</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-white/10 rounded-full relative">
                <div className="absolute left-1 top-1 w-4 h-4 bg-muted rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
