# 002 — Role Model Design

## Problem

The system needs to control what different users can see and do.
Needed to decide between a flat role system vs a permission-based system.

## Options Considered

1. **Flat roles (Admin / Manager / Staff)** — simple enum, guard checks role
2. **Permission-based RBAC** — each action has a permission, roles assigned permissions
3. **Attribute-based access control (ABAC)** — access based on resource attributes

## Decision

Flat role enum (Option 1) with NestJS guards and decorators.
