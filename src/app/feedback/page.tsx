"use client";

import { useState } from "react";
import { MessageSquare, Send, User, Mail, Tag, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

type FeedbackType = "bug" | "suggestion" | "request" | "other";

const feedbackTypes: { value: FeedbackType; label: string; icon: string; color: string }[] = [
  { value: "bug", label: "Bug Report", icon: "🐛", color: "border-red-500/40 bg-red-500/10 text-red-400" },
  { value: "suggestion", label: "Suggestion", icon: "💡", color: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400" },
  { value: "request", label: "Resource Request", icon: "📦", color: "border-blue-500/40 bg-blue-500/10 text-blue-400" },
  { value: "other", label: "Other", icon: "💬", color: "border-purple-500/40 bg-purple-500/10 text-purple-400" },
];

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<FeedbackType>("suggestion");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter your feedback message.");
      return;
    }

    setIsSending(true);
    const toastId = toast.loading("Sending your feedback...");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, type, message }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Sent successfully! Thank you for your feedback.", { id: toastId, duration: 5000 });
        setIsSent(true);
      } else {
        toast.error(data.message || "Failed to send. Please try again.", { id: toastId });
      }
    } catch {
      toast.error("Connection error. Please try again.", { id: toastId });
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setType("suggestion");
    setMessage("");
    setIsSent(false);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 rounded-xl">
            <MessageSquare className="text-purple-400" size={32} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Feedback</h1>
        </div>
        <p className="text-muted text-lg">
          Report bugs, share suggestions, or request new resources — we&apos;re always listening!
        </p>
      </div>

      {/* Success State */}
      {isSent ? (
        <div className="bg-[#18181b] border border-emerald-500/20 rounded-2xl p-12 flex flex-col items-center text-center gap-6 shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)]">
          <div className="p-5 bg-emerald-500/10 rounded-full">
            <CheckCircle2 className="text-emerald-400" size={48} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Sent Successfully!</h2>
            <p className="text-muted max-w-sm">
              Your feedback has been delivered to the admin team. We&apos;ll review and respond as soon as possible.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-xl font-medium transition-all border border-emerald-500/20 hover:border-emerald-500"
          >
            Send Another Feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Feedback Type Selector */}
          <div className="bg-[#18181b] border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={16} className="text-muted" />
              <label className="text-sm font-semibold text-white">Feedback Type</label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {feedbackTypes.map((ft) => (
                <button
                  key={ft.value}
                  type="button"
                  onClick={() => setType(ft.value)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 font-medium text-sm transition-all ${
                    type === ft.value
                      ? ft.color + " scale-[1.03] shadow-lg"
                      : "border-border bg-white/5 text-muted hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="text-2xl">{ft.icon}</span>
                  <span>{ft.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Name & Email */}
          <div className="bg-[#18181b] border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={16} className="text-muted" />
              <label className="text-sm font-semibold text-white">Your Information</label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="w-full bg-[#09090b] border border-border rounded-xl py-3 pl-9 pr-4 text-white placeholder:text-muted/40 focus:outline-none focus:border-primary/50 transition-colors text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted mb-2">
                  Contact Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full bg-[#09090b] border border-border rounded-xl py-3 pl-9 pr-4 text-white placeholder:text-muted/40 focus:outline-none focus:border-primary/50 transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-[#18181b] border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-muted" />
              <label className="text-sm font-semibold text-white">
                Message <span className="text-red-400">*</span>
              </label>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              placeholder="Describe the bug, share your thoughts, or detail the resource you need..."
              className="w-full bg-[#09090b] border border-border rounded-xl py-3 px-4 text-white placeholder:text-muted/40 focus:outline-none focus:border-primary/50 transition-colors text-sm resize-none leading-relaxed"
            />
            <p className="text-xs text-muted mt-2 text-right">{message.length} characters</p>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-muted">
              Your feedback will be delivered to the admin team via email and reviewed as soon as possible.
            </p>
            <button
              type="submit"
              disabled={isSending}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSending ? (
                <><Loader2 size={18} className="animate-spin" /> Sending...</>
              ) : (
                <><Send size={18} /> Send Feedback</>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
