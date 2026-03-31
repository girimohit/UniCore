"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-server";
import { useEffect, useState } from "react";

export default function TenantNotFound() {
  const [role, setRole] = useState<string | null>(null);
  const params = useParams();
  const tenant = params?.tenant as string;
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      if (user) {
        setRole(user.role.toLowerCase());
      }
    }
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 z-0">
        <div
          className="absolute -top-24 -left-20 w-[600px] h-[600px] rounded-full opacity-[0.08]"
          style={{
            background:
              "radial-gradient(circle, var(--uc-purple), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute -bottom-24 -right-20 w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{
            background:
              "radial-gradient(circle, var(--uc-cyan), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="max-w-md w-full text-center space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center">
          <div className="p-6 rounded-[32px] bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 shadow-2xl shadow-primary/10">
            <FileQuestion
              className="w-20 h-20 text-primary animate-pulse"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-6xl font-black tracking-tighter text-foreground">
            404
          </h1>
          <h2 className="text-2xl font-bold text-foreground/90 tracking-tight">
            Page Not Found
          </h2>
          {/* <p className="text-muted-foreground font-medium leading-relaxed">
            The resource you're looking for doesn't exist or has been moved. If
            this is a module, it might be disabled for your institution.
          </p> */}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-muted text-muted-foreground font-bold hover:bg-muted/80 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            href={role ? `/${tenant}/${role}/dashboard` : `/`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>

        <p className="text-xs text-muted-foreground/60 font-medium">
          Error Code: UNICORE_NOT_FOUND
        </p>
      </div>
    </div>
  );
}

// "use client";

// import Link from "next/link";
// import { FileQuestion, Home } from "lucide-react";

// export default function RootNotFound() {
//   return (
//     <div className="min-h-screen w-full flex items-center justify-center p-6 bg-background">
//       <div className="max-w-md w-full text-center space-y-8">
//         <div className="flex justify-center">
//           <div className="p-6 rounded-[32px] bg-muted border border-border shadow-xl">
//             <FileQuestion
//               className="w-20 h-20 text-muted-foreground"
//               strokeWidth={1.5}
//             />
//           </div>
//         </div>

//         <div className="space-y-3">
//           <h1 className="text-4xl font-black tracking-tight">
//             404 - Not Found
//           </h1>
//           <p className="text-muted-foreground font-medium">
//             The page you're looking for doesn't exist.
//           </p>
//         </div>

//         <div className="pt-4">
//           <Link
//             href="/"
//             className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
//           >
//             <Home className="w-4 h-4" />
//             Go to Home
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
