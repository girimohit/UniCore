import { NextResponse } from "next/server";
import { CertificateService } from "@/lib/services/certificate-service";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const hash = searchParams.get("hash");

        if (!hash) {
            return NextResponse.json({ error: "Certificate hash is required" }, { status: 400 });
        }

        const result = await CertificateService.verifyCertificate(hash);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Verification API error:", error);
        return NextResponse.json({ error: "Failed to verify certificate" }, { status: 500 });
    }
}
