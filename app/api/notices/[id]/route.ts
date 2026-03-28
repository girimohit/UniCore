import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const id = (await params).id;

  try {
    const notice = await prisma.notice.findUnique({
      where: { id, institutionId: session.institutionId },
    });
    if (!notice) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    return NextResponse.json(notice);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notice" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentUser();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  
  const id = (await params).id;

  try {
    const { title, content, targetRole } = await request.json();

    const notice = await prisma.notice.update({
      where: { id, institutionId: session.institutionId },
      data: { title, content, targetRole: targetRole || "ALL" },
    });

    return NextResponse.json(notice);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update notice" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentUser();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  
  const id = (await params).id;

  try {
    await prisma.notice.delete({
      where: { id, institutionId: session.institutionId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete notice" }, { status: 500 });
  }
}
