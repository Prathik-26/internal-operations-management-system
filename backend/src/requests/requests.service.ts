import { Injectable, NotFoundException } from '@nestjs/common';
import { RequestItem } from './interfaces/request.interface';
import { RequestStatus } from './enums/request-status.enum';
import { randomUUID } from 'crypto';
import { CreateRequestDto } from './dto/create-request.dto';
import { QueryRequestsDto } from './dto/query-requests.dto';
import { PaginatedResult } from './interfaces/paginated-result.interface';
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

  findAll(query: QueryRequestsDto): PaginatedResult<RequestItem> {
    let filtered = this.requests;

    if (query.status) {
      filtered = filtered.filter((r) => r.status === query.status);
    }

    const total = filtered.length;
    const lastPage = Math.ceil(total / query.limit);
    const start = (query.page - 1) * query.limit;
    const data = filtered.slice(start, start + query.limit);

    return {
      data,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        lastPage,
      },
    };
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
