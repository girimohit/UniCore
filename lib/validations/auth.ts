import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  subdomain: z.string().min(1, "Subdomain is required"),
});

export const RegisterSchema = z.object({
  institutionName: z.string().min(3, "Institution name must be at least 3 characters"),
  subdomain: z.string()
    .min(2, "Subdomain must be at least 2 characters")
    .max(25, "Subdomain must be at most 25 characters")
    .regex(/^[a-z0-9-]+$/, "Subdomain can only contain lowercase letters, numbers, and hyphens"),
  adminEmail: z.string().email("Invalid email address"),
  adminPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const InstitutionRegisterSchema = z.object({
  institution_name: z.string().min(3, "Institution name must be at least 3 characters"),
  slug: z.string()
    .min(2, "Workspace slug must be at least 2 characters")
    .max(25, "Workspace slug must be at most 25 characters")
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Slug must start and end with alphanumeric characters and contains only lowercase letters, numbers, and hyphens"),
  admin_name: z.string().min(2, "Admin name is required"),
  admin_email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type InstitutionRegisterInput = z.infer<typeof InstitutionRegisterSchema>;
