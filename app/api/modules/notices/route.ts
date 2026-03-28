import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';
import { isModuleEnabled } from '@/lib/modules/loader';

/**
 * GET /api/modules/notices?id=...&role=...
 * - Fetches all notices for the institution
 * - Optional 'id' to fetch a specific notice
 * - Optional 'role' to filter notices targeted at a specific role ('ALL' is always included)
 */
export const GET = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN', 'FACULTY', 'STUDENT'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'notices');
    if (!active) {
      return NextResponse.json({ error: 'Notices module disabled' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const targetRole = searchParams.get('role');

    if (id) {
      const notice = await prisma.notice.findUnique({
        where: { id, institutionId: user.institutionId },
      });
      if (!notice) return NextResponse.json({ error: "Notice not found" }, { status: 404 });
      return NextResponse.json(notice);
    }

    const notices = await prisma.notice.findMany({
      where: {
        institutionId: user.institutionId,
        ...(targetRole ? { targetRole: { in: [targetRole, 'ALL'] } } : {})
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

/**
 * POST /api/modules/notices
 * - Create one or more notices
 */
export const POST = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'notices');
    if (!active) {
      return NextResponse.json({ error: 'Notices module disabled' }, { status: 403 });
    }

    const body = await req.json();
    const entries = Array.isArray(body) ? body : [body];

    if (entries.length === 0) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    const created = [];
    const errors = [];

    for (const entry of entries) {
      const { title, content, targetRole } = entry;
      if (!title || !content) {
        errors.push({ ...entry, error: "Title and content are required" });
        continue;
      }

      const notice = await prisma.notice.create({
        data: {
          title,
          content,
          targetRole: targetRole || "ALL",
          institutionId: user.institutionId,
        }
      });
      created.push(notice);
    }

    return NextResponse.json({ created, errors, message: `${created.length} notices created.` }, { status: 201 });
  } catch (error) {
    console.error('Error creating notice:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

/**
 * PATCH /api/modules/notices?id=...
 * - Update an existing notice
 */
export const PATCH = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'notices');
    if (!active) {
      return NextResponse.json({ error: 'Notices module disabled' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const { title, content, targetRole } = await req.json();

    if (!id) return NextResponse.json({ error: "Notice ID is required" }, { status: 400 });

    const updated = await prisma.notice.update({
      where: { id, institutionId: user.institutionId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(targetRole && { targetRole }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating notice:', error);
    return NextResponse.json({ error: "Notice not found or update failed" }, { status: 500 });
  }
});

/**
 * DELETE /api/modules/notices?id=...
 * - Remove a notice
 */
export const DELETE = withAuth(['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN'], async (req, context, user) => {
  try {
    const active = await isModuleEnabled(user.institutionId, 'notices');
    if (!active) {
      return NextResponse.json({ error: 'Notices module disabled' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "Notice ID is required" }, { status: 400 });

    await prisma.notice.delete({
      where: { id, institutionId: user.institutionId },
    });

    return NextResponse.json({ success: true, message: "Notice deleted successfully" });
  } catch (error) {
    console.error('Error deleting notice:', error);
    return NextResponse.json({ error: "Failed to delete notice" }, { status: 500 });
  }
});
