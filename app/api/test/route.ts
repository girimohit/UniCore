import { prisma } from "@/lib/db"

export async function GET() {
  const institutions = await prisma.institution.findMany()
  return Response.json(institutions)
}