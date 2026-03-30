"use client";

import { useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, CheckCircle, ArrowRight, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function ResetPasswordForm() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tenant = params.tenant as string;
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("No reset token found in the URL.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password.");

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${tenant}/login`);
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <Card className="max-w-md w-full border-border/40 bg-card/60 backdrop-blur-xl p-10 text-center space-y-4 rounded-[2rem]">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-black">Invalid Request</h2>
          <p className="text-muted-foreground text-sm opacity-80">This reset link appears to be invalid or was missing a token.</p>
          <Link href={`/${tenant}/login`} className="block pt-2">
            <Button variant="outline" className="w-full rounded-xl">Back to Login</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <Card className="max-w-md w-full border-border/40 bg-card/60 backdrop-blur-xl p-10 text-center space-y-6 rounded-[2rem] border-emerald-500/10">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight">Success!</h2>
            <p className="text-muted-foreground text-sm opacity-80 font-medium">Your password has been successfully reset.</p>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Redirecting you to login...</p>
          <Link href={`/${tenant}/login`} className="block">
            <Button className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 font-black uppercase tracking-widest text-[11px]">Go to Login Now <ArrowRight className="ml-2 w-4 h-4" /></Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 overflow-hidden relative font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />

      <Card className="max-w-md w-full border-border/40 bg-card/60 backdrop-blur-xl rounded-[2rem] overflow-hidden relative z-10 shadow-2xl">
        <CardHeader className="text-center pt-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight leading-tight uppercase">Update Password</CardTitle>
          <CardDescription className="text-muted-foreground mt-2 px-4 opacity-80">
            Security first! Please choose a strong, new password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50 transition-opacity group-focus-within:opacity-100" />
                  <Input
                    type={showPass ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="pl-10 pr-10 h-12 rounded-xl bg-slate-900/50 border-border/40 focus:ring-primary/20 transition-all font-medium"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50 transition-opacity group-focus-within:opacity-100" />
                  <Input
                    type={showPass ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="pl-10 h-12 rounded-xl bg-slate-900/50 border-border/40 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl font-bold">
                {error}
              </div>
            )}

            <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[11px] bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Reset Password <ArrowRight className="ml-2 w-4 h-4" /></>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950 font-black text-white p-4">Loading Secured Session...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
