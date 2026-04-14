import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { CertificateService } from "@/lib/services/certificate-service";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { studentId, courseId } = await req.json();

        if (!studentId || !courseId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const certificate = await CertificateService.issueCertificate(
            studentId, 
            courseId, 
            user.institutionId
        );

        return NextResponse.json({ 
            success: true, 
            certificate 
        });
    } catch (error: any) {
        console.error("Certificate issuance API error:", error);
        return NextResponse.json({ 
            error: error.message || "Failed to issue certificate" 
        }, { status: 500 });
    }
}
