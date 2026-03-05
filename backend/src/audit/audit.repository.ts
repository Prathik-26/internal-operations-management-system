import { Injectable } from '@nestjs/common';
import { AuditLog } from './interfaces/audit-log.interface';

@Injectable()
export class AuditRepository {
  private logs: AuditLog[] = [];

  save(log: AuditLog): AuditLog {
    this.logs.push(log);
    return log;
  }

  findAll(): AuditLog[] {
    return this.logs;
  }
}
