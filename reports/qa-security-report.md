# Leave Management System - QA and Security Review

Date: 2026-05-21
Scope: Backend (Express/Mongoose) and Frontend (React/Vite) source code review.
Method: Static review only. No dynamic testing, no automated scanners executed.

## Executive Summary
- Overall risk: Medium-High due to authorization gaps and unsafe attachment handling.
- Test coverage: No automated test files detected in the repository.
- Priority focus: Fix manager approval authorization, enforce server-side validation for attachments and updates, add rate limiting.

## Severity and Priority Scale
- Severity: Critical, High, Medium, Low
- Priority: P0 (immediate) to P3 (low)
- Mapping: Critical=P0, High=P1, Medium=P2, Low=P3

## Key Findings (Ordered by Priority)

### P1 - Authorization Gap in Manager Approvals (High)
- Impact: Any manager can approve or reject any pending leave request by ID, bypassing team boundaries.
- Evidence: Manager approval/rejection queries do not filter by managerId.
- Affected:
  - backend/src/routes/manager.js (POST /requests/:id/approve, POST /requests/:id/reject)
- Recommendation:
  - Enforce manager ownership in update queries, e.g., require managerId = req.user.id.
  - Add tests for cross-team access attempts.

### P1 - Unvalidated Attachment URLs Enable Stored XSS (High)
- Impact: A user can submit a data URL or javascript URL and cause HR/Manager views to open malicious content, risking token theft and account takeover.
- Evidence: Attachment URL is accepted from request body without server validation and opened via window.open.
- Affected:
  - backend/src/routes/employee.js (attachmentUrl, attachmentName stored from request body)
  - src/utils/helpers.js (openAttachment opens any URL or data URL)
  - src/modules/employee/components/LeaveForm.jsx (client-side file validation only)
- Recommendation:
  - Validate and whitelist attachment mime types and URL schemes server-side.
  - Prefer server-side file storage with download endpoints that set safe headers.
  - Block or sanitize data URLs in UI unless explicitly safe.

### P1 - HR Role Can Grant Admin or Invalid Roles (High)
- Impact: HR can create or update users with any role, potentially granting admin privileges without checks.
- Evidence: HR create/update uses request body role with no allowlist and update bypasses Mongoose validators.
- Affected:
  - backend/src/routes/hr.js (POST /employees, PUT /employees/:id)
- Recommendation:
  - Enforce role allowlist for HR operations.
  - Add server-side validation and use runValidators for updates.

### P2 - Update Endpoints Bypass Schema Validation (Medium)
- Impact: Invalid values can be stored (negative maxDays, invalid role, etc.), breaking business rules and integrity.
- Evidence: findByIdAndUpdate / findOneAndUpdate without runValidators.
- Affected:
  - backend/src/routes/admin.js
  - backend/src/routes/hr.js
- Recommendation:
  - Use { runValidators: true } for updates.
  - Validate inputs using a schema validator (zod/joi).

### P2 - No Rate Limiting or Account Lockout (Medium)
- Impact: Brute force login attempts are possible.
- Evidence: Login endpoint has no rate limiting or lockout checks.
- Affected:
  - backend/src/routes/auth.js (POST /login)
- Recommendation:
  - Add rate limiting (express-rate-limit) and lockout strategy on repeated failures.

### P2 - Token Stored in Local Storage (Medium)
- Impact: XSS would expose tokens and allow account takeover.
- Evidence: Auth token persisted in localStorage.
- Affected:
  - src/context/AuthContext.jsx
- Recommendation:
  - Prefer HttpOnly cookies with CSRF protection or short-lived tokens with refresh.
  - Add Content Security Policy (CSP).

### P3 - Dev Login Fallback (Low)
- Impact: If a dev build or misconfigured environment reaches production, auth can be bypassed.
- Evidence: Dev-mode fallback generates a token in login error handling.
- Affected:
  - src/services/authService.js
- Recommendation:
  - Remove dev fallback in production builds or guard with an explicit feature flag.

### P3 - Attachment Size Limit Mismatch (Low)
- Impact: Frontend allows 5MB; backend JSON parser limits to 1MB, causing unexpected failures.
- Evidence: Client accepts 5MB; server limits JSON body to 1mb.
- Affected:
  - backend/src/index.js
  - src/modules/employee/components/LeaveForm.jsx
- Recommendation:
  - Align size limits or use multipart upload for files.

### P3 - ObjectId Validation Missing (Low)
- Impact: Invalid IDs can trigger 500 errors and potential error-based enumeration.
- Evidence: No ObjectId validation for route parameters in multiple endpoints.
- Affected:
  - backend/src/routes/admin.js
  - backend/src/routes/hr.js
  - backend/src/routes/manager.js
- Recommendation:
  - Validate ObjectId params and return 400 on invalid input.

## Test Coverage Gaps
- No unit, integration, or E2E tests detected in the repository.
- Authentication, RBAC, and critical business flows are untested.

## Recommended Test Plan (Module Coverage)

### Backend
- Auth: login failures, lockout, token validation, inactive users.
- Employee: leave submission rules, balance enforcement, holiday calculations, attachments validation.
- Manager: team-scoped approvals only, pending-only updates, notification creation.
- HR: approve/reject flows, employee CRUD, role restrictions.
- Admin: leave type CRUD with validation.

### Frontend
- Auth flow: login/logout, token storage, protected routes.
- Employee: apply leave, attachment upload, date validation.
- Manager/HR: approve/reject with reason, attachment opening safety.

## Recommended Automation Stack
- Unit: Vitest + React Testing Library (frontend), Jest + Supertest (backend).
- Integration: Testcontainers for MongoDB.
- E2E: Playwright for role-based flows.
- Security: OWASP ZAP for DAST, npm audit/Snyk for dependencies.

## Next Steps
1. Confirm whether HR should be allowed to set admin roles.
2. Decide attachment handling approach (data URLs vs file storage).
3. Add test scaffolding and coverage gates.
4. Run automated security scans (npm audit, ZAP) after approval.
