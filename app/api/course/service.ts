import prisma  from "@/lib/prisma";

export async function createCourse(
  tenantId: string,
  data: { name: string; code: string }
) {
  return prisma.course.create({
    data: {
      ...data,
      tenantId,
    },
  });
}


// export async function deleteCourse() {}a