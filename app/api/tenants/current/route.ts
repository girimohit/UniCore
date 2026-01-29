import { resolveTenant } from "@/lib/tenant-resolver";
import type { NextApiRequest, NextApiResponse } from 'next'

export async function GET(req: Request) {
    try {
        const tenant = await resolveTenant(req);

        return Response.json({
            id: tenant.id,
            name: tenant.name,
            code: tenant.code,
            createdAt: tenant.createdAt,
        });
    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400 }
        );
    }
}
