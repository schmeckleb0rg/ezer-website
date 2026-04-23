"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/admin");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="Ezer Enterprises" className="h-10 w-auto mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-white">
            Admin Portal
          </h1>
          <p className="mt-2 font-body text-sm text-white/50">
            Sign in to manage site content
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-8 space-y-6"
        >
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-red-300 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div>
            <label className="block font-heading text-sm font-medium text-white/70 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-transparent"
                placeholder="admin@ezerenterprises.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-heading text-sm font-medium text-white/70 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-secondary py-3 font-heading font-semibold text-white hover:bg-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
