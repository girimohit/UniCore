"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, CheckCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const params = useParams();
  const tenant = params.tenant as string;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subdomain: tenant }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <Card className="max-w-md w-full border-border/40 bg-card/60 backdrop-blur-xl rounded-[2rem] overflow-hidden">
          <CardHeader className="text-center pt-10">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <CardTitle className="text-2xl font-black tracking-tight">Check your email</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              If an account exists for <span className="font-bold text-foreground">{email}</span>, 
              we've sent a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
            <Button 
                variant="outline" 
                className="w-full rounded-xl"
                onClick={() => setSubmitted(false)}
            >
                Try a different email
            </Button>
            <Link href={`/${tenant}/login`} className="block">
              <Button variant="ghost" className="w-full rounded-xl gap-2 font-bold opacity-70 hover:opacity-100 uppercase tracking-widest text-[10px]">
                <ChevronLeft className="w-4 h-4" /> Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />

      <Card className="max-w-md w-full border-border/40 bg-card/60 backdrop-blur-xl rounded-[2rem] overflow-hidden relative z-10">
        <CardHeader className="text-center pt-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight leading-tight uppercase">Forgot Password?</CardTitle>
          <CardDescription className="text-muted-foreground mt-2 px-4 italic opacity-80">
            No worries! Enter your email below and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50 transition-opacity group-focus-within:opacity-100" />
                <Input
                  type="email"
                  placeholder="e.g. john@university.edu"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-slate-900/50 border-border/40 focus:ring-primary/20 transition-all font-medium"
                />
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
                className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[11px] bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-indigo-600/20 hover:scale-[1.02] transition-transform active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Reset Link <ArrowRight className="ml-2 w-4 h-4" /></>}
            </Button>

            <Link href={`/${tenant}/login`} className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all mt-4">
               <ChevronLeft className="w-4 h-4" /> Back to Login
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
