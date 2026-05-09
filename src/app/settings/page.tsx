"use client";

import { useState, useEffect } from "react";
import { Settings2, Bell, Shield, Moon, Monitor, Palette, Lock, User, LogOut, Loader2, X, KeyRound, Check } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Theme state
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // System Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Change PIN modal state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [isUpdatingPin, setIsUpdatingPin] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check session storage on mount
    const authStatus = sessionStorage.getItem("tannhax_admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }

    // Check notifications preference
    const notif = localStorage.getItem("tannhax_notifications");
    if (notif === "true") {
      setNotificationsEnabled(true);
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

  const handleToggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const handleToggleSystemTheme = () => {
    if (theme === "system") {
      // Revert to current actual theme if unchecking system
      setTheme(systemTheme || "dark");
    } else {
      setTheme("system");
    }
  };

  const handleToggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem("tannhax_notifications", String(newState));
    if (newState) {
      toast.success("Đã bật thông báo hệ thống");
    } else {
      toast.info("Đã tắt thông báo hệ thống");
    }
  };

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      toast.error("Mã PIN mới phải có ít nhất 4 ký tự.");
      return;
    }
    
    setIsUpdatingPin(true);
    try {
      const res = await fetch('/api/settings/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPin, newPin })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success(data.message);
        setIsPinModalOpen(false);
        setCurrentPin("");
        setNewPin("");
      } else {
        toast.error(data.message || "Cập nhật thất bại.");
      }
    } catch (err) {
      toast.error("Đã xảy ra lỗi hệ thống khi cập nhật PIN.");
    } finally {
      setIsUpdatingPin(false);
    }
  };

  // Prevent hydration mismatch by returning a loading state
  if (!mounted || isChecking) {
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

  const isDarkMode = theme === "dark" || (theme === "system" && systemTheme === "dark");

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Settings2 className="text-primary" size={32} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
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
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="text-purple-400" size={24} />
            <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
          </div>
          
          <div className="space-y-4">
            <div 
              onClick={handleToggleTheme}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Moon size={20} className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle dark background theme</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isDarkMode ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isDarkMode ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>

            <div 
              onClick={handleToggleSystemTheme}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Monitor size={20} className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Follow System Theme</p>
                  <p className="text-sm text-muted-foreground">Automatically match system preference</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${theme === 'system' ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${theme === 'system' ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Notifications */}
        <div className="bg-card border border-border rounded-2xl p-6 relative">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-emerald-400" size={24} />
            <h2 className="text-xl font-semibold text-foreground">Security & Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div 
              onClick={() => setIsPinModalOpen(true)}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Change Document PIN</p>
                  <p className="text-sm text-muted-foreground">Update the security PIN for resources</p>
                </div>
              </div>
            </div>

            <div 
              onClick={handleToggleNotifications}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">System Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive alerts for system events</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${notificationsEnabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${notificationsEnabled ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change PIN Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-3xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsPinModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground bg-muted/50 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center mb-6">
              <div className="p-4 bg-primary/10 text-primary rounded-full mb-4">
                <KeyRound size={32} />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Update Document PIN</h2>
              <p className="text-muted-foreground text-sm mt-2 text-center">Enter your current PIN and choose a new one.</p>
            </div>

            <form onSubmit={handleUpdatePin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Current PIN</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-muted-foreground" />
                  </div>
                  <input 
                    type="password" 
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="Enter current PIN"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">New PIN</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield size={18} className="text-muted-foreground" />
                  </div>
                  <input 
                    type="password" 
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="Enter new PIN (min 4 characters)"
                    minLength={4}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUpdatingPin}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-5 py-2.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px]"
                >
                  {isUpdatingPin ? (
                    <><Loader2 size={18} className="animate-spin" /></>
                  ) : (
                    <><Check size={18} /> Update PIN</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
