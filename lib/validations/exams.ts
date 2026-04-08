import { z } from "zod";

export const CreateExamSchema = z.object({
  name: z.string().min(3, "Exam name must be at least 3 characters"),
  examDate: z.string().or(z.date()).transform((val) => new Date(val)),
  courseId: z.string().min(1, "Course is required"),
  subjectId: z.string().min(1, "Subject is required"),
  termId: z.string().min(1, "Academic Term is required"),
  maxMarks: z.number().min(0).default(100),
  passingMarks: z.number().min(0).default(40),
  examType: z.string().default("REGULAR"),
}).refine((data) => data.maxMarks >= data.passingMarks, {
  message: "Passing marks cannot be greater than maximum marks",
  path: ["passingMarks"],
});

export type CreateExamInput = z.infer<typeof CreateExamSchema>;

export const RecordResultSchema = z.object({
  examId: z.string().min(1, "Exam ID is required"),
  studentId: z.string().min(1, "Student ID is required"),
  obtainedMarks: z.number().min(0, "Marks cannot be negative"),
  teacherRemarks: z.string().optional(),
});

export type RecordResultInput = z.infer<typeof RecordResultSchema>;

export const BulkRecordResultsSchema = z.object({
  examId: z.string().min(1, "Exam ID is required"),
  results: z.array(z.object({
    studentId: z.string().min(1, "Student ID is required"),
    obtainedMarks: z.number().min(0, "Marks cannot be negative"),
    teacherRemarks: z.string().optional(),
  })),
});

export type BulkRecordResultsInput = z.infer<typeof BulkRecordResultsSchema>;
