import { Injectable, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';
import { hashPassword } from '../auth/utils/hash.util';
import { CreateUserDto } from './dto/create-user.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private auditService: AuditService,
  ) {}

  async onModuleInit(): Promise<void> {
    const existing = await this.userRepo.findOne({
      where: { email: 'admin@test.com' },
    });

    if (!existing) {
      const passwordHash = await hashPassword('password123');
      const admin = this.userRepo.create({
        email: 'admin@test.com',
        passwordHash,
        role: Role.ADMIN,
      });
      await this.userRepo.save(admin);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async updateRefreshToken(
    userId: string,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await this.userRepo.update(userId, { refreshTokenHash });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const exists = await this.findByEmail(dto.email);
    if (exists)
      throw new ConflictException(
        'A user with this email already exists. Please use a different email address',
      );

    const passwordHash = await hashPassword(dto.password);

    const user = this.userRepo.create({
      email: dto.email,
      passwordHash,
      role: dto.role,
    });

    const saved = await this.userRepo.save(user);
    this.auditService.log('USER_CREATED', 'admin', saved.id);
    return saved;
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      select: ['id', 'email', 'role', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' },
    });
  }
}
