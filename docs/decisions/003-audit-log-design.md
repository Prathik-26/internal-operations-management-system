# 003 — Audit Log Design

## Problem

Internal tools in SME environments require traceability — who did what and when.
Needed to decide where audit logging should live in the architecture.

## Options Considered

1. **Controller-level logging** — log inside each controller method
2. **Service-level logging** — inject AuditService into business services
3. **Interceptor-level logging** — automatic logging via NestJS interceptor
4. **Database triggers** — log at DB level

## Decision

Service-level logging (Option 2) with a separate AuditService and repository.
