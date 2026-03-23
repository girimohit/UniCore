/**
 * Invitation Acceptance Page
 *
 * Flow:
 * 1. User clicks link from email: /amity/accept-invite?token=XYZ
 * 2. Next.js routes to this page with tenant="amity" and searchParams.token="XYZ"
 * 3. We validate the token and institution on the server.
 * 4. We render the activation form.
 */
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import AcceptInviteForm from "@/components/auth/AcceptInviteForm";
import { ShieldAlert, MailQuestion, Clock } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function AcceptInvitePage({
  params,
  searchParams,
}: PageProps) {
  const { tenant } = await params;
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <ErrorCard
          icon={<MailQuestion className="w-12 h-12 text-amber-500" />}
          title="Missing Token"
          message="The invitation link you followed is missing a valid security token. Please check your email and try again."
        />
      </div>
    );
  }

  // 1. Resolve the Institution
  const institution = await prisma.institution.findUnique({
    where: { slug: tenant },
    select: { id: true, name: true, slug: true, status: true },
  });

  if (!institution || institution.status !== "ACTIVE") {
    return notFound();
  }

  // 2. Validate the Invitation Token
  const invitation = await prisma.invitationToken.findUnique({
    where: { token },
    select: {
      id: true,
      email: true,
      role: true,
      used: true,
      expires_at: true,
      tenant_id: true,
    },
  });

  // Security check: Ensure the token belongs to this tenant
  if (!invitation || invitation.tenant_id !== institution.id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <ErrorCard
          icon={<ShieldAlert className="w-12 h-12 text-destructive" />}
          title="Invalid Invitation"
          message="This invitation link is invalid or does not belong to this institution. Please contact your administrator."
        />
      </div>
    );
  }

  // Check if already used
  if (invitation.used) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <ErrorCard
          icon={<ShieldAlert className="w-12 h-12 text-primary" />}
          title="Already Activated"
          message="This account has already been activated. Please proceed to the login page to access your account."
          action={
            <Link
              href={`/${tenant}/login`}
              className="btn-primary px-6 py-2.5 rounded-xl font-bold"
            >
              Go to Login
            </Link>
          }
        />
      </div>
    );
  }

  // Check if expired
  if (new Date() > invitation.expires_at) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <ErrorCard
          icon={<Clock className="w-12 h-12 text-destructive" />}
          title="Invitation Expired"
          message="This invitation link has expired for security reasons. Please ask your administrator to send a new invitation."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[#fafafa] relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-20 bg-primary blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-10 bg-accent blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-xl relative z-10">
        <div className="glass bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[40px] p-8 sm:p-12 shadow-2xl shadow-primary/5">
          <AcceptInviteForm
            token={token}
            tenantSlug={institution.slug}
            institutionName={institution.name}
            role={invitation.role}
            email={invitation.email}
          />
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground font-medium">
          Powered by Unicore ERP &bull; Secure Account Activation
        </p>
      </div>
    </div>
  );
}

function ErrorCard({
  icon,
  title,
  message,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="glass p-10 rounded-[32px] border border-border/50 max-w-md w-full text-center space-y-6 shadow-xl">
      <div className="flex justify-center">{icon}</div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black tracking-tight">{title}</h2>
        <p className="text-muted-foreground font-medium leading-relaxed">
          {message}
        </p>
      </div>
      {action && <div className="pt-2">{action}</div>}
      {!action && (
        <div className="pt-2">
          <Link href="/" className="text-primary font-bold hover:underline">
            Return to Home
          </Link>
        </div>
      )}
    </div>
  );
}
