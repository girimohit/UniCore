import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-server';

export async function GET(request: Request) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const targetRole = searchParams.get('role');

  try {
    const notices = await prisma.notice.findMany({
      where: {
        institutionId: session.institutionId,
        ...(targetRole ? { targetRole: { in: [targetRole, 'ALL'] } } : {})
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(notices);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notices" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getCurrentUser();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { title, content, targetRole } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        targetRole: targetRole || "ALL",
        institutionId: session.institutionId,
      }
    });

    return NextResponse.json(notice, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create notice" }, { status: 500 });
  }
}
