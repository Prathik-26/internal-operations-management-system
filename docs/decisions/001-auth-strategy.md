# 001 — Authentication Strategy

## Problem

The system needs to authenticate users across multiple roles (Admin, Manager, Staff).
Sessions vs tokens needed to be evaluated for an internal tool context.

## Options Considered

1. **Session-based auth** — server stores session state, cookie sent to client
2. **JWT (stateless)** — token issued at login, verified on each request

## Decision

JWT with short-lived access tokens (15 minutes).
