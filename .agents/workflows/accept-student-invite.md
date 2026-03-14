---
description: How to implement and test the student invitation acceptance flow
---

# Workflow: Implement Student Invitation Acceptance

This workflow describes the process of setting up the student invitation flow, from initial setup to verification.

## Prerequisites
- [x] Invitation generation API (`/api/auth/invite`)
- [x] Invitation token table in database

## Steps

### 1. Fix the Acceptance API
Ensure the `/api/auth/accept-invite` route correctly matches the Prisma schema and creates both the `User` and the corresponding `StudentProfile` or `FacultyProfile`.

// turbo
```bash
# Verify the schema fields
cat prisma/schema.prisma | grep -A 20 "model User"
cat prisma/schema.prisma | grep -A 20 "model StudentProfile"
```

### 2. Create the Acceptance Form Component
Build a reusable `AcceptInviteForm.tsx` that handles user input and validation.
- Fields: name, roll number, password.
- Submit to the fixed API route.

### 3. Implement the Invitation Page
Create `app/[tenant]/accept-invite/page.tsx` to host the form.
- Extract `token` and `tenant` (slug) from the request.
- Validate the token on the server before rendering the form.

### 4. Integration & UI Polish
- Link the "Generate Invite" button in the admin dashboard to the new flow.
- Ensure the `debug_link` in the invite API points to the correct new page.

### 5. Verification
- Generate an invite.
- Open the resulting link.
- Fill out the form.
- Verify user creation in the database.
