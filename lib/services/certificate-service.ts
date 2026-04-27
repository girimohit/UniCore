import { prisma } from "../db";
import { BlockchainService } from "./blockchain-service";
import crypto from "crypto";

export class CertificateService {
  /**
   * Generates and anchors a certificate for a student.
   */
  static async issueCertificate(studentId: string, courseId: string, institutionId: string) {
    // 1. Fetch data
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true },
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    const institution = await prisma.institution.findUnique({
      where: { id: institutionId },
    });

    if (!student || !course || !institution) {
      throw new Error("Student, Course, or Institution not found");
    }

    // 2. Prepare certificate details
    const certificateData = {
      studentName: student.user.name,
      rollNumber: student.rollNumber,
      courseName: course.name,
      courseCode: course.code,
      institutionName: institution.name,
      issueDate: new Date().toISOString(),
      platform: "UniCore Blockchain Registry",
    };

    // 3. Generate SHA-256 hash
    const dataString = JSON.stringify(certificateData);
    const documentHash = crypto.createHash("sha256").update(dataString).digest("hex");

    // 4. Check if already exists in DB
    const existing = await prisma.certificate.findUnique({
      where: { documentHash },
    });

    if (existing) {
      return existing;
    }

    // 5. Save to database as PENDING
    const certificate = await prisma.certificate.create({
      data: {
        studentId,
        courseId,
        institutionId,
        certificateData: certificateData as any,
        documentHash,
        status: "PENDING",
      },
    });

    // 6. Anchor to blockchain (can be done asynchronously, but we'll wait for now)
    const anchorResult = await BlockchainService.anchorHash(
      documentHash,
      `Issued to ${student.user.name} for ${course.name}`,
    );

    if (anchorResult.success) {
      return await prisma.certificate.update({
        where: { id: certificate.id },
        data: {
          status: "ANCHORED",
          transactionHash: anchorResult.transactionHash,
        },
      });
    } else {
      return await prisma.certificate.update({
        where: { id: certificate.id },
        data: {
          status: "FAILED",
        },
      });
    }
  }

  /**
   * Verifies a certificate's integrity and on-chain status.
   */
  static async verifyCertificate(documentHash: string) {
    const dbRecord = await prisma.certificate.findUnique({
      where: { documentHash },
      include: { student: { include: { user: true } }, course: true },
    });

    if (!dbRecord) {
      return { exists: false, message: "Certificate not found in local database" };
    }

    const onChainRecord = await BlockchainService.verifyHash(documentHash);

    return {
      exists: true,
      dbRecord,
      onChainRecord,
      isIntegrityValid: onChainRecord.exists,
    };
  }
}
