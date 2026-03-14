import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
  ) {}

  log(action: string, performedBy: string, targetId: string): void {
    const entry = this.auditRepo.create({ action, performedBy, targetId });
    void this.auditRepo.save(entry);
  }

  async getAll(): Promise<AuditLog[]> {
    return this.auditRepo.find({ order: { timestamp: 'DESC' } });
  }
}
