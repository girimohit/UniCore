import { redirect } from "next/navigation";
import { getCurrentUserOrNull } from "@/lib/current-user";

export default async function DashboardRouter() {
  const user = await getCurrentUserOrNull(); // ✅ SAFE
  console.log("hi from app/dashboard");
  console.log(user);
  // 🔹 User authenticated BUT not onboarded
  if (!user) {
    redirect("/onboarding"); // ✅ redirect happens HERE
  }

  // 🔹 User exists → role-based routing
  switch (user.role) {
    case "ADMIN":
      redirect("/admin/dashboard");
    case "FACULTY":
      redirect("/faculty/dashboard");
    case "STUDENT":
      redirect("/student/dashboard");
  }
}
