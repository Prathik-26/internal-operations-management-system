import { Injectable, NotFoundException } from '@nestjs/common';
import { RequestItem } from './interfaces/request.interface';
import { RequestStatus } from './enums/request-status.enum';
import { randomUUID } from 'crypto';
import { CreateRequestDto } from './dto/create-request.dto';

@Injectable()
export class RequestsService {
  private requests: RequestItem[] = [];

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
    return request;
  }

  findOwn(userId: string): RequestItem[] {
    return this.requests.filter((r) => r.createdBy === userId);
  }

  findAll(): RequestItem[] {
    return this.requests;
  }

  updateStatus(id: string, status: RequestStatus): RequestItem {
    const req = this.requests.find((r) => r.id === id);
    if (!req) throw new NotFoundException('Request not found');

    req.status = status;
    req.updatedAt = new Date();

    return req;
  }
}
