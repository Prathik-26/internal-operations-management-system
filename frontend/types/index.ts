export type Role = "admin" | "manager" | "staff";

export interface AuthUser {
  userId: string;
  role: Role;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RequestItem {
  id: string;
  title: string;
  description: string;
  status: "submitted" | "approved" | "rejected";
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  targetId: string;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}
