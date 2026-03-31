"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function TenantError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const tenant = params?.tenant as string;

  useEffect(() => {
    // Log error to an error reporting service if needed
    console.error("UNICORE_RUNTIME_ERROR:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 z-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.08]"
          style={{
            background:
              "radial-gradient(circle, var(--destructive), transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="max-w-md w-full text-center space-y-8 relative z-10 animate-in zoom-in-95 fade-in duration-500">
        <div className="flex justify-center">
          <div className="p-6 rounded-[32px] bg-destructive/10 border border-destructive/20 shadow-2xl shadow-destructive/10">
            <AlertTriangle
              className="w-20 h-20 text-destructive"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            Something went wrong!
          </h2>
          <p className="text-muted-foreground font-medium leading-relaxed">
            We encountered an unexpected error while processing your request.
            This might be a temporary issue or a permission problem.
          </p>
          {error.digest && (
            <div className="mt-4 p-2 rounded-lg bg-muted text-[10px] font-mono text-muted-foreground/70 uppercase tracking-widest break-all">
              Ref: {error.digest}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-destructive text-destructive-foreground font-bold shadow-lg shadow-destructive/20 hover:opacity-90 transition-all active:scale-95"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            // href={tenant ? `/${tenant}/admin/dashboard` : "/"}
            href={"/"}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-muted text-muted-foreground font-bold hover:bg-muted/80 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        <div className="pt-8 border-t border-border/40">
          <p className="text-xs text-muted-foreground/60 font-medium">
            System: UNICORE_CORE_ENGINE
          </p>
        </div>
      </div>
    </div>
  );
}
