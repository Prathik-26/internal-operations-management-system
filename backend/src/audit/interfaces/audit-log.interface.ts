export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  targetId: string;
  timestamp: Date;
}
