# Internal Operations Management System (OMS)

A role-based internal workflow platform designed for small–medium organizations.
Built to demonstrate production-grade backend architecture, auditability, and operational discipline.

---

## Overview

OMS enables organizations to manage internal requests and approvals through a
structured role hierarchy. Every action is tracked, every state change is logged,
and access is strictly controlled by role.

---

## Features

| Feature          | Details                                              |
| ---------------- | ---------------------------------------------------- |
| Authentication   | JWT-based, 15-minute expiry                          |
| Authorization    | Role-based (Admin / Manager / Staff)                 |
| Request Workflow | Submit → Approved / Rejected lifecycle               |
| Audit Logging    | Every state change recorded with actor and timestamp |
| Pagination       | Configurable page size with metadata                 |
| Status Filtering | Filter requests by lifecycle status                  |
| Observability    | Per-request UUID tracing with duration logging       |

---

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | Next.js + TypeScript + Tailwind CSS |
| Backend    | NestJS + TypeScript                 |
| Database   | MySQL + TypeORM                     |
| Auth       | JWT + Passport                      |
| Validation | class-validator + class-transformer |

---

## Architecture

```
src/
├── auth/              # JWT strategy, guards, decorators
│   ├── guards/
│   ├── strategies/
│   └── decorators/
├── users/             # User entity, creation, role assignment
├── requests/          # Request lifecycle, approval flow, pagination
├── audit/             # Audit log entity, service, admin endpoint
└── common/            # Request context, logging interceptor
```

### Request Lifecycle

```
Staff submits request
        │
        ▼
  status: SUBMITTED
        │
   ┌────┴────┐
   ▼         ▼
APPROVED   REJECTED
```

### Audit Trail

Every significant action generates an immutable audit record:

```json
{
  "action": "REQUEST_APPROVED",
  "performedBy": "user-uuid",
  "targetId": "request-uuid",
  "timestamp": "2025-01-15T09:23:11.000Z"
}
```

---

## Role Permissions

| Endpoint                    | Staff | Manager | Admin |
| --------------------------- | ----- | ------- | ----- |
| POST /auth/login            | ✅    | ✅      | ✅    |
| GET /users/profile          | ✅    | ✅      | ✅    |
| POST /requests              | ✅    | ✅      | ✅    |
| GET /requests/me            | ✅    | ✅      | ✅    |
| GET /requests               | ❌    | ✅      | ✅    |
| PATCH /requests/:id/approve | ❌    | ✅      | ✅    |
| PATCH /requests/:id/reject  | ❌    | ✅      | ✅    |
| POST /users                 | ❌    | ❌      | ✅    |
| GET /audit-logs             | ❌    | ❌      | ✅    |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+

### Setup

```bash
# Clone repository
git clone https://github.com/Prathik-26/internal-ops-management-system

# Install backend dependencies
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run start:dev
```

### Default Admin Account

```
Email:    admin@test.com
Password: password123
```

## Live Demo

```
Frontend: https://oms-two-sigma.vercel.app
Backend API: https://internal-operations-management-system-production.up.railway.app
```

---

## API Reference

### Auth

```
POST /auth/login          Login and receive access token
```

### Users

```
GET  /users/profile       Get current user profile
POST /users               Create user (Admin only)
```

### Requests

```
POST   /requests              Submit a new request
GET    /requests/me           View own requests
GET    /requests              View all requests (Manager+)
GET    /requests?status=submitted&page=1&limit=10
PATCH  /requests/:id/approve  Approve request (Manager+)
PATCH  /requests/:id/reject   Reject request (Manager+)
```

### Audit

```
GET /audit-logs           View audit trail (Admin only)
```

---

## Architecture Decision Records

Key design decisions are documented in [`/docs/decisions`](/docs/decisions):

- [001 — Auth Strategy](/docs/decisions/001-auth-strategy.md)
- [002 — Role Model](/docs/decisions/002-role-model.md)
- [003 — Audit Log Design](/docs/decisions/003-audit-log-design.md)
- [004 — Database Choice](/docs/decisions/004-database-choice.md)

---
