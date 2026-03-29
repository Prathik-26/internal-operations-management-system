import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './entities/request.entity';
import { RequestStatus } from './enums/request-status.enum';
import { CreateRequestDto } from './dto/create-request.dto';
import { QueryRequestsDto } from './dto/query-requests.dto';
import { PaginatedResult } from './interfaces/paginated-result.interface';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestRepo: Repository<Request>,
    private auditService: AuditService,
  ) {}

  async create(dto: CreateRequestDto, userId: string): Promise<Request> {
    const request = this.requestRepo.create({
      title: dto.title,
      description: dto.description,
      status: RequestStatus.SUBMITTED,
      createdById: userId,
    });

    const saved = await this.requestRepo.save(request);
    this.auditService.log('REQUEST_CREATED', userId, saved.id);
    return saved;
  }

  async findOwn(userId: string): Promise<Request[]> {
    return this.requestRepo.find({ where: { createdById: userId } });
  }

  async findAll(query: QueryRequestsDto): Promise<PaginatedResult<Request>> {
    const qb = this.requestRepo.createQueryBuilder('request');

    if (query.status) {
      qb.where('request.status = :status', { status: query.status });
    }

    const total = await qb.getCount();
    const lastPage = Math.ceil(total / query.limit);

    qb.skip((query.page - 1) * query.limit).take(query.limit);

    const data = await qb.getMany();

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

  async updateStatus(
    id: string,
    status: RequestStatus,
    performedBy: string,
  ): Promise<Request> {
    const req = await this.requestRepo.findOne({ where: { id } });
    if (!req)
      throw new NotFoundException(
        'This request no longer exists. It may have been deleted',
      );

    if (req.status !== RequestStatus.SUBMITTED)
      throw new BadRequestException(
        `This request has already been ${req.status}. Only pending requests can be updated`,
      );

    req.status = status;
    const saved = await this.requestRepo.save(req);
    this.auditService.log(`REQUEST_${status.toUpperCase()}`, performedBy, id);

    return saved;
  }
}
