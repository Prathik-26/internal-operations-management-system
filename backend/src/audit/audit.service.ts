import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AuditRepository } from './audit.repository';
import { AuditLog } from './interfaces/audit-log.interface';

@Injectable()
export class AuditService {
  constructor(private auditRepo: AuditRepository) {}

  log(action: string, performedBy: string, targetId: string): AuditLog {
    const entry: AuditLog = {
      id: randomUUID(),
      action,
      performedBy,
      targetId,
      timestamp: new Date(),
    };

    return this.auditRepo.save(entry);
  }

  getAll(): AuditLog[] {
    return this.auditRepo.findAll();
  }
}
