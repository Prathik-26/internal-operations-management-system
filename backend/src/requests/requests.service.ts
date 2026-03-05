import { Injectable, NotFoundException } from '@nestjs/common';
import { RequestItem } from './interfaces/request.interface';
import { RequestStatus } from './enums/request-status.enum';
import { randomUUID } from 'crypto';
import { CreateRequestDto } from './dto/create-request.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class RequestsService {
  private requests: RequestItem[] = [];

  constructor(private auditService: AuditService) {}

  create(dto: CreateRequestDto, userId: string): RequestItem {
    const request: RequestItem = {
      id: randomUUID(),
      title: dto.title,
      description: dto.description,
      status: RequestStatus.SUBMITTED,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.requests.push(request);
    this.auditService.log('REQUEST_CREATED', userId, request.id);
    return request;
  }

  findOwn(userId: string): RequestItem[] {
    return this.requests.filter((r) => r.createdBy === userId);
  }

  findAll(): RequestItem[] {
    return this.requests;
  }

  updateStatus(
    id: string,
    status: RequestStatus,
    performedBy: string,
  ): RequestItem {
    const req = this.requests.find((r) => r.id === id);
    if (!req) throw new NotFoundException('Request not found');

    req.status = status;
    req.updatedAt = new Date();
    this.auditService.log(`REQUEST_${status.toUpperCase()}`, performedBy, id);

    return req;
  }
}
